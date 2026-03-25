"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion" // used in sheet sections
import { ArrowsClockwise, CaretDown, CaretRight, NewspaperClipping, Rows, TrendUp, Warning, X } from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const MOCK_INSIGHTS = {
  dateRange: "22 Feb 2026 – 24 Mar 2026",
  description: [
    "UPI transaction volume declined 23.6% over the current period with 805,821 successful transactions valued at ₹49.07B, against 1.05M transactions at ₹61.63B in the comparison week.",
    "Failure rate rose slightly from 7.1% to 7.8%, with insufficient funds accounting for 53.1% of all failures and fraud-related declines surging 52%. Both signals warrant close monitoring.",
  ],
  chipBullets: [
    "Transaction volume down 23.6% (805K vs 1.05M in comparison week)",
    "Total value fell 20.4% from ₹61.63B to ₹49.07B",
    "Fraud-related declines up 52% (379 → 576 cases)",
    "Insufficient funds = 53.1% of all failures (33,497 of 63,017)",
    "PhonePe leads at 40.42%; Paytm grew from 25.18% to 32.76%",
  ],
  summary: [
    "805K successful transactions at ₹49.07B, 7.8% failure rate vs 1.05M at ₹61.63B, 7.1% prior period.",
    "PhonePe leads at 40.42%; Paytm up from 25.18% to 32.76%. SBIN top bank at ~32%.",
    "Avg processing time anomalous at 0.006s vs 1.45s prior.",
  ],
  notableChanges: [
    "Successful transaction volume decreased 23.6% (1.05M → 805K).",
    "Transaction value decreased 20.4% (₹61.63B → ₹49.07B).",
    "Failed payment count decreased 21.9% (80,597 → 63,017).",
    "Insufficient funds failures increased from 42,283 to 33,497, remaining the top failure reason.",
    "Invalid/incorrect MPIN failures decreased from 17,861 to 14,160 (20.7% reduction).",
    "Google Pay disappeared from comparison period data (was 4.15% in current), data inconsistency.",
  ],
  riskSignals: [
    "Insufficient funds = 53.1% of all failures (33,497 of 63,017), potential liquidity stress.",
    "Invalid MPIN = 22.5% of failures, indicating UX friction or auth system issues.",
    "Technical failures (bank unavailability, timeouts, CBS offline) = 2,894 cases (4.6%), backend stability concern.",
    "Fraud-related declines increased 379 → 576 (52% increase), warrants monitoring.",
    "Anomalous avg payment time (0.006s vs 1.45s), potential data collection or calculation error.",
  ],
  exploreFurther: [
    "Why did transaction volume drop 23.6%?",
    "What caused the anomalous 0.006s processing time?",
    "Why is Google Pay missing from the comparison period?",
    "What are the 345 unclassified failures (NA)?",
    "What's driving the 52% rise in fraud declines?",
  ],
}

type ChatMessage = { role: "user" | "assistant"; content: string }

function AiBadge() {
  return (
    <Badge
      variant="secondary"
      className="px-1.5 py-0 text-[10px] font-semibold tracking-wide rounded-sm h-4 leading-none"
    >
      AI
    </Badge>
  )
}

function ShimmerAiBadge() {
  return (
    <>
      <style>{`
        @keyframes shimmer-badge {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-badge-bg {
          background: linear-gradient(
            45deg,
            #03C0D9 0%,
            #84E3F0 40%,
            #DDFEFF 65%,
            #03C0D9 100%
          );
          background-size: 200% auto;
          animation: shimmer-badge 5s linear infinite;
        }
      `}</style>
      <span className="shimmer-badge-bg inline-flex items-center px-1.5 h-4 rounded-sm text-[10px] font-semibold tracking-wide leading-none text-white">
        AI
      </span>
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
      {children}
    </p>
  )
}

