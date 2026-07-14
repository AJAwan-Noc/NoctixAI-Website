import { useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const WEBSITE_FORM_ENDPOINT = "https://api.noctix.app/api/website-form-filled";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SimpleLeadFormProps = {
  serviceNeeded: string;
  submitLabel?: string;
  successMessage?: string;
};

function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

export function SimpleLeadForm({
  serviceNeeded,
  submitLabel = "Send my details",
  successMessage = "Thanks, we'll be in touch shortly.",
}: SimpleLeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

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
      phone: phone.trim(),
      company_name: "",
      website: "",
      service_needed: serviceNeeded,
      budget_range: "",
      timeline: "",
      message: "",
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
          Thanks -- that's in.
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
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border border-foreground/15 bg-background px-3 py-2 text-sm"
      />
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
        <p role="alert" className="text-sm text-red-300">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
