import { useState, type FormEvent } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const FREEBIE_ENDPOINT = "https://api.noctix.app/api/freebie-request";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FreebieForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setState("submitting");
    try {
      const response = await fetch(FREEBIE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
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
          Check your inbox.
        </div>
        <p className="mt-2 text-sm text-foreground/60">
          Your copy of the guide is on its way. If you don't see it in a minute or two, check your
          spam or promotions folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full flex-1 border border-foreground/15 bg-background px-4 py-3 text-sm"
      />
      <MagneticButton>
        <ShimmerButton
          type="submit"
          disabled={state === "submitting"}
          className="whitespace-nowrap px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "submitting" ? "Sending..." : "Get the guide ->"}
        </ShimmerButton>
      </MagneticButton>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {state === "error" && (
        <p role="alert" className="text-sm text-red-300">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
