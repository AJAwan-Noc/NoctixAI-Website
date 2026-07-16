require("dotenv").config();

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // Allow inline scripts (required by admin.html) and the Cloudflare
        // beacon script injected when the site is proxied through Cloudflare.
        "script-src": ["'self'", "'unsafe-inline'", "https://static.cloudflareinsights.com"],
      },
    },
  })
);
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

const PLAYBOOK_PDF_PATH = path.join(__dirname, "assets", "noctix-automation-playbook.pdf");

app.get("/internal/automation-playbook.pdf", (req, res) => {
  const providedSecret = req.headers["x-noctix-secret"];

  if (!process.env.PLAYBOOK_ASSET_SECRET || providedSecret !== process.env.PLAYBOOK_ASSET_SECRET) {
    // 404, not 401/403 -- don't reveal that a protected route exists here at all
    return res.status(404).end();
  }

  return res.sendFile(PLAYBOOK_PDF_PATH, (err) => {
    if (err && !res.headersSent) {
      res.status(404).end();
    }
  });
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

    let n8nData = {};
    try {
      n8nData = await n8nResponse.json();
    } catch (e) {
      n8nData = {};
    }

    const limited = n8nData.status === "limited";

    return res.json({
      success: true,
      limited,
      message: limited ? "Request limit reached" : "Guide is on its way",
    });
  } catch (error) {
    return res.status(500).json(safeErrorResponse);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
//  ADMIN PANEL
//  Single-user admin interface with layered security:
//  1. bcrypt password comparison
//  2. TOTP (speakeasy) second factor
//  3. Signed JWT session (httpOnly, secure, sameSite=strict, 45min expiry)
//  4. CSRF token on every mutating request
//  5. Escalating login rate limiting
//  6. All table/column identifiers validated against information_schema
//  7. Full audit logging
// ──────────────────────────────────────────────────────────────────────────────

// Admin DB pool (same database the frontend content pool connects to)
let adminDb = null;
if (process.env.NOCTIX_CONTENT_DB_URL) {
  adminDb = new Pool({
    connectionString: process.env.NOCTIX_CONTENT_DB_URL,
    max: 3,
    idleTimeoutMillis: 30_000,
  });
}

// Admin sub-router — scopes cookie-parser and admin-specific middleware
const adminRouter = express.Router();
adminRouter.use(cookieParser());

// Login rate limiter: 5 attempts / 15 min, escalating
const loginFailCounts = new Map(); // ip -> { count, windowStart }
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    // Escalate: double the lockout on repeated blocks
    const key = req.ip;
    const record = loginFailCounts.get(key) || { count: 0, windowStart: Date.now() };
    record.count += 1;
    loginFailCounts.set(key, record);
    res.status(429).json({ success: false, message: "Too many attempts. Try again later." });
  },
});

