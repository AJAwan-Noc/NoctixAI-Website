require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;

app.disable("x-powered-by");

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const safeValidationResponse = {
  success: false,
  message: "Please check the form and try again.",
};

const safeErrorResponse = {
  success: false,
  message: "Something went wrong. Please try again.",
};

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  })
);
app.use((req, res, next) => {
  const origin = req.get("origin");

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: "Origin is not allowed.",
    });
  }

  next();
});
app.use(express.json({ limit: "100kb" }));

const formRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: safeValidationResponse,
});

const allowedFields = [
  "name",
  "email",
  "service_needed",
  "phone",
  "company_name",
  "website",
  "budget_range",
  "timeline",
  "message",
  "timezone",
  "company_website_confirm",
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanStringField(value) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function validateAndCleanForm(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const cleaned = {};

  for (const field of allowedFields) {
    const value = cleanStringField(body[field]);

    if (value === null) {
      return null;
    }

    cleaned[field] = value;
  }

  if (cleaned.company_website_confirm) {
    return null;
  }

  if (!cleaned.name || !cleaned.email || !cleaned.service_needed) {
    return null;
  }

  cleaned.email = cleaned.email.toLowerCase();

  if (!isValidEmail(cleaned.email)) {
    return null;
  }

  return {
    source: "noctix-website",
    name: cleaned.name,
    email: cleaned.email,
    phone: cleaned.phone,
    company_name: cleaned.company_name,
    website: cleaned.website,
    service_needed: cleaned.service_needed,
    budget_range: cleaned.budget_range,
    timeline: cleaned.timeline,
    message: cleaned.message,
    timezone: cleaned.timezone,
    company_website_confirm: cleaned.company_website_confirm,
    submitted_at: new Date().toISOString(),
  };
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/website-form-filled", formRateLimiter, async (req, res) => {
  const payload = validateAndCleanForm(req.body);

  if (!payload) {
    return res.status(400).json(safeValidationResponse);
  }

  if (!process.env.N8N_WEBHOOK_URL || !process.env.N8N_WEBHOOK_SECRET) {
    return res.status(500).json(safeErrorResponse);
  }

  try {
    console.log('Forwarding lead to n8n:', {
      name: payload.name,
      email: payload.email,
      service_needed: payload.service_needed,
      hasMessage: Boolean(payload.message),
    });

    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-noctix-secret': process.env.N8N_WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
    });

    if (!n8nResponse.ok) {
      console.warn('n8n webhook returned a non-success status:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
      });

      return res.status(500).json(safeErrorResponse);
    }

    return res.json({
      success: true,
      message: "Lead submitted successfully",
      show_booking: true,
    });
  } catch (error) {
    return res.status(500).json(safeErrorResponse);
  }
});

const freebieRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: safeValidationResponse,
});

function extractValidEmail(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const email = cleanStringField(body.email);

  if (email === null || !email) {
    return null;
  }

  const lower = email.toLowerCase();

  if (!isValidEmail(lower)) {
    return null;
  }

  return lower;
}

app.post("/api/freebie-request", freebieRateLimiter, async (req, res) => {
  const email = extractValidEmail(req.body);

  if (!email) {
    return res.status(400).json(safeValidationResponse);
  }

  if (!process.env.FREEBIE_WEBHOOK_URL || !process.env.FREEBIE_WEBHOOK_SECRET) {
    return res.status(500).json(safeErrorResponse);
  }

  try {
    const n8nResponse = await fetch(process.env.FREEBIE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-noctix-secret": process.env.FREEBIE_WEBHOOK_SECRET,
      },
      body: JSON.stringify({ email }),
    });

    if (!n8nResponse.ok) {
      return res.status(500).json(safeErrorResponse);
    }

    return res.json({ success: true, message: "Guide is on its way" });
  } catch (error) {
    return res.status(500).json(safeErrorResponse);
  }
});

app.use((err, req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.type === "entity.parse.failed")) {
    return res.status(400).json(safeValidationResponse);
  }

  return res.status(500).json(safeErrorResponse);
});

app.listen(PORT, () => {
  console.log(`Noctix backend listening on port ${PORT}`);
});
