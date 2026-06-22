import { useEffect, useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const WEBSITE_FORM_ENDPOINT = "https://api.noctix.app/api/website-form-filled";

const SUCCESS_MESSAGE =
  "Thanks — your details have been submitted. We’ll review them and get back to you shortly.";
const ERROR_MESSAGE = "Something went wrong. Please try again.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WebsiteFormPayload = {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  website: string;
  service_needed: string;
  budget_range: string;
  timeline: string;
  message: string;
  timezone: string;
  company_website_confirm: string;
};

type WebsiteFormResponse = {
  success?: boolean;
  message?: string;
};

type FormErrors = Partial<Record<keyof WebsiteFormPayload, string>>;
type SubmitState = "idle" | "submitting" | "success" | "error";

type WebsiteLeadFormProps = {
  introLabel?: string;
  submitLabel?: string;
};

type TextFieldProps = {
  label: string;
  name: keyof WebsiteFormPayload;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
};

type SelectFieldProps = {
  label: string;
  name: keyof WebsiteFormPayload;
  placeholder: string;
  options: string[];
  required?: boolean;
  error?: string;
  className?: string;
};

const serviceOptions = [
  "AI voice agents",
  "CRM and sales automation",
  "Workflow automation",
  "Lead generation systems",
  "Dashboards and reporting",
  "Internal AI tools",
  "Not sure yet",
];

const budgetOptions = [
  "Under $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "Not sure yet",
];

const timelineOptions = [
  "ASAP",
  "This month",
  "Next 1-2 months",
  "This quarter",
  "Exploring options",
];

function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

function readFormValue(formData: FormData, key: keyof WebsiteFormPayload) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validatePayload(payload: WebsiteFormPayload) {
  const errors: FormErrors = {};

  if (!payload.name) {
    errors.name = "Name is required.";
  }

  if (!payload.email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(payload.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!payload.service_needed) {
    errors.service_needed = "Choose a service.";
  }

  return errors;
}

export function WebsiteLeadForm({
  introLabel = "// Intake - 2 minutes",
  submitLabel = "Request Audit",
}: WebsiteLeadFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [timezone, setTimezone] = useState("");
  const isSubmitting = submitState === "submitting";
  const isSuccess = submitState === "success";

  useEffect(() => {
    setTimezone(getBrowserTimezone());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const payload: WebsiteFormPayload = {
      name: readFormValue(formData, "name"),
      email: readFormValue(formData, "email"),
      phone: readFormValue(formData, "phone"),
      company_name: readFormValue(formData, "company_name"),
      website: readFormValue(formData, "website"),
      service_needed: readFormValue(formData, "service_needed"),
      budget_range: readFormValue(formData, "budget_range"),
      timeline: readFormValue(formData, "timeline"),
      message: readFormValue(formData, "message"),
      timezone: readFormValue(formData, "timezone") || getBrowserTimezone(),
      company_website_confirm: readFormValue(formData, "company_website_confirm"),
    };

    const nextErrors = validatePayload(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitState("idle");
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch(WEBSITE_FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as WebsiteFormResponse;

      if (!response.ok || data.success !== true) {
        throw new Error(data.message || "Lead submission failed");
      }

      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative h-full bg-background/70 p-6 backdrop-blur-sm sm:p-8 md:p-10"
    >
      <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
        {introLabel}
      </div>

      {isSuccess ? (
        <div className="flex min-h-[430px] flex-col items-start justify-center">
          <div className="font-display text-3xl font-semibold text-[var(--lime)]">
            Transmission received.
          </div>
          <p className="mt-4 max-w-md text-base leading-7 text-foreground/70">{SUCCESS_MESSAGE}</p>
        </div>
      ) : (
        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          <input name="timezone" type="hidden" value={timezone} readOnly />
          <input name="company_website_confirm" type="hidden" value="" readOnly />

          <TextField
            label="Name"
            name="name"
            placeholder="Your full name"
            required
            error={errors.name}
          />
          <TextField
            label="Work email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            error={errors.email}
          />
          <TextField label="Phone" name="phone" type="tel" placeholder="+1 555 0142" />
          <TextField label="Company" name="company_name" placeholder="Company name" />
          <TextField
            label="Website"
            name="website"
            type="url"
            placeholder="https://company.com"
            className="sm:col-span-2"
          />
          <SelectField
            label="Service needed"
            name="service_needed"
            placeholder="Choose the best fit"
            options={serviceOptions}
            required
            error={errors.service_needed}
            className="sm:col-span-2"
          />
          <SelectField
            label="Budget range"
            name="budget_range"
            placeholder="Select a range"
            options={budgetOptions}
          />
          <SelectField
            label="Timeline"
            name="timeline"
            placeholder="When do you want to start?"
            options={timelineOptions}
            className="sm:col-span-2"
          />
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              What should we know?
            </span>
            <textarea
              name="message"
              rows={5}
              placeholder="Tell us what you want automated, improved, or untangled."
              className="w-full border border-foreground/10 bg-foreground/[0.02] px-4 py-3 font-sans text-base text-foreground placeholder:text-foreground/25 focus:border-[var(--lime)] focus:outline-none focus:ring-0"
            />
          </label>

          <div className="flex flex-col items-start gap-4 sm:col-span-2">
            {submitState === "error" ? (
              <p role="alert" className="text-sm text-red-300">
                {ERROR_MESSAGE}
              </p>
            ) : null}
            {isSubmitting ? (
              <p
                role="status"
                aria-live="polite"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40"
              >
                Submitting your details...
              </p>
            ) : null}
            <MagneticButton>
              <ShimmerButton
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : `${submitLabel} ->`}
              </ShimmerButton>
            </MagneticButton>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/30">
              No spam. No SDR follow-up loops. Just a real call.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}

function TextField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  error,
  className = "",
}: TextFieldProps) {
  return (
    <label className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <span className="break-words font-mono text-[10px] uppercase leading-5 tracking-[0.22em] text-foreground/40 sm:tracking-[0.3em]">
        {label}
        {required ? <span className="text-[var(--lime)]"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full min-w-0 border border-foreground/10 bg-foreground/[0.02] px-4 py-3 font-sans text-base text-foreground placeholder:text-foreground/25 focus:border-[var(--lime)] focus:outline-none focus:ring-0"
      />
      {error ? (
        <span id={`${name}-error`} className="text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  placeholder,
  options,
  required,
  error,
  className = "",
}: SelectFieldProps) {
  return (
    <label className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <span className="break-words font-mono text-[10px] uppercase leading-5 tracking-[0.22em] text-foreground/40 sm:tracking-[0.3em]">
        {label}
        {required ? <span className="text-[var(--lime)]"> *</span> : null}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full min-w-0 whitespace-normal border border-foreground/10 bg-background px-4 py-3 font-sans text-base leading-6 text-foreground focus:border-[var(--lime)] focus:outline-none focus:ring-0"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? (
        <span id={`${name}-error`} className="text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}
