import { useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const WEBSITE_FORM_ENDPOINT = "https://api.noctix.app/api/website-form-filled";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type OptionalField = "company_name" | "website" | "message" | "phone";

type SimpleLeadFormProps = {
  serviceNeeded: string;
  submitLabel?: string;
  successMessage?: string;
  /** Additional optional fields beyond the default name / email. */
  fields?: OptionalField[];
};

function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

const FIELD_META: Record<OptionalField, { type: string; placeholder: string }> = {
  company_name: { type: "text", placeholder: "Company name (optional)" },
  website: { type: "url", placeholder: "Website (optional)" },
  message: { type: "textarea", placeholder: "What are you trying to fix?" },
  phone: { type: "tel", placeholder: "Phone (optional)" },
};

export function SimpleLeadForm({
  serviceNeeded,
  submitLabel = "Send my details",
  successMessage = "Thanks, we'll be in touch shortly.",
  fields = [],
}: SimpleLeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function setExtra(key: string, value: string) {
    setExtras((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    setState("submitting");

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: (extras.phone ?? "").trim(),
      company_name: (extras.company_name ?? "").trim(),
      website: (extras.website ?? "").trim(),
      service_needed: serviceNeeded,
      budget_range: "",
      timeline: "",
      message: (extras.message ?? "").trim(),
      timezone: getBrowserTimezone(),
      company_website_confirm: "",
    };

    try {
      const response = await fetch(WEBSITE_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.success !== true) {
        throw new Error(data.message || "Submission failed");
      }
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="py-6">
        <div className="font-display text-xl font-semibold text-[var(--lime)]">
          Thanks — that's in.
        </div>
        <p className="mt-2 text-sm text-foreground/60">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        required
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
      />
      {fields.map((key) => {
        const meta = FIELD_META[key];
        if (meta.type === "textarea") {
          return (
            <textarea
              key={key}
              rows={3}
              placeholder={meta.placeholder}
              value={extras[key] ?? ""}
              onChange={(e) => setExtra(key, e.target.value)}
              className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
            />
          );
        }
        return (
          <input
            key={key}
            type={meta.type}
            placeholder={meta.placeholder}
            value={extras[key] ?? ""}
            onChange={(e) => setExtra(key, e.target.value)}
            className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
          />
        );
      })}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <MagneticButton>
        <ShimmerButton
          type="submit"
          disabled={state === "submitting"}
          className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "submitting" ? "Sending..." : `${submitLabel} ->`}
        </ShimmerButton>
      </MagneticButton>
      {state === "error" && (
        <div role="alert" className="space-y-2 text-sm text-red-300">
          <p>
            Something went wrong on our end. You can{" "}
            <a
              href={`mailto:hello@noctix.app?subject=${encodeURIComponent(
                "Enquiry: " + serviceNeeded
              )}&body=${encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${extras.message ?? ""}`
              )}`}
              className="underline underline-offset-2"
            >
              email us directly
            </a>{" "}
            instead — we've filled in your details.
          </p>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}
    </form>
  );
}
