import { createFileRoute } from "@tanstack/react-router";
import { Activity, Mic, Type, ChevronRight, ChevronLeft, AlertTriangle, Accessibility, Volume2, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/kiosk")({
  component: Kiosk,
  head: () => ({ meta: [{ title: "Patient Check-In · MedPriority" }] }),
});

const steps = ["Identify", "Symptoms", "Pain Level", "Review"];

function Kiosk() {
  const [step, setStep] = useState(1);
  const [pain, setPain] = useState(4);
  const [mode, setMode] = useState<"voice" | "text">("voice");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent flex flex-col">
      <header className="px-8 py-5 flex items-center justify-between border-b border-border bg-surface/70 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Activity className="size-5" />
          </div>
          <div>
            <div className="font-display text-xl font-semibold">MedPriority</div>
            <div className="text-xs text-muted-foreground">St. Vincent's General · Emergency Check-In</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-12 px-4 rounded-xl border border-border bg-surface flex items-center gap-2 text-sm">
            <Accessibility className="size-4" /> Accessibility
          </button>
          <button className="h-12 px-4 rounded-xl border border-border bg-surface flex items-center gap-2 text-sm">
            <Volume2 className="size-4" /> Read aloud
          </button>
          <button className="h-12 px-5 rounded-xl bg-destructive text-destructive-foreground font-semibold flex items-center gap-2 shadow-lg shadow-destructive/30">
            <AlertTriangle className="size-5" /> EMERGENCY
          </button>
        </div>
      </header>

      <div className="px-8 pt-6">
        <div className="flex items-center gap-3">
          {steps.map((s, i) => {
            const active = i + 1 === step;
            const done = i + 1 < step;
            return (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`size-8 rounded-full flex items-center justify-center text-sm font-semibold ${done ? "bg-success text-primary-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <div className={`text-sm ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</div>
                {i < steps.length - 1 && <div className={`flex-1 h-1 rounded-full ${done ? "bg-success" : "bg-muted"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <main className="flex-1 px-8 py-10 flex items-start justify-center">
        <div className="w-full max-w-3xl">
          {step === 1 && (
            <div className="bg-surface rounded-3xl border border-border p-10 shadow-xl shadow-primary/5">
              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <User className="size-7" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Welcome. Let's get you checked in.</h1>
              <p className="text-muted-foreground mt-2 text-lg">This will take about 2 minutes.</p>
              <div className="mt-8 grid grid-cols-1 gap-4">
                <Field label="Full name" placeholder="Maria González" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date of birth" placeholder="MM / DD / YYYY" />
                  <Field label="Phone" placeholder="(555) 000-0000" />
                </div>
                <Field label="Reason for visit (short)" placeholder="Chest discomfort since this morning" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface rounded-3xl border border-border p-10 shadow-xl shadow-primary/5">
              <h1 className="text-3xl font-semibold tracking-tight">Tell us what you're feeling.</h1>
              <p className="text-muted-foreground mt-2 text-lg">Speak naturally, or tap to type.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => setMode("voice")} className={`h-16 rounded-2xl border text-base font-medium flex items-center justify-center gap-3 ${mode === "voice" ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/40"}`}>
                  <Mic className="size-5" /> Use voice
                </button>
                <button onClick={() => setMode("text")} className={`h-16 rounded-2xl border text-base font-medium flex items-center justify-center gap-3 ${mode === "text" ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/40"}`}>
                  <Type className="size-5" /> Type instead
                </button>
              </div>

              {mode === "voice" ? (
                <div className="mt-8 rounded-3xl bg-gradient-to-b from-primary/5 to-accent/30 border border-border p-10 flex flex-col items-center text-center">
                  <div className="relative size-28 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                    <Mic className="size-12 relative" />
                  </div>
                  <div className="mt-6 text-lg">Listening… describe your symptoms.</div>
                  <div className="mt-2 text-muted-foreground">"I have sharp chest pain and shortness of breath."</div>
                </div>
              ) : (
                <textarea className="mt-8 w-full h-44 rounded-2xl border border-border bg-muted/40 p-5 text-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Describe your symptoms in your own words…" />
              )}

              <div className="mt-6">
                <div className="text-sm text-muted-foreground mb-3">Common symptoms — tap any that apply</div>
                <div className="flex flex-wrap gap-2">
                  {["Chest pain", "Shortness of breath", "Fever", "Headache", "Dizziness", "Abdominal pain", "Bleeding", "Vomiting"].map((t) => (
                    <button key={t} className="h-12 px-5 rounded-full border border-border bg-surface hover:border-primary hover:bg-primary/5 text-sm font-medium">{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-surface rounded-3xl border border-border p-10 shadow-xl shadow-primary/5">
              <h1 className="text-3xl font-semibold tracking-tight">How bad is your pain right now?</h1>
              <p className="text-muted-foreground mt-2 text-lg">0 means no pain. 10 means the worst pain you can imagine.</p>
              <div className="mt-10 flex justify-between gap-2">
                {Array.from({ length: 11 }).map((_, i) => {
                  const active = pain === i;
                  const tone = i <= 3 ? "bg-priority-low/20 text-priority-low border-priority-low/40" : i <= 6 ? "bg-priority-medium/20 text-priority-medium border-priority-medium/40" : i <= 8 ? "bg-priority-high/20 text-priority-high border-priority-high/40" : "bg-priority-critical/20 text-priority-critical border-priority-critical/40";
                  return (
                    <button key={i} onClick={() => setPain(i)} className={`flex-1 h-20 rounded-2xl border-2 text-2xl font-semibold transition-all ${active ? `${tone} scale-110 shadow-lg` : "border-border bg-muted/40 hover:bg-muted text-muted-foreground"}`}>{i}</button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-between text-sm text-muted-foreground">
                <span>No pain</span><span>Mild</span><span>Severe</span><span>Worst possible</span>
              </div>
              <div className="mt-10 rounded-2xl bg-muted/40 border border-border p-5 flex gap-4 items-center">
                <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${pain <= 3 ? "text-priority-low bg-priority-low/15" : pain <= 6 ? "text-priority-medium bg-priority-medium/15" : pain <= 8 ? "text-priority-high bg-priority-high/15" : "text-priority-critical bg-priority-critical/15"}`}>{pain}</div>
                <div>
                  <div className="font-medium">{pain <= 3 ? "Mild discomfort" : pain <= 6 ? "Moderate pain" : pain <= 8 ? "Severe pain" : "Worst possible pain"}</div>
                  <div className="text-sm text-muted-foreground">A nurse will review your input shortly.</div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-surface rounded-3xl border border-border p-10 shadow-xl shadow-primary/5">
              <h1 className="text-3xl font-semibold tracking-tight">All set, Maria.</h1>
              <p className="text-muted-foreground mt-2 text-lg">Please take a seat. We've passed your information to the triage nurse.</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <Stat label="Queue position" value="#7" />
                <Stat label="Estimated wait" value="22 min" />
                <Stat label="Priority" value="Level 3" tone="medium" />
              </div>
              <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5">
                <div className="text-sm font-medium">Summary</div>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Chest discomfort, shortness of breath</li>
                  <li>• Pain level: {pain}/10</li>
                  <li>• No known allergies reported</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setStep(Math.max(1, step - 1))} className="h-14 px-6 rounded-2xl border border-border bg-surface flex items-center gap-2 text-base font-medium disabled:opacity-40" disabled={step === 1}>
              <ChevronLeft className="size-5" /> Back
            </button>
            <button onClick={() => setStep(Math.min(4, step + 1))} className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground flex items-center gap-2 text-base font-semibold shadow-lg shadow-primary/30">
              {step === 4 ? "Finish check-in" : "Continue"} <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input className="mt-2 w-full h-14 px-4 rounded-2xl border border-border bg-muted/40 text-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder={placeholder} />
    </label>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "medium" }) {
  return (
    <div className={`rounded-2xl p-5 border ${tone === "medium" ? "bg-priority-medium/15 border-priority-medium/40" : "bg-muted/40 border-border"}`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