function BulletList({ items, outdent = false }: { items: string[]; outdent?: boolean }) {
  return (
    <ul className={`space-y-2.5 ${outdent ? "-ml-[14px] pl-[14px]" : ""}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm text-foreground leading-relaxed">
          <span className={`mt-[7px] shrink-0 w-1 h-1 rounded-full bg-muted-foreground/40 ${outdent ? "-ml-[14px]" : ""}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  )
}

function getMockResponse(q: string): string {
  const lower = q.toLowerCase()
  if (lower.includes("volume") || lower.includes("decline") || lower.includes("drop"))
    return "The 23.6% decline in transaction volume (1.05M → 805K) likely reflects a post-holiday normalization effect. UPI volumes typically dip in the second half of February as consumer spending stabilises after January salary cycles."
  if (lower.includes("processing time") || lower.includes("0.006"))
    return "The 0.006s average processing time is almost certainly a data anomaly, likely a calculation error or a batch of test transactions skewing the mean. The comparison period's 1.45s is consistent with typical UPI p2m settlement times."
  if (lower.includes("google pay") || lower.includes("gpay"))
    return "Google Pay's absence from the comparison period is likely a data pipeline issue. GPay maintained 4.15% share in the current period; a sudden zero in the prior period is inconsistent with market trends and warrants a data audit."
  if (lower.includes("na") || lower.includes("unclassified") || lower.includes("345"))
    return "The 345 NA-category failures lack a reason code, typically indicating a timeout before the gateway could assign a failure reason, or a mid-flight network drop. Check raw transaction logs for classification."
  if (lower.includes("fraud") || lower.includes("52%"))
    return "The 52% rise in fraud declines (379 → 576) tracks a broader industry trend of increased account-takeover attempts. The absolute count remains low (<1% of failures) but the growth rate warrants activating enhanced anomaly detection rules."
  return "Based on the current UPI data, I don't have enough context for a precise answer. Try asking about volume, failure rates, PSP share, or fraud trends."
}

export function AIInsightsSummary() {
  const [open, setOpen] = useState(false)
  const [followUp, setFollowUp] = useState("")
  const [beamKey, setBeamKey] = useState(0)
  const [beamIterations, setBeamIterations] = useState(2)
  const [beamRunning, setBeamRunning] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [notableOpen, setNotableOpen] = useState(true)
  const [riskOpen, setRiskOpen] = useState(true)
  const [chipIndex, setChipIndex] = useState(0)
  const [chipsExpanded, setChipsExpanded] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [footerHeight, setFooterHeight] = useState(180)
  const data = MOCK_INSIGHTS

  // Stop beam after initial 2 runs
  useEffect(() => {
    const t = setTimeout(() => setBeamRunning(false), 3000 * 2)
    return () => clearTimeout(t)
  }, [])

  // Cycle chips every 2s when sheet is open
  useEffect(() => {
    if (!open) return
    const t = setInterval(() => {
      setChipIndex((i) => (i + 1) % data.exploreFurther.length)
    }, 2000)
    return () => clearInterval(t)
  }, [open])

  // Auto-scroll chat on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isStreaming])

  // Track footer height for gradient — re-run when sheet opens so ref is attached
  useEffect(() => {
    if (!open || !footerRef.current) return
    setFooterHeight(footerRef.current.offsetHeight)
    const observer = new ResizeObserver(() => {
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight)
    })
    observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [open])

  function handleAskWith(q: string) {
    if (!q.trim() || isStreaming) return
    setFollowUp("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    setChatMessages((prev) => [...prev, { role: "user", content: q.trim() }])
    const response = getMockResponse(q)
    setIsStreaming(true)
    setChatMessages((prev) => [...prev, { role: "assistant", content: "" }])
    let i = 0
    const interval = setInterval(() => {
      i++
      setChatMessages((prev) => {
        const msgs = [...prev]
        msgs[msgs.length - 1] = { role: "assistant", content: response.slice(0, i) }
        return msgs
      })
      if (i >= response.length) {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 18)
  }

  function handleAsk() { handleAskWith(followUp) }

  return (
    <>
      {/* Accordion chip */}
      <style>{`
        @keyframes beam-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(calc(200% + 120px)); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blink-cursor { animation: blink-cursor 0.8s step-end infinite; }
      `}</style>

      <div
        className="relative rounded-xl overflow-hidden p-[1.5px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#84E3F0" : "transparent",
          transition: "background 0.2s ease",
        }}
      >
        {/* Sliding beam — left to right */}
        <div
          key={beamKey}
          aria-hidden
          className="pointer-events-none absolute inset-y-0"
          style={{
            width: "40%",
            background: "linear-gradient(90deg, transparent 0%, #84E3F0 30%, #DDFEFF 50%, transparent 100%)",
            animation: beamRunning && !hovered ? `beam-slide 3s linear ${beamIterations}` : "none",
            opacity: (!beamRunning || hovered) ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
        />
        <div className="relative rounded-[10.5px] bg-muted">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative z-10 w-full flex items-center gap-2 pl-5 pr-4 pt-4 pb-4 text-left"
        >
          <NewspaperClipping size={20} weight="regular" strokeWidth={1.5} className="text-foreground shrink-0" />
          <span className="text-base font-medium text-foreground flex-1">Smart Insights</span>
          <CaretRight size={20} weight="bold" className="text-muted-foreground shrink-0" />
        </button>
        </div>
      </div>

      {/* Right-side Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[500px] sm:max-w-[500px] p-0 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 px-5 pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <NewspaperClipping size={20} weight="regular" className="text-foreground" />
                  <SheetTitle>Smart Insights</SheetTitle>
                </div>
                <SheetDescription>{data.dateRange}</SheetDescription>
              </SheetHeader>
              <div className="flex items-center shrink-0 -mt-2 -mr-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
                  onClick={() => {/* refresh placeholder */}}
                >
                  <ArrowsClockwise size={14} weight="bold" />
                  <span className="sr-only">Refresh</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
                  onClick={() => setOpen(false)}
                >
                  <X size={14} weight="bold" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 pt-1 pb-56 space-y-6">
            <div className="bg-muted rounded-lg px-4 py-5 space-y-3">
              <SectionLabel>Summary</SectionLabel>
              <BulletList items={data.summary} />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setNotableOpen((v) => !v)}
                className="w-full flex items-center gap-3 mb-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <TrendUp size={16} weight="regular" className="text-primary" />
                </div>
                <h2 className="text-base font-semibold text-foreground flex-1 text-left">Notable Changes</h2>
                {!notableOpen && (
                  <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-secondary text-xs font-medium text-foreground">
                    {data.notableChanges.length}
                  </span>
                )}
                <motion.span animate={{ rotate: notableOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-muted-foreground shrink-0">
                  <CaretDown size={13} weight="bold" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {notableOpen && (
                  <motion.div key="notable" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="overflow-hidden">
                    <BulletList items={data.notableChanges} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setRiskOpen((v) => !v)}
                className="w-full flex items-center gap-3 mb-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
                  <Warning size={16} weight="regular" className="text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-base font-semibold text-foreground flex-1 text-left">Risk Signals</h2>
                {!riskOpen && (
                  <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-red-100 dark:bg-red-950 text-xs font-medium text-red-600 dark:text-red-400">
                    {data.riskSignals.length}
                  </span>
                )}
                <motion.span animate={{ rotate: riskOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-muted-foreground shrink-0">
                  <CaretDown size={13} weight="bold" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {riskOpen && (
                  <motion.div key="risk" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="overflow-hidden">
                    <BulletList items={data.riskSignals} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Inline Q&A — appended below insights */}
            {chatMessages.length > 0 && (
              <div className="border-t border-border/40 pt-6 space-y-5">
                {chatMessages.reduce<{ question: string; answer: string; streaming: boolean }[]>((pairs, msg, i) => {
                  if (msg.role === "user") {
                    pairs.push({ question: msg.content, answer: "", streaming: false })
                  } else if (msg.role === "assistant" && pairs.length > 0) {
                    pairs[pairs.length - 1].answer = msg.content
                    pairs[pairs.length - 1].streaming = isStreaming && i === chatMessages.length - 1
                  }
                  return pairs
                }, []).map((pair, i) => (
                  <div key={i} className="space-y-3">
                    {/* Question pill */}
                    <div className="flex justify-end">
                      <span className="max-w-[80%] bg-secondary text-primary rounded-2xl rounded-tr-sm px-3.5 py-2 text-sm leading-relaxed">
                        {pair.question}
                      </span>
                    </div>
                    {/* Answer */}
                    {(pair.answer || pair.streaming) && (
                      <p className="text-sm text-foreground leading-relaxed">
                        {pair.answer}
                        {pair.streaming && <span className="blink-cursor ml-0.5">|</span>}
                      </p>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Gradient layer — sits behind footer, extends 40px above it */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
            style={{
              height: footerHeight + 60,
              background: "linear-gradient(to bottom, transparent 0%, transparent 10%, hsl(var(--background)) 55%)",
            }}
          />

          {/* Floating footer */}
          <div ref={footerRef} className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2]">
            {/* Input area */}
            <div className="pointer-events-auto px-4 pb-4 flex flex-col-reverse gap-2">
              {/* Input box */}
              <div className="bg-background border border-border/40 rounded-xl overflow-hidden shadow-lg flex items-end gap-2 px-3 py-2">
                <textarea
                  ref={textareaRef}
                  value={followUp}
                  onChange={(e) => {
                    setFollowUp(e.target.value)
                    e.target.style.height = "auto"
                    e.target.style.height = e.target.scrollHeight + "px"
                  }}
                  placeholder="Ask a follow-up question..."
                  rows={1}
                  className="flex-1 text-sm text-foreground bg-transparent resize-none outline-none placeholder:text-muted-foreground leading-relaxed py-1 min-h-[24px] max-h-40 overflow-y-auto"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk() }
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!followUp.trim() || isStreaming}
                  className="h-7 pl-3 pr-1 text-xs font-medium shrink-0 gap-1.5 mb-0.5"
                  onClick={handleAsk}
                >
                  Ask
                  <Kbd className="bg-transparent text-inherit">↵</Kbd>
                </Button>
              </div>
              {/* Suggestion chips */}
              <div className="flex flex-col gap-1.5">
                {/* Expanded list */}
                <AnimatePresence initial={false}>
                  {chipsExpanded && (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden flex flex-col gap-1.5"
                    >
                      {data.exploreFurther.map((q, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { setFollowUp(q); setChipsExpanded(false) }}
                          className="w-full text-left px-3 py-1.5 rounded-lg border border-border/60 bg-background text-xs text-foreground/70 hover:text-foreground hover:border-border transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Bottom row: ticker (collapsed) or toggle only (expanded) */}
                <div className="flex items-center gap-2 justify-between">
                  {!chipsExpanded && (
                    <div className="flex-1 min-w-0 flex items-center h-8">
                      <AnimatePresence mode="wait">
                        <motion.button
                          key={chipIndex}
                          type="button"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          onClick={() => setFollowUp(data.exploreFurther[chipIndex])}
                          className="shrink-0 px-3 py-1.5 rounded-lg border border-border/60 bg-background text-xs text-foreground/70 hover:text-foreground hover:border-border transition-colors whitespace-nowrap"
                        >
                          {data.exploreFurther[chipIndex]}
                        </motion.button>
                      </AnimatePresence>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setChipsExpanded((v) => !v)}
                    className="shrink-0 h-8 w-8 ml-auto flex items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                  >
                    <Rows size={14} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
