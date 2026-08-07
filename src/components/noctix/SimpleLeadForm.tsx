import { useId, useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { newEventId, track } from "@/lib/analytics";

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

const FIELD_META: Record<OptionalField, { type: string; label: string; placeholder: string }> = {
  company_name: { type: "text", label: "Company name", placeholder: "Company name (optional)" },
  website: { type: "url", label: "Website", placeholder: "Website (optional)" },
  message: {
    type: "textarea",
    label: "What are you trying to fix?",
    placeholder: "What are you trying to fix?",
  },
  phone: { type: "tel", label: "Phone", placeholder: "Phone (optional)" },
};

export function SimpleLeadForm({
  serviceNeeded,
  submitLabel = "Send my details",
  successMessage = "Thanks, we'll be in touch shortly.",
  fields = [],
}: SimpleLeadFormProps) {
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<"name" | "email" | null>(null);
  const errorId = `${id}-error`;

  function setExtra(key: string, value: string) {
    setExtras((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;

    if (!name.trim()) {
      setError("Name is required.");
      setErrorField("name");
      return;
    }
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      setErrorField("email");
      return;
    }

    setError(null);
    setErrorField(null);
    setState("submitting");

    const metaEventId = newEventId();
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
      meta_event_id: metaEventId,
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
      track("lead_submit", { eventId: metaEventId, service_needed: serviceNeeded });
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div role="status" aria-live="polite" className="py-6">
        <div className="font-display text-xl font-semibold text-[var(--lime)]">
          Thanks — that's in.
        </div>
        <p className="mt-2 text-sm text-foreground/60">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor={`${id}-name`} className="block text-sm font-medium text-foreground">
          Full name
        </label>
        <input
          id={`${id}-name`}
          type="text"
          required
          aria-required="true"
          aria-invalid={errorField === "name"}
          aria-describedby={errorField === "name" ? errorId : undefined}
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor={`${id}-email`} className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          aria-required="true"
          aria-invalid={errorField === "email"}
          aria-describedby={errorField === "email" ? errorId : undefined}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
        />
      </div>
      {fields.map((key) => {
        const meta = FIELD_META[key];
        const fieldId = `${id}-${key}`;
        if (meta.type === "textarea") {
          return (
            <div key={key} className="space-y-1">
              <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
                {meta.label}
              </label>
              <textarea
                id={fieldId}
                rows={3}
                placeholder={meta.placeholder}
                value={extras[key] ?? ""}
                onChange={(e) => setExtra(key, e.target.value)}
                className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
              />
            </div>
          );
        }
        return (
          <div key={key} className="space-y-1">
            <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
              {meta.label}
            </label>
            <input
              id={fieldId}
              type={meta.type}
              placeholder={meta.placeholder}
              value={extras[key] ?? ""}
              onChange={(e) => setExtra(key, e.target.value)}
              className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
            />
          </div>
        );
      })}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
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
        <div role="alert" className="space-y-2 text-sm text-red-700 dark:text-red-300">
          <p>
            Something went wrong on our end. Please email us directly at{" "}
            <a href="mailto:hello@noctix.app" className="underline underline-offset-2">
              hello@noctix.app
            </a>{" "}
            and we'll get back to you shortly.
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