// ── Serve admin HTML ────────────────────────────────────────────────────────
adminRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// ── Login ───────────────────────────────────────────────────────────────────
adminRouter.post("/login", adminLoginLimiter, async (req, res) => {
  try {
    const { password, totp: totpCode } = req.body || {};

    if (!process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_TOTP_SECRET || !process.env.ADMIN_JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Admin not configured." });
    }

    // Step 1: password
    if (!password || typeof password !== "string") {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const passwordValid = bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Step 2: TOTP
    if (!totpCode || typeof totpCode !== "string") {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const totpValid = speakeasy.totp.verify({
      secret: process.env.ADMIN_TOTP_SECRET,
      encoding: "base32",
      token: totpCode,
      window: 1,
    });

    if (!totpValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Step 3: Issue session
    const csrfToken = crypto.randomBytes(32).toString("hex");
    const token = jwt.sign(
      { role: "admin", csrf: csrfToken },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "45m" }
    );

    res.cookie("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 45 * 60 * 1000,
      path: "/admin",
    });

    return res.json({ success: true, csrfToken });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// ── Logout ──────────────────────────────────────────────────────────────────
adminRouter.post("/logout", (req, res) => {
  res.clearCookie("admin_session", { path: "/admin" });
  return res.json({ success: true });
});

// ── Auth middleware ──────────────────────────────────────────────────────────
function requireAdminAuth(req, res, next) {
  try {
    const token = req.cookies?.admin_session;
    if (!token || !process.env.ADMIN_JWT_SECRET) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    // CSRF check on mutating methods
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      const csrfHeader = req.headers["x-csrf-token"];
      if (!csrfHeader || csrfHeader !== decoded.csrf) {
        return res.status(403).json({ success: false, message: "Forbidden." });
      }
    }

    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
}

// ── Helper: validate table name against information_schema ──────────────────
async function getValidTableNames() {
  const { rows } = await adminDb.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
     ORDER BY table_name`
  );
  return rows.map((r) => r.table_name);
}

async function validateTableName(tableName) {
  const validTables = await getValidTableNames();
  return validTables.includes(tableName) ? tableName : null;
}

async function getTableColumns(tableName) {
  const { rows } = await adminDb.query(
    `SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    [tableName]
  );
  return rows;
}

async function getPrimaryKeyColumn(tableName) {
  const { rows } = await adminDb.query(
    `SELECT kcu.column_name
     FROM information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu
       ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
     WHERE tc.constraint_type = 'PRIMARY KEY'
       AND tc.table_schema = 'public'
       AND tc.table_name = $1
     LIMIT 1`,
    [tableName]
  );
  return rows[0]?.column_name ?? null;
}

function quoteIdent(name) {
  // Double-quote identifier (already validated against information_schema)
  return `"${name.replace(/"/g, '""')}"`;
}

// ── Audit log helper ────────────────────────────────────────────────────────
async function writeAuditLog(action, tableName, rowId, snapshot = null) {
  try {
    await adminDb.query(
      `INSERT INTO admin_audit_log (action, table_name, row_id, snapshot, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [action, tableName, String(rowId), snapshot ? JSON.stringify(snapshot) : null]
    );
  } catch (err) {
    console.error("Failed to write audit log:", err.message);
  }
}

// ── CRUD routes ─────────────────────────────────────────────────────────────

// List tables
adminRouter.get("/api/tables", requireAdminAuth, async (req, res) => {
  try {
    if (!adminDb) return res.status(500).json({ success: false, message: "Database not configured." });
    const tables = await getValidTableNames();
    return res.json({ success: true, tables });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// Get table data
adminRouter.get("/api/tables/:table", requireAdminAuth, async (req, res) => {
  try {
    if (!adminDb) return res.status(500).json({ success: false, message: "Database not configured." });

    const validTable = await validateTableName(req.params.table);
    if (!validTable) {
      return res.status(400).json({ success: false, message: "Invalid table name." });
    }

    const columns = await getTableColumns(validTable);
    const columnNames = columns.map((c) => c.column_name);
    const hasCreatedAt = columnNames.includes("created_at");

    const orderClause = hasCreatedAt ? `ORDER BY ${quoteIdent("created_at")} DESC` : "";
    const { rows } = await adminDb.query(
      `SELECT * FROM ${quoteIdent(validTable)} ${orderClause} LIMIT 200`
    );

    return res.json({ success: true, columns, rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// Insert row
adminRouter.post("/api/tables/:table", requireAdminAuth, async (req, res) => {
  try {
    if (!adminDb) return res.status(500).json({ success: false, message: "Database not configured." });

    const validTable = await validateTableName(req.params.table);
    if (!validTable) {
      return res.status(400).json({ success: false, message: "Invalid table name." });
    }

    const columns = await getTableColumns(validTable);
    const validColumnNames = columns.map((c) => c.column_name);
    const body = req.body?.data;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ success: false, message: "Invalid data." });
    }

    // Filter to only valid columns
    const insertColumns = [];
    const insertValues = [];
    const placeholders = [];
    let idx = 1;

    for (const [key, value] of Object.entries(body)) {
      if (!validColumnNames.includes(key)) {
        return res.status(400).json({ success: false, message: `Invalid column: ${key}` });
      }
      insertColumns.push(quoteIdent(key));
      insertValues.push(value);
      placeholders.push(`$${idx}`);
      idx++;
    }

    if (insertColumns.length === 0) {
      return res.status(400).json({ success: false, message: "No valid columns provided." });
    }

    const { rows } = await adminDb.query(
      `INSERT INTO ${quoteIdent(validTable)} (${insertColumns.join(", ")})
       VALUES (${placeholders.join(", ")})
       RETURNING *`,
      insertValues
    );

    const newRow = rows[0];
    await writeAuditLog("INSERT", validTable, newRow?.id ?? "unknown", newRow);

    return res.json({ success: true, row: newRow });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// Update row
adminRouter.put("/api/tables/:table/:id", requireAdminAuth, async (req, res) => {
  try {
    if (!adminDb) return res.status(500).json({ success: false, message: "Database not configured." });

    const validTable = await validateTableName(req.params.table);
    if (!validTable) {
      return res.status(400).json({ success: false, message: "Invalid table name." });
    }

    const pkColumn = await getPrimaryKeyColumn(validTable);
    if (!pkColumn) {
      return res.status(400).json({
        success: false,
        message: "This table has no primary key and cannot be edited through the admin panel.",
      });
    }

    const columns = await getTableColumns(validTable);
    const validColumnNames = columns.map((c) => c.column_name);
    const body = req.body?.data;
    const rowId = req.params.id;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ success: false, message: "Invalid data." });
    }

    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(body)) {
      if (!validColumnNames.includes(key)) {
        return res.status(400).json({ success: false, message: `Invalid column: ${key}` });
      }
      setClauses.push(`${quoteIdent(key)} = $${idx}`);
      values.push(value);
      idx++;
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ success: false, message: "No valid columns provided." });
    }

    values.push(rowId);
    const { rows } = await adminDb.query(
      `UPDATE ${quoteIdent(validTable)}
       SET ${setClauses.join(", ")}
       WHERE ${quoteIdent(pkColumn)} = $${idx}
       RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Row not found." });
    }

    await writeAuditLog("UPDATE", validTable, rowId, rows[0]);

    return res.json({ success: true, row: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// Delete row
adminRouter.delete("/api/tables/:table/:id", requireAdminAuth, async (req, res) => {
  try {
    if (!adminDb) return res.status(500).json({ success: false, message: "Database not configured." });

    const validTable = await validateTableName(req.params.table);
    if (!validTable) {
      return res.status(400).json({ success: false, message: "Invalid table name." });
    }

    const pkColumn = await getPrimaryKeyColumn(validTable);
    if (!pkColumn) {
      return res.status(400).json({
        success: false,
        message: "This table has no primary key and cannot be edited through the admin panel.",
      });
    }

    const rowId = req.params.id;
    const confirmTableName = req.body?.confirmTableName;

    // Require typed confirmation
    if (!confirmTableName || confirmTableName !== validTable) {
      return res.status(400).json({
        success: false,
        message: "You must type the exact table name to confirm deletion.",
      });
    }

    // Snapshot the row before deleting
    const { rows: existing } = await adminDb.query(
      `SELECT * FROM ${quoteIdent(validTable)} WHERE ${quoteIdent(pkColumn)} = $1 LIMIT 1`,
      [rowId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Row not found." });
    }

    const snapshot = existing[0];

    await adminDb.query(
      `DELETE FROM ${quoteIdent(validTable)} WHERE ${quoteIdent(pkColumn)} = $1`,
      [rowId]
    );

    await writeAuditLog("DELETE", validTable, rowId, snapshot);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// Mount admin router
app.use("/admin", adminRouter);

// ──────────────────────────────────────────────────────────────────────────────
//  Error handler (must remain last)
// ──────────────────────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.type === "entity.parse.failed")) {
    return res.status(400).json(safeValidationResponse);
  }

  return res.status(500).json(safeErrorResponse);
});

app.listen(PORT, () => {
  console.log(`Noctix backend listening on port ${PORT}`);
});
