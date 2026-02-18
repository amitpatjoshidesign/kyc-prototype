"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, User, Buildings, ArrowUp, Copy, Eye, EyeSlash, Plus, Trash, Globe, CaretDown } from "@phosphor-icons/react";

/* ── Toggle ── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
        enabled ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

/* ── Data ── */
const KYC_FIELDS = [
  {
    group: "Identity", icon: User,
    fields: [
      { id: "pan", label: "PAN number", description: "Access to full PAN card details", enabled: true },
      { id: "aadhaar_masked", label: "Aadhaar (masked)", description: "Last 4 digits of Aadhaar only", enabled: true },
      { id: "aadhaar_full", label: "Aadhaar (full)", description: "Full Aadhaar number — requires explicit consent", enabled: false },
      { id: "dob", label: "Date of birth", description: "Verified date of birth from document", enabled: true },
    ],
  },
  {
    group: "Business", icon: Buildings,
    fields: [
      { id: "gstin", label: "GSTIN", description: "GST Identification Number", enabled: true },
      { id: "cin", label: "CIN / Company registration", description: "Ministry of Corporate Affairs details", enabled: false },
      { id: "udyam", label: "Udyam registration", description: "MSME registration details", enabled: false },
    ],
  },
  {
    group: "Financial", icon: CreditCard,
    fields: [
      { id: "bank_account", label: "Bank account", description: "Account number and IFSC via penny drop", enabled: true },
      { id: "credit_score", label: "Credit bureau score", description: "CIBIL / Experian score pull", enabled: false },
      { id: "itr", label: "ITR data", description: "Income tax return summary", enabled: false },
    ],
  },
];

const CREDIT_HISTORY = [
  { date: "Feb 2026", used: 18400 },
  { date: "Jan 2026", used: 22100 },
  { date: "Dec 2025", used: 19800 },
  { date: "Nov 2025", used: 15300 },
];

const API_KEYS = [
  { id: "key_prod_1", name: "Production key", env: "Production", created: "12 Jan 2026", lastUsed: "2 hours ago", secret: "sk_prod_xK9mP2rL4nQ8vJ6wT1yA3bC5dE7fG0hI" },
  { id: "key_sand_1", name: "Sandbox key", env: "Sandbox", created: "5 Nov 2025", lastUsed: "Yesterday", secret: "sk_sand_zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU" },
];

const WEBHOOKS = [
  { id: "wh_1", url: "https://api.myapp.com/webhooks/setu", events: ["payment.successful", "payment.failed"], status: "Active" },
  { id: "wh_2", url: "https://api.myapp.com/webhooks/kyc", events: ["kyc.verification.completed"], status: "Active" },
];

const AVATAR_COLORS = [
  { bg: "bg-violet-600 dark:bg-violet-300", text: "text-violet-100 dark:text-violet-900" },
  { bg: "bg-sky-600 dark:bg-sky-300", text: "text-sky-100 dark:text-sky-900" },
  { bg: "bg-emerald-600 dark:bg-emerald-300", text: "text-emerald-100 dark:text-emerald-900" },
  { bg: "bg-amber-600 dark:bg-amber-300", text: "text-amber-100 dark:text-amber-900" },
];

const TEAM_MEMBERS = [
  { name: "Rahul Sharma", email: "rahul@company.com", role: "Admin", joined: "14 Jan 2025" },
  { name: "Priya Nair", email: "priya@company.com", role: "Developer", joined: "3 Mar 2025" },
  { name: "Ankit Verma", email: "ankit@company.com", role: "Developer", joined: "22 Jun 2025" },
  { name: "Sneha Iyer", email: "sneha@company.com", role: "Viewer", joined: "8 Sep 2025" },
];

/* ── Sections ── */

