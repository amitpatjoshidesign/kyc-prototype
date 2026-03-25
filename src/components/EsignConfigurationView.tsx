"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Copy,
  RocketLaunch,
} from "@phosphor-icons/react";

const STEPS = [
  { title: "Configure product" },
  { title: "Test product" },
  { title: "Add details for production" },
];

// Figma asset URLs (valid 7 days) — prefill defaults from the Groww whitelabel design
const DEFAULT_LOGO_URL = "https://www.figma.com/api/mcp/asset/12d5cb49-f694-4f28-97c3-0c26a01bff2d";
const AADHAAR_EMBLEM_URL = "https://www.figma.com/api/mcp/asset/3f3627da-0e54-4712-b825-d05ed50f3904";
const AADHAAR_LOGO_URL = "https://www.figma.com/api/mcp/asset/61935944-42a9-403c-a237-effa61088cc6";

/* ── Step 0: Configure product ── */
function StepConfigureProduct({
  orgName, setOrgName,
  logoUrl, setLogoUrl,
  primaryColor, setPrimaryColor,
  fontColor, setFontColor,
  bgColor, setBgColor,
}: {
  orgName: string; setOrgName: (v: string) => void;
  logoUrl: string; setLogoUrl: (v: string) => void;
  primaryColor: string; setPrimaryColor: (v: string) => void;
  fontColor: string; setFontColor: (v: string) => void;
  bgColor: string; setBgColor: (v: string) => void;
}) {
  const [logoType, setLogoType] = useState<"upload" | "url">("url");
  const [showPreview, setShowPreview] = useState(false);
  const [nameMatching, setNameMatching] = useState(false);
  const [autoRedirect, setAutoRedirect] = useState(false);
  const [redirectTime, setRedirectTime] = useState(5);

  return (
    <div className="space-y-6">
      {/* Integration details */}
      <div className="rounded-xl border border-border p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">
          Refer to these product resources to start integrating APIs
        </p>
        <div className="flex flex-wrap gap-2">
          {["API docs ↗", "API playground ↗", "Get started ↗"].map((label) => (
            <Button key={label} variant="outline" size="sm" className="text-xs">
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Form fields */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Customise pre-built UI</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-5">
          If you choose to opt for our pre-built UI solution for Aadhaar eSign, you can add your
          branding details to customise the default UI.
        </p>
      </div>

        <div className="space-y-5">
          {/* Organisation brand details */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Organisation brand details</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Organisation name *
                </label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Corp Ltd."
                  className="text-xs"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the legal name of your business. This will be shown on the eSign UI.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Logo *</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {(
                    [
                      ["upload", "Upload image"],
                      ["url", "Provide a link"],
                    ] as const
                  ).map(([val, label]) => (
                    <label key={val} className={`flex items-center gap-2.5 rounded-lg border p-3 cursor-pointer transition-colors ${
                      logoType === val ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                    }`}>
                      <input type="radio" name="logoType" value={val} checked={logoType === val} onChange={() => setLogoType(val)} className="sr-only" />
                      <div className={`h-4 w-4 rounded-sm border flex items-center justify-center shrink-0 ${
                        logoType === val ? "bg-primary border-primary" : "border-border bg-background"
                      }`}>
                        {logoType === val && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                      </div>
                      <span className="text-xs font-medium text-foreground">{label}</span>
                    </label>
                  ))}
                </div>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="text-xs"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Can be a jpeg/png, and width can be greater than height for best results
                </p>
              </div>
            </div>
          </div>

          {/* Theming */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Theming</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Primary colour *", value: primaryColor, set: setPrimaryColor },
                { label: "Font colour *", value: fontColor, set: setFontColor },
                { label: "Background colour *", value: bgColor, set: setBgColor },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
                  <div className="flex items-center gap-1.5">
                    <div className="relative h-6 w-6 shrink-0 rounded border border-border cursor-pointer overflow-hidden">
                      <div className="absolute inset-0" style={{ backgroundColor: value }} />
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <Input
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className="text-xs font-mono h-8"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer experience */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Customer experience</h3>
            <div className="space-y-4">
              {/* Toggle: preview */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs font-medium text-foreground">
                  Let customers see preview of the document they will sign
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{showPreview ? "Yes" : "No"}</span>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                      showPreview ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                        showPreview ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Toggle: name matching */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-foreground">Enforce name matching</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fuzzy logic used to match name entered by customer with the name specified in the
                    document to be signed
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{nameMatching ? "Yes" : "No"}</span>
                  <button
                    type="button"
                    onClick={() => setNameMatching(!nameMatching)}
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                      nameMatching ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                        nameMatching ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Toggle: auto redirect */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Automatically redirect customers back to your UI
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Share the URL for the UI we should redirect to, and time taken to trigger redirect
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{autoRedirect ? "Yes" : "No"}</span>
                  <button
                    type="button"
                    onClick={() => setAutoRedirect(!autoRedirect)}
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                      autoRedirect ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                        autoRedirect ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
              {autoRedirect && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Auto-redirection time period *
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={redirectTime}
                      onChange={(e) => setRedirectTime(Number(e.target.value))}
                      className="text-xs w-24"
                    />
                    <span className="text-xs text-muted-foreground">seconds</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button>Save</Button>
        </div>

      {/* Custom signature placement */}
      <div className="rounded-xl border border-border p-5 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-foreground">Custom signature placement</p>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Optional
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            Specify placement of multiple signatures inside your documents, for multiple signers.
          </p>
          <p className="text-xs text-muted-foreground">
            Reuse the setup for multiple customers by passing the{" "}
            <code className="font-mono text-foreground bg-muted px-1 rounded">configId</code> when you
            create an eSign request.
          </p>
        </div>
        <Button variant="outline" className="shrink-0 text-xs whitespace-nowrap">
          Add new custom signature config
        </Button>
      </div>
    </div>
  );
}

/* ── Step 1: Test product ── */
function StepTestProduct() {
  const [showCredForm, setShowCredForm] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [credName, setCredName] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");

  return (
    <div className="space-y-6">
      {/* Testing details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-xl border border-border p-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Testing details</h3>
          <p className="text-xs text-muted-foreground">
            Use these for API calls on test mode for this app. You will get production keys only after
            going live.
          </p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              x-product-instance-id
            </label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-md border border-border bg-muted px-3 py-2">
                <span className="font-mono text-xs text-foreground">
                  d3fb7f86-8742-4e91-b812-a5d3c2f90e44
                </span>
              </div>
              <Button size="sm" variant="outline">
                <Copy size={14} />
              </Button>
            </div>
          </div>
          {/* API credentials */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">API credentials</p>
            {!showCredForm ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">No API credentials added</p>
                <Button size="sm" variant="outline" onClick={() => setShowCredForm(true)}>
                  + Add new
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Name</label>
                  <Input
                    value={credName}
                    onChange={(e) => setCredName(e.target.value)}
                    placeholder="e.g. Test key"
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Secret</label>
                  <Input type="password" placeholder="Auto-generated on save" className="text-xs" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowCredForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Callback URL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-xl border border-border p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground">Add callback URL</h3>
            <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
              Used on sandbox
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            This is where you will receive notifications. Make sure you conform to the Setu spec.
          </p>
        </div>
        <div>
          {!showCallbackForm ? (
            <Button variant="outline" className="text-xs" onClick={() => setShowCallbackForm(true)}>
              Add test callback URL
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Callback URL
                </label>
                <Input
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                  placeholder="https://your-domain.com/webhooks/esign"
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm">Save</Button>
                <Button size="sm" variant="outline" onClick={() => setShowCallbackForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Add details for production ── */
function StepProduction({ onGoLive }: { onGoLive: () => void }) {
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setShowCallbackForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Callback URL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-xl border border-border p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground">Add callback URL</h3>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400">
              Used on production
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Add callback URL to receive notifications for verification.
          </p>
        </div>
        <div>
          {!showCallbackForm && !saved ? (
            <Button variant="outline" className="text-xs" onClick={() => setShowCallbackForm(true)}>
              Add production callback URL
            </Button>
          ) : saved ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={16} weight="fill" className="text-emerald-500" />
              Callback URL saved
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Callback URL
                </label>
                <Input
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                  placeholder="https://your-domain.com/webhooks/esign"
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCallbackForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div className="flex items-center justify-between rounded-xl border-2 border-border p-5">
          <div>
            <p className="text-sm font-semibold text-foreground">Ready to go live!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your eSign integration is configured and ready.
            </p>
          </div>
          <Button size="lg" onClick={onGoLive}>
            <RocketLaunch size={16} className="mr-1.5" />
            Go Live
          </Button>
        </div>
      )}
    </div>
  );
}

/* ── Main EsignConfigurationView ── */
export default function EsignConfigurationView({
  currentStep,
  onStepChange,
}: {
  currentStep: number;
  onStepChange: (step: number) => void;
}) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [phone, setPhone] = useState<"iphone" | "android">("iphone");
  // Branding state — lifted so the phone preview can reflect live edits
  const [orgName, setOrgName] = useState("Groww");
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);
  const [primaryColor, setPrimaryColor] = useState("#00a880");
  const [fontColor, setFontColor] = useState("#091016");
  const [bgColor, setBgColor] = useState("#E6E6E6");
  const [previewWidth, setPreviewWidth] = useState(280);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      const next = Math.max(200, Math.min(600, dragStartWidth.current + delta));
      setPreviewWidth(next);
    }
    function onMouseUp() {
      isDragging.current = false;
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function handleDragStart(e: React.MouseEvent) {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = previewWidth;
    e.preventDefault();
  }

  function goNext() {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    onStepChange(Math.min(currentStep + 1, STEPS.length - 1));
  }

  function goPrev() {
    onStepChange(Math.max(currentStep - 1, 0));
  }

  function handleGoLive() {
    localStorage.setItem("esign_config_completed", "true");
    setCompletedSteps((prev) => new Set([...prev, 2]));
  }

  return (
    <div className="my-2 ml-2 mr-2 flex h-[calc(100vh-16px)]">
      {/* Main form panel */}
      <div className="flex-1 rounded-xl bg-background px-6 pt-6 pb-16 overflow-y-auto">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">eSign Configuration</h1>
              <p className="mt-1 text-sm text-muted-foreground">Set up your eSign integration step by step</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={goPrev} disabled={currentStep === 0}>
                <ArrowLeft size={14} className="mr-1" /> Previous
              </Button>
              {currentStep < STEPS.length - 1 && (
                <Button size="sm" onClick={goNext}>
                  Next <ArrowRight size={14} className="ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Step Content */}
          <div>
            {currentStep === 0 && (
              <StepConfigureProduct
                orgName={orgName} setOrgName={setOrgName}
                logoUrl={logoUrl} setLogoUrl={setLogoUrl}
                primaryColor={primaryColor} setPrimaryColor={setPrimaryColor}
                fontColor={fontColor} setFontColor={setFontColor}
                bgColor={bgColor} setBgColor={setBgColor}
              />
            )}
            {currentStep === 1 && <StepTestProduct />}
            {currentStep === 2 && <StepProduction onGoLive={handleGoLive} />}
          </div>

        </div>
      </div>

      {/* Right preview panel — visible on step 0 */}
      {currentStep === 0 && (
        <>
          {/* Drag handle */}
          <div
            onMouseDown={handleDragStart}
            className="w-2 shrink-0 mx-0.5 flex items-center justify-center cursor-col-resize group"
          >
            <div className="w-0.5 h-8 rounded-full bg-border group-hover:bg-muted-foreground/40 transition-colors" />
          </div>
        <div style={{ width: previewWidth }} className="shrink-0 rounded-xl bg-background flex flex-col items-center pt-6 px-7 pb-6 overflow-y-auto">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 self-start">Preview</p>

          {/* Switcher */}
          <div className="self-start flex rounded-lg border border-border bg-muted p-0.5 gap-0.5 mb-4">
            {(["iphone", "android"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPhone(p)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  phone === p
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "iphone" ? "iPhone" : "Android"}
              </button>
            ))}
          </div>

          {/* Mockup */}
          <div className="relative w-full">
            <img
              src={phone === "iphone" ? "/phone-iphone.png" : "/phone-android.png"}
              alt={phone === "iphone" ? "iPhone mockup" : "Android mockup"}
              className="relative z-10 w-full h-auto pointer-events-none select-none"
            />
            {(() => {
              const phoneImgWidth = previewWidth - 56;
              const screenW = phoneImgWidth * (phone === "iphone" ? 0.90 : 0.91);
              const refW = 180;
              const contentScale = Math.max(0.4, screenW / refW);
              return (
                <div
                  className={`absolute inset-0 z-0 flex flex-col overflow-hidden ${
                    phone === "iphone" ? "pt-[9%] pb-[3%] px-[5%]" : "pt-[4%] pb-[3%] px-[4.5%]"
                  }`}
                >
                  <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: bgColor }}>
                    <div
                      className="absolute top-0 left-0"
                      style={{ width: refW, transformOrigin: "top left", transform: `scale(${contentScale})` }}
                    >
                      {/* Status bar */}
                      <div style={{ backgroundColor: "#222227", height: 14, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px" }}>
                        <span style={{ color: "white", fontSize: 7, fontWeight: 600 }}>5:13</span>
                        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><rect x="0" y="4" width="2" height="2" rx="0.4" fill="white"/><rect x="2.5" y="2.5" width="2" height="3.5" rx="0.4" fill="white"/><rect x="5" y="1" width="2" height="5" rx="0.4" fill="white"/></svg>
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M4 1.5C2.8 1.5 1.7 2 1 2.8L0 1.8C1 0.7 2.4 0 4 0C5.6 0 7 0.7 8 1.8L7 2.8C6.3 2 5.2 1.5 4 1.5Z" fill="white"/><path d="M4 3.5C3.3 3.5 2.7 3.8 2.3 4.2L1.3 3.2C2 2.5 2.9 2 4 2C5.1 2 6 2.5 6.7 3.2L5.7 4.2C5.3 3.8 4.7 3.5 4 3.5Z" fill="white"/><circle cx="4" cy="5.5" r="0.8" fill="white"/></svg>
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><rect x="0" y="1" width="8" height="5" rx="1" stroke="white" strokeWidth="0.8" fill="none"/><rect x="0.8" y="1.8" width="5" height="3.4" rx="0.4" fill="white"/><rect x="8.5" y="2" width="1" height="2" rx="0.5" fill="white"/></svg>
                        </div>
                      </div>

                      {/* Header */}
                      <div style={{ backgroundColor: bgColor, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px 6px" }}>
                        {logoUrl ? (
                          <img src={logoUrl} alt={orgName || "logo"} style={{ height: 14, maxWidth: 80, objectFit: "contain" }} />
                        ) : (
                          <span style={{ fontSize: 10, fontWeight: 700, color: fontColor }}>{orgName || "Your Brand"}</span>
                        )}
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke={fontColor} strokeWidth="0.8" opacity="0.5"/><text x="6" y="9" textAnchor="middle" fontSize="7" fill={fontColor} opacity="0.5">i</text></svg>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10M10 2L2 10" stroke={fontColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/></svg>
                        </div>
                      </div>

                      {/* Title */}
                      <div style={{ padding: "8px 12px 10px", color: fontColor, fontSize: 10, fontWeight: 700, lineHeight: 1.35 }}>
                        Verify your Aadhaar with OTP to sign account opening form
                      </div>

                      {/* Card */}
                      <div style={{ margin: "0 10px", background: "white", borderRadius: 6, padding: 10, boxShadow: "0 1px 6px rgba(9,16,22,0.10)" }}>
                        {/* Aadhaar header row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <img src={AADHAAR_EMBLEM_URL} alt="" style={{ height: 18, width: "auto", objectFit: "contain", opacity: 0.9 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ height: 3, background: "#f8a628", borderRadius: 1 }} />
                            <div style={{ height: 3, background: "white" }} />
                            <div style={{ height: 3, background: "#259c4d", borderRadius: 1 }} />
                          </div>
                          <img src={AADHAAR_LOGO_URL} alt="Aadhaar" style={{ height: 18, width: "auto", objectFit: "contain", opacity: 0.9 }} />
                        </div>

                        {/* User info row */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 30, height: 36, background: "#ebf6f0", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" fill="#259c4d" opacity="0.7"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#259c4d" strokeWidth="1.2" fill="none" opacity="0.7"/></svg>
                          </div>
                          <div style={{ fontSize: 8, color: fontColor, lineHeight: 1.6 }}>
                            <div><span style={{ color: "#84878a" }}>Name: </span>Tirth Trivedi</div>
                            <div><span style={{ color: "#84878a" }}>Gender: </span><span style={{ letterSpacing: 1 }}>••••••</span></div>
                            <div><span style={{ color: "#84878a" }}>DOB: </span><span style={{ letterSpacing: 1 }}>••••••</span></div>
                          </div>
                        </div>

                        {/* Aadhaar input */}
                        <div style={{ border: "1.5px solid #c7d9e8", borderRadius: 3, padding: "5px 8px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 8, color: "#c2c2c2" }}>Enter Aadhaar number / VID</span>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><ellipse cx="5" cy="4" rx="4.5" ry="3" stroke="#c2c2c2" strokeWidth="0.8"/><circle cx="5" cy="4" r="1.5" fill="#c2c2c2"/></svg>
                        </div>

                        {/* Divider + hint */}
                        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 5 }}>
                          <span style={{ fontSize: 7, color: "#53585c" }}>OTP will be shared to Aadhaar registered number</span>
                        </div>
                      </div>

                      {/* Send OTP button */}
                      <div style={{ margin: "10px 10px 0", background: primaryColor, borderRadius: 4, padding: "7px 0", textAlign: "center", opacity: 0.85 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: "white", letterSpacing: 0.3 }}>Send OTP</span>
                      </div>

                      {/* Secured by */}
                      <div style={{ textAlign: "center", marginTop: 8, fontSize: 7, color: "#84878a" }}>
                        secured by <strong>Setu</strong> · emudhra
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