function AccountSection() {
  const [kycFields, setKycFields] = useState(() =>
    Object.fromEntries(KYC_FIELDS.flatMap((g) => g.fields.map((f) => [f.id, f.enabled])))
  );
  return (
    <div className="space-y-6">
      <Card className="shadow-none border border-border/40">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="text-sm font-medium">Organisation details</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          {[["Organisation name", "Acme Technologies Pvt. Ltd."], ["PAN", "AABCA1234Z"], ["GSTIN", "27AABCA1234Z1Z5"], ["Contact email", "admin@acme.com"]].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <span className="text-xs text-muted-foreground w-40 shrink-0">{label}</span>
              <span className="text-sm font-medium text-foreground flex-1">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
          <ShieldCheck size={14} weight="duotone" className="text-primary" />
          KYC data access control
        </h2>
        <p className="text-xs text-muted-foreground mb-4">Control which KYC fields your integration can read.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {KYC_FIELDS.map((group) => {
            const Icon = group.icon;
            return (
              <Card key={group.group} className="shadow-none border border-border/40">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon size={14} weight="duotone" className="text-primary" />
                    {group.group}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  {group.fields.map((field) => (
                    <div key={field.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{field.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{field.description}</p>
                      </div>
                      <Toggle enabled={kycFields[field.id]} onChange={(v) => setKycFields((p) => ({ ...p, [field.id]: v }))} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ApiKeysSection() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const copyKey = (id: string, secret: string) => {
    navigator.clipboard.writeText(secret).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">API keys authenticate your server-side requests. Never expose secret keys client-side.</p>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
          <Plus size={14} />
          New key
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
      {API_KEYS.map((key) => (
        <Card key={key.id} className="shadow-none border border-border/40">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{key.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${key.env === "Production" ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" : "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"}`}>
                    {key.env}
                  </span>
                  <span className="text-xs text-muted-foreground">Created {key.created}</span>
                  <span className="text-xs text-muted-foreground">· Last used {key.lastUsed}</span>
                </div>
              </div>
              <button type="button" className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash size={15} />
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <code className="flex-1 text-xs font-mono text-foreground truncate">
                {revealed[key.id] ? key.secret : key.secret.slice(0, 12) + "•".repeat(24)}
              </code>
              <button type="button" onClick={() => setRevealed((p) => ({ ...p, [key.id]: !p[key.id] }))} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                {revealed[key.id] ? <EyeSlash size={14} /> : <Eye size={14} />}
              </button>
              <button type="button" onClick={() => copyKey(key.id, key.secret)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                {copied === key.id ? <span className="text-xs text-emerald-600">Copied</span> : <Copy size={14} />}
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
}

function WebhooksSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Setu will POST event payloads to your endpoints in real time.</p>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
          <Plus size={14} />
          Add endpoint
        </Button>
      </div>
      {WEBHOOKS.map((wh) => (
        <Card key={wh.id} className="shadow-none border border-border/40">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-muted-foreground shrink-0 mt-0.5" />
                <code className="text-sm font-mono text-foreground break-all">{wh.url}</code>
              </div>
              <span className="ml-4 shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                {wh.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {wh.events.map((e) => (
                <span key={e} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground font-mono">{e}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TeamSection() {
  const ROLES = ["Admin", "Developer", "Viewer"];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Manage who has access to your Bridge workspace.</p>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
          <Plus size={14} />
          Invite member
        </Button>
      </div>
      <Card className="shadow-none border border-border/40">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {TEAM_MEMBERS.map((m, i) => (
                <tr key={m.email} className="group border-b border-border/30 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length].bg}`}>
                        <span className={`text-[10px] font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length].text}`}>
                          {m.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-foreground text-sm">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{m.email}</td>
                  <td className="px-6 py-4">
                    <div className="relative inline-flex items-center">
                      <select defaultValue={m.role} className="text-xs rounded-md border border-input bg-background pl-2 pr-6 py-1 text-foreground focus:outline-none appearance-none cursor-pointer">
                        {ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                      <CaretDown size={10} className="absolute right-2 pointer-events-none text-muted-foreground" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{m.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                      <Trash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function BillingSection() {
  const totalCredits = 100000;
  const usedCredits = 18400;
  const usedPercent = (usedCredits / totalCredits) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-none border border-border/40 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground tracking-wide">Available credits</p>
                <p className="text-3xl font-bold text-foreground mt-1">{(totalCredits - usedCredits).toLocaleString()}</p>
                <p className="flex items-center gap-1 mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <ArrowUp size={11} weight="bold" />
                  50,000 added in Jan 2026
                </p>
              </div>
              <Button size="sm" variant="outline">Add credits</Button>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{usedCredits.toLocaleString()} used</span>
                <span>{totalCredits.toLocaleString()} total</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-stone-700 dark:bg-stone-300 transition-all" style={{ width: `${usedPercent}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{(100 - usedPercent).toFixed(1)}% remaining</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border/40">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-sm font-medium">Monthly usage</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-3">
            {CREDIT_HISTORY.map((row) => (
              <div key={row.date} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground w-20">{row.date}</span>
                <div className="flex-1 mx-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-stone-600 dark:bg-stone-400" style={{ width: `${(row.used / 25000) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-foreground tabular-nums">{row.used.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ── Main ── */
const SECTION_TITLES: Record<string, { title: string; description: string }> = {
  Account:  { title: "Account", description: "Organisation details and KYC data access controls" },
  Team:     { title: "Team", description: "Manage members and their roles" },
  "API Keys": { title: "API keys", description: "Manage keys to authenticate API requests" },
  Webhooks: { title: "Webhooks", description: "Configure endpoints to receive event notifications" },
  Billing:  { title: "Billing", description: "Credit balance, usage history, and top-ups" },
};

export default function SettingsView({ section = "Account" }: { section?: string }) {
  const meta = SECTION_TITLES[section] ?? SECTION_TITLES["Account"];

  return (
    <div className="my-2 ml-2 mr-2 rounded-xl bg-background h-[calc(100vh-16px)] overflow-hidden flex flex-col">
      <div className="shrink-0 bg-background z-10 px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">{meta.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-16 pt-2">
        {section === "Account"   && <AccountSection />}
        {section === "Team"      && <TeamSection />}
        {section === "API Keys"  && <ApiKeysSection />}
        {section === "Webhooks"  && <WebhooksSection />}
        {section === "Billing"   && <BillingSection />}
      </div>
    </div>
  );
}
