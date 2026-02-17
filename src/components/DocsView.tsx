"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Robot,
  PaperPlaneTilt,
  X,
  Code,
  Terminal,
  CaretDown,
  CaretRight,
} from "@phosphor-icons/react";

/* ── Product Data ── */
const PRODUCTS = {
  Payments: [
    {
      id: "bbps",
      title: "BBPS",
      description: "Bharat Bill Payment System — enable bill payments across 20,000+ billers with a single integration.",
      features: ["Multi-biller support", "Real-time payment confirmation", "Auto-reconciliation", "BOU & COU modes"],
      useCases: ["Utility bill payments", "Loan EMI collection", "Insurance premium payments", "Municipal tax collection"],
      endpoints: [
        { method: "POST", path: "/v2/bbps/bills/fetch", desc: "Fetch outstanding bills for a customer" },
        { method: "POST", path: "/v2/bbps/bills/pay", desc: "Initiate a bill payment" },
        { method: "GET", path: "/v2/bbps/bills/{txnId}/status", desc: "Check payment status" },
        { method: "GET", path: "/v2/bbps/billers", desc: "List available billers" },
      ],
      sampleReq: `{
  "billerId": "ELECTRICITYBOARD01",
  "customerParams": {
    "consumerNumber": "1234567890"
  },
  "amountExactness": "EXACT"
}`,
      sampleRes: `{
  "status": "SUCCESS",
  "data": {
    "billId": "BILL_abc123",
    "amount": 2450.00,
    "dueDate": "2024-02-15",
    "customerName": "Amit Kumar"
  }
}`,
      webhookEvents: ["bill.payment.successful", "bill.payment.failed", "bill.fetch.completed"],
      webhookPayload: `{
  "event": "bill.payment.successful",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "txnId": "TXN_789xyz",
    "amount": 2450.00,
    "billerId": "ELECTRICITYBOARD01",
    "status": "PAID"
  }
}`,
      faqs: [
        { q: "What modes does BBPS support?", a: "BBPS supports both BOU (Biller Operating Unit) and COU (Customer Operating Unit) modes. BOU is used for agent-assisted payments while COU enables customer-initiated payments." },
        { q: "How long does payment confirmation take?", a: "Real-time confirmation is provided for most billers. In some cases, it may take up to 30 minutes for the biller to confirm." },
        { q: "Is there a limit on transaction amounts?", a: "Transaction limits depend on the biller and payment mode. UPI has a limit of ₹1,00,000 per transaction. Other modes may vary." },
      ],
    },
    {
      id: "upi",
      title: "UPI",
      description: "Build seamless UPI payment flows with Setu's UPI DeepLinks, recurring mandates, and TPV.",
      features: ["UPI DeepLinks", "Recurring mandates (UPI Recur)", "Third Party Verification", "Real-time notifications"],
      useCases: ["E-commerce payments", "Subscription billing", "P2P transfers", "Loan disbursement verification"],
      endpoints: [
        { method: "POST", path: "/v2/upi/links", desc: "Create a UPI payment link" },
        { method: "GET", path: "/v2/upi/links/{linkId}", desc: "Get payment link status" },
        { method: "POST", path: "/v2/upi/mandates", desc: "Create a recurring mandate" },
        { method: "DELETE", path: "/v2/upi/mandates/{mandateId}", desc: "Revoke a mandate" },
      ],
      sampleReq: `{
  "amount": 99900,
  "currency": "INR",
  "expiryDate": "2024-03-01",
  "payeeName": "Acme Corp"
}`,
      sampleRes: `{
  "status": "SUCCESS",
  "data": {
    "linkId": "LINK_def456",
    "upiLink": "upi://pay?pa=acme@setu",
    "shortUrl": "https://pay.setu.co/s/abc"
  }
}`,
      webhookEvents: ["upi.payment.successful", "upi.payment.failed", "upi.mandate.created", "upi.mandate.revoked"],
      webhookPayload: `{
  "event": "upi.payment.successful",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "linkId": "LINK_def456",
    "amount": 99900,
    "payerVPA": "user@upi",
    "rrn": "401234567890"
  }
}`,
      faqs: [
        { q: "What is a UPI DeepLink?", a: "A UPI DeepLink is a URL that opens the customer's UPI app directly with pre-filled payment details, enabling one-tap payments." },
        { q: "How does UPI Recur work?", a: "UPI Recur allows you to set up mandates for recurring payments. Once the customer approves, subsequent debits happen automatically as per the schedule." },
        { q: "What are the supported UPI apps?", a: "All NPCI-certified UPI apps are supported, including PhonePe, Google Pay, Paytm, Amazon Pay, CRED, and bank apps." },
      ],
    },
    {
      id: "pg",
      title: "Payment Gateway",
      description: "Accept payments via cards, net banking, UPI, and wallets through a single checkout integration.",
      features: ["Multi-mode payments", "Tokenization", "Smart routing", "PCI DSS compliant"],
      useCases: ["Online checkout", "In-app payments", "Invoice payments", "Marketplace settlements"],
      endpoints: [
        { method: "POST", path: "/v2/payments/sessions", desc: "Create a payment session" },
        { method: "GET", path: "/v2/payments/{paymentId}", desc: "Get payment details" },
        { method: "POST", path: "/v2/payments/{paymentId}/refund", desc: "Initiate a refund" },
        { method: "GET", path: "/v2/payments/settlements", desc: "List settlements" },
      ],
      sampleReq: `{
  "amount": 150000,
  "currency": "INR",
  "customer": {
    "email": "user@example.com",
    "phone": "+919876543210"
  },
  "redirectUrl": "https://yoursite.com/callback"
}`,
      sampleRes: `{
  "status": "CREATED",
  "data": {
    "sessionId": "SES_ghi789",
    "paymentUrl": "https://pay.setu.co/p/SES_ghi789",
    "expiresAt": "2024-01-20T11:00:00Z"
  }
}`,
      webhookEvents: ["payment.successful", "payment.failed", "refund.processed", "settlement.completed"],
      webhookPayload: `{
  "event": "payment.successful",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "paymentId": "PAY_jkl012",
    "amount": 150000,
    "method": "card",
    "status": "CAPTURED"
  }
}`,
      faqs: [
        { q: "Which payment methods are supported?", a: "We support Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking (50+ banks), UPI, and popular wallets." },
        { q: "How does smart routing work?", a: "Smart routing automatically selects the payment gateway with the highest success rate for the given card/bank combination." },
        { q: "When are settlements processed?", a: "Settlements are processed on T+1 basis for most payment methods. Custom settlement cycles are available for enterprise plans." },
      ],
    },
    {
      id: "payouts",
      title: "Payouts",
      description: "Disburse payments to bank accounts, UPI IDs, and wallets at scale with automated reconciliation.",
      features: ["Bank transfer (IMPS/NEFT/RTGS)", "UPI payouts", "Bulk disbursals", "Auto-reconciliation"],
      useCases: ["Vendor payments", "Salary disbursement", "Refund processing", "Cashback distribution"],
      endpoints: [
        { method: "POST", path: "/v2/payouts", desc: "Initiate a payout" },
        { method: "POST", path: "/v2/payouts/bulk", desc: "Bulk payout initiation" },
        { method: "GET", path: "/v2/payouts/{payoutId}", desc: "Get payout status" },
        { method: "GET", path: "/v2/payouts/balance", desc: "Check payout balance" },
      ],
      sampleReq: `{
  "amount": 50000,
  "currency": "INR",
  "mode": "IMPS",
  "beneficiary": {
    "name": "Vendor Corp",
    "accountNo": "1234567890123",
    "ifsc": "HDFC0001234"
  }
}`,
      sampleRes: `{
  "status": "INITIATED",
  "data": {
    "payoutId": "PO_mno345",
    "utr": "UTR123456789",
    "completedAt": null
  }
}`,
      webhookEvents: ["payout.completed", "payout.failed", "payout.reversed", "balance.low"],
      webhookPayload: `{
  "event": "payout.completed",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "payoutId": "PO_mno345",
    "amount": 50000,
    "utr": "UTR123456789",
    "status": "COMPLETED"
  }
}`,
      faqs: [
        { q: "What transfer modes are supported?", a: "IMPS (instant, up to ₹5L), NEFT (30-min batches, no limit), and RTGS (instant, minimum ₹2L) are supported." },
        { q: "How does bulk payout work?", a: "Upload a CSV or send a JSON array of up to 10,000 payouts in a single API call. Each payout is processed independently." },
        { q: "How do I check my balance?", a: "Use the balance API endpoint or view it in the Bridge dashboard. You can also set up low-balance alerts via webhooks." },
      ],
    },
    {
      id: "creditline",
      title: "Credit Line",
      description: "Enable instant credit for your customers with flexible limits and EMI options.",
      features: ["Instant approval", "Flexible credit limits", "EMI conversion", "Real-time eligibility check"],
      useCases: ["Buy now pay later", "Working capital loans", "Consumer credit", "Invoice financing"],
      endpoints: [
        { method: "POST", path: "/v2/credit/eligibility", desc: "Check credit eligibility" },
        { method: "POST", path: "/v2/credit/disburse", desc: "Disburse credit" },
        { method: "GET", path: "/v2/credit/{loanId}/status", desc: "Get loan status" },
        { method: "POST", path: "/v2/credit/{loanId}/repay", desc: "Record repayment" },
      ],
      sampleReq: `{
  "customerId": "CUST_001",
  "pan": "ABCDE1234F",
  "requestedAmount": 500000,
  "tenure": 12
}`,
      sampleRes: `{
  "status": "ELIGIBLE",
  "data": {
    "maxAmount": 750000,
    "interestRate": 14.5,
    "tenureOptions": [3, 6, 12, 24],
    "emiAmount": 45230
  }
}`,
      webhookEvents: ["credit.approved", "credit.disbursed", "credit.repayment.received", "credit.overdue"],
      webhookPayload: `{
  "event": "credit.disbursed",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "loanId": "LOAN_pqr678",
    "amount": 500000,
    "tenure": 12,
    "disbursedTo": "HDFC***1234"
  }
}`,
      faqs: [
        { q: "How fast is the approval process?", a: "Eligibility checks return in under 2 seconds. Full approval and disbursal can be completed in under 5 minutes for pre-approved customers." },
        { q: "What documents are required?", a: "Only PAN and bank account details are required for most cases. Additional documents may be needed for amounts above ₹10L." },
        { q: "Can customers convert to EMI later?", a: "Yes, any outstanding credit can be converted to EMI after disbursal through the EMI conversion API." },
      ],
    },
  ],
  Data: [
    {
      id: "kyc",
      title: "KYC",
      description: "Verify individuals and businesses instantly with Aadhaar, PAN, bank account, and DigiLocker APIs.",
      features: ["Aadhaar eKYC", "PAN verification", "Bank account validation", "DigiLocker integration"],
      useCases: ["Customer onboarding", "Merchant verification", "Lending KYC", "Insurance underwriting"],
      endpoints: [
        { method: "POST", path: "/v2/kyc/aadhaar/otp", desc: "Send Aadhaar OTP" },
        { method: "POST", path: "/v2/kyc/aadhaar/verify", desc: "Verify Aadhaar OTP" },
        { method: "POST", path: "/v2/kyc/pan/verify", desc: "Verify PAN details" },
        { method: "POST", path: "/v2/kyc/bank/verify", desc: "Verify bank account" },
      ],
      sampleReq: `{
  "aadhaarNumber": "XXXX-XXXX-1234",
  "consent": true,
  "reason": "Customer onboarding"
}`,
      sampleRes: `{
  "status": "SUCCESS",
  "data": {
    "name": "Amit Kumar",
    "dob": "1990-01-15",
    "gender": "M",
    "address": {
      "state": "Karnataka",
      "pincode": "560001"
    }
  }
}`,
      webhookEvents: ["kyc.verification.completed", "kyc.verification.failed", "kyc.document.uploaded"],
      webhookPayload: `{
  "event": "kyc.verification.completed",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "verificationType": "AADHAAR",
    "requestId": "REQ_stu901",
    "status": "VERIFIED",
    "confidence": 0.98
  }
}`,
      faqs: [
        { q: "Is Aadhaar consent required?", a: "Yes, explicit consent from the user is mandatory for Aadhaar-based verification as per UIDAI guidelines." },
        { q: "How accurate is PAN verification?", a: "PAN verification has 100% accuracy as it checks directly against the Income Tax Department database." },
        { q: "Can I verify business entities?", a: "Yes, we support GSTIN verification, company PAN, and CIN/DIN verification for business entities." },
      ],
    },
    {
      id: "esign",
      title: "eSign Gateway",
      description: "Integrate Aadhaar-based electronic signatures for legally binding document signing.",
      features: ["Aadhaar eSign", "Multi-signer support", "Document workflow", "Audit trail"],
      useCases: ["Loan agreements", "Insurance policies", "Employment contracts", "Rental agreements"],
      endpoints: [
        { method: "POST", path: "/v2/esign/documents", desc: "Upload a document for signing" },
        { method: "POST", path: "/v2/esign/documents/{docId}/sign", desc: "Initiate signing" },
        { method: "GET", path: "/v2/esign/documents/{docId}/status", desc: "Check signing status" },
        { method: "GET", path: "/v2/esign/documents/{docId}/download", desc: "Download signed document" },
      ],
      sampleReq: `{
  "document": "base64_encoded_pdf",
  "signers": [{
    "name": "Amit Kumar",
    "identifier": "XXXX-XXXX-1234",
    "reason": "Loan Agreement",
    "page": 5,
    "position": { "x": 100, "y": 700 }
  }]
}`,
      sampleRes: `{
  "status": "CREATED",
  "data": {
    "documentId": "DOC_vwx234",
    "signingUrl": "https://esign.setu.co/s/DOC_vwx234",
    "expiresAt": "2024-01-21T10:30:00Z"
  }
}`,
      webhookEvents: ["esign.document.signed", "esign.document.rejected", "esign.document.expired"],
      webhookPayload: `{
  "event": "esign.document.signed",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "documentId": "DOC_vwx234",
    "signedBy": "Amit Kumar",
    "certificate": "DSC_abc123"
  }
}`,
      faqs: [
        { q: "Are eSign documents legally valid?", a: "Yes, Aadhaar eSign is legally valid under the IT Act 2000 and is equivalent to a physical signature for most purposes." },
        { q: "Can multiple people sign one document?", a: "Yes, multi-signer workflow is supported. Each signer receives their own signing link and the document is finalized after all signatures." },
        { q: "What document formats are supported?", a: "PDF is the primary supported format. Documents should not exceed 10MB in size." },
      ],
    },
    {
      id: "aa",
      title: "Account Aggregator",
      description: "Access consented financial data from banks and financial institutions via the AA framework.",
      features: ["Consent management", "Multi-FIP support", "Financial data fetch", "Real-time data"],
      useCases: ["Loan underwriting", "Personal finance management", "Credit scoring", "Wealth management"],
      endpoints: [
        { method: "POST", path: "/v2/aa/consent", desc: "Create a consent request" },
        { method: "GET", path: "/v2/aa/consent/{consentId}", desc: "Get consent status" },
        { method: "POST", path: "/v2/aa/data/fetch", desc: "Fetch financial data" },
        { method: "GET", path: "/v2/aa/fips", desc: "List available FIPs" },
      ],
      sampleReq: `{
  "customer": {
    "id": "user@aa-id"
  },
  "fipId": "HDFC-FIP",
  "dataRange": {
    "from": "2023-01-01",
    "to": "2024-01-01"
  },
  "purpose": "Loan underwriting"
}`,
      sampleRes: `{
  "status": "CONSENT_CREATED",
  "data": {
    "consentId": "CON_yza567",
    "consentUrl": "https://aa.setu.co/c/CON_yza567",
    "expiresAt": "2024-01-21T10:30:00Z"
  }
}`,
      webhookEvents: ["aa.consent.approved", "aa.consent.rejected", "aa.data.ready", "aa.consent.revoked"],
      webhookPayload: `{
  "event": "aa.data.ready",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "consentId": "CON_yza567",
    "fipId": "HDFC-FIP",
    "accounts": 2,
    "dataFrom": "2023-01-01",
    "dataTo": "2024-01-01"
  }
}`,
      faqs: [
        { q: "What is the Account Aggregator framework?", a: "AA is an RBI-regulated framework that enables consent-based sharing of financial data between Financial Information Providers (FIPs) and Financial Information Users (FIUs)." },
        { q: "Which FIPs are supported?", a: "Most major banks and NBFCs are live on the AA network. Use the FIPs list API to see currently available institutions." },
        { q: "How long is consent valid?", a: "Consent validity is defined by you during creation. It can range from a one-time fetch to recurring access for up to a year." },
      ],
    },
    {
      id: "insights",
      title: "Insights",
      description: "Analyze customer financial data for credit scoring, risk analysis, and income verification.",
      features: ["Credit scoring", "Income analysis", "Expense categorization", "Risk indicators"],
      useCases: ["Loan decisioning", "Insurance underwriting", "Tenant screening", "Investment advisory"],
      endpoints: [
        { method: "POST", path: "/v2/insights/analyze", desc: "Analyze financial data" },
        { method: "GET", path: "/v2/insights/{reportId}", desc: "Get analysis report" },
        { method: "POST", path: "/v2/insights/score", desc: "Generate credit score" },
        { method: "GET", path: "/v2/insights/categories", desc: "List expense categories" },
      ],
      sampleReq: `{
  "dataSource": "ACCOUNT_AGGREGATOR",
  "consentId": "CON_yza567",
  "analysisType": ["INCOME", "EXPENSE", "CREDIT_SCORE"],
  "period": "12_MONTHS"
}`,
      sampleRes: `{
  "status": "COMPLETED",
  "data": {
    "reportId": "RPT_bcd890",
    "creditScore": 742,
    "monthlyIncome": 85000,
    "monthlyExpense": 52000,
    "savingsRatio": 0.39,
    "riskLevel": "LOW"
  }
}`,
      webhookEvents: ["insights.report.ready", "insights.report.failed"],
      webhookPayload: `{
  "event": "insights.report.ready",
  "timestamp": "2024-01-20T10:30:00Z",
  "data": {
    "reportId": "RPT_bcd890",
    "analysisTypes": ["INCOME", "EXPENSE", "CREDIT_SCORE"],
    "status": "COMPLETED"
  }
}`,
      faqs: [
        { q: "What data sources are supported?", a: "We support Account Aggregator data, bank statements (PDF), and direct API integrations with select banks." },
        { q: "How is the credit score calculated?", a: "Our proprietary model analyzes transaction patterns, income stability, expense behavior, and existing obligations to generate a score between 300-900." },
        { q: "Can I customize the analysis parameters?", a: "Yes, you can select specific analysis types, define custom time periods, and apply industry-specific scoring models." },
      ],
    },
  ],
};

type ProductCategory = keyof typeof PRODUCTS;
type Product = (typeof PRODUCTS)[ProductCategory][number];

const SUBSECTIONS = ["Overview", "Quick Start", "API Reference", "SDKs", "Webhooks", "FAQs"] as const;
type Subsection = (typeof SUBSECTIONS)[number];

const SDK_LANGUAGES = [
  { name: "Node.js", installCmd: "npm install @setu/node-sdk", icon: "JS" },
  { name: "Python", installCmd: "pip install setu-python", icon: "PY" },
  { name: "Java", installCmd: 'implementation "co.setu:setu-java-sdk:2.1.0"', icon: "JV" },
  { name: "Go", installCmd: "go get github.com/setu-co/setu-go", icon: "GO" },
];

/* ── Mock chat responses ── */
function getMockResponse(product: Product, message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("get started") || lower.includes("quick start") || lower.includes("setup")) {
    return `To get started with ${product.title}, you'll need to:\n\n1. Sign up for a Setu Bridge account\n2. Generate API credentials from the dashboard\n3. Install the SDK for your language of choice\n4. Make your first API call to the sandbox environment\n\nCheck the Quick Start guide for detailed steps!`;
  }
  if (lower.includes("pricing") || lower.includes("cost") || lower.includes("plan")) {
    return `${product.title} pricing is based on API usage. We offer:\n\n• Sandbox: Free for testing\n• Starter: ₹0.50 per API call\n• Growth: Volume discounts available\n• Enterprise: Custom pricing\n\nContact sales@setu.co for a detailed quote.`;
  }
  if (lower.includes("error") || lower.includes("fail") || lower.includes("issue")) {
    return `Common troubleshooting steps for ${product.title}:\n\n1. Verify your API key and secret are correct\n2. Ensure you're using the right environment (sandbox vs production)\n3. Check the request payload format matches the API documentation\n4. Review webhook logs for async operation failures\n\nIf the issue persists, reach out to support with your request ID.`;
  }
  if (lower.includes("webhook")) {
    return `${product.title} supports webhooks for real-time event notifications. Configure your webhook URL in the Bridge dashboard under Settings → Webhooks.\n\nSupported events: ${product.webhookEvents.join(", ")}\n\nAll webhook payloads include a signature header for verification.`;
  }
  return `Great question about ${product.title}! ${product.description}\n\nKey features include: ${product.features.join(", ")}.\n\nWould you like to know more about a specific feature or see code examples?`;
}

/* ── Chat Message Type ── */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/* ── DocsView Component ── */
export default function DocsView() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("Payments");
  const [selectedProductId, setSelectedProductId] = useState("bbps");
  const [activeSubsection, setActiveSubsection] = useState<Subsection>("Overview");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);

  const allProducts = [...PRODUCTS.Payments, ...PRODUCTS.Data];
  const product = allProducts.find((p) => p.id === selectedProductId) ?? PRODUCTS.Payments[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  function handleSelectProduct(id: string) {
    setSelectedProductId(id);
    setActiveSubsection("Overview");
    setExpandedFaqs(new Set());
  }

  function handleSendMessage(message: string) {
    if (!message.trim() || isTyping) return;
    const userMsg: ChatMessage = { role: "user", content: message.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = getMockResponse(product, message);
      setChatMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  }

  function toggleFaq(idx: number) {
    setExpandedFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const suggestedQuestions = [
    `How do I get started with ${product.title}?`,
    `What are ${product.title} webhook events?`,
    `Tell me about ${product.title} pricing`,
  ];

  return (
    <div className="mx-auto max-w-[1080px] px-4 pt-6 pb-16">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore product guides, API references, and integration resources
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="hidden md:block w-[220px] shrink-0">
          <nav className="sticky top-24 space-y-6">
            {(Object.keys(PRODUCTS) as ProductCategory[]).map((category) => (
              <div key={category}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {category}
                </h3>
                <ul className="space-y-0.5">
                  {PRODUCTS[category].map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(p.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedProductId === p.id
                            ? "bg-sidebar-accent text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {p.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Center Content */}
        <div className="flex-1 min-w-0">
          {/* Product Header */}
          <Card className="shadow-none border-0 mb-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">{product.title}</h2>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>

          {/* Mobile product selector */}
          <div className="md:hidden mb-4">
            <select
              value={selectedProductId}
              onChange={(e) => handleSelectProduct(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              {(Object.keys(PRODUCTS) as ProductCategory[]).map((category) => (
                <optgroup key={category} label={category}>
                  {PRODUCTS[category].map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Subsection Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
            {SUBSECTIONS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSubsection(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeSubsection === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeSubsection === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeSubsection === "Overview" && (
            <div className="space-y-4">
              <Card className="shadow-none border-0">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-base font-semibold text-foreground">About {product.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
              <Card className="shadow-none border-0">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-base font-semibold text-foreground">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-none border-0">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-base font-semibold text-foreground">Use Cases</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.useCases.map((uc) => (
                      <div
                        key={uc}
                        className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground"
                      >
                        {uc}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Start */}
          {activeSubsection === "Quick Start" && (
            <Card className="shadow-none border-0">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-base font-semibold text-foreground">Getting Started with {product.title}</h3>
                {[
                  { step: 1, title: "Install the SDK", content: `npm install @setu/node-sdk` },
                  { step: 2, title: "Configure credentials", content: `const setu = require('@setu/node-sdk');\n\nconst client = new setu.Client({\n  key: 'YOUR_API_KEY',\n  secret: 'YOUR_API_SECRET',\n  environment: 'sandbox'\n});` },
                  { step: 3, title: "Make your first API call", content: `const response = await client.${product.id}.create({\n  // See API Reference for parameters\n});\n\nconsole.log(response.data);` },
                  { step: 4, title: "Handle the response", content: `if (response.status === 'SUCCESS') {\n  // Process successful response\n  console.log('ID:', response.data.id);\n} else {\n  // Handle error\n  console.error('Error:', response.error);\n}` },
                ].map((s) => (
                  <div key={s.step} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {s.step}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                    </div>
                    <pre className="rounded-lg bg-muted p-4 text-xs text-foreground overflow-x-auto font-mono">
                      {s.content}
                    </pre>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* API Reference */}
          {activeSubsection === "API Reference" && (
            <div className="space-y-4">
              <Card className="shadow-none border-0">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Endpoints</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Method</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Path</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.endpoints.map((ep) => (
                          <tr key={ep.path} className="border-b border-border last:border-0">
                            <td className="px-3 py-2">
                              <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                                ep.method === "GET"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                  : ep.method === "POST"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                              }`}>
                                {ep.method}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-foreground">{ep.path}</td>
                            <td className="px-3 py-2 text-muted-foreground">{ep.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-none border-0">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Code size={16} className="text-muted-foreground" />
                      <h4 className="text-sm font-semibold text-foreground">Sample Request</h4>
                    </div>
                    <pre className="rounded-lg bg-muted p-4 text-xs text-foreground overflow-x-auto font-mono">
                      {product.sampleReq}
                    </pre>
                  </CardContent>
                </Card>
                <Card className="shadow-none border-0">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal size={16} className="text-muted-foreground" />
                      <h4 className="text-sm font-semibold text-foreground">Sample Response</h4>
                    </div>
                    <pre className="rounded-lg bg-muted p-4 text-xs text-foreground overflow-x-auto font-mono">
                      {product.sampleRes}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* SDKs */}
          {activeSubsection === "SDKs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SDK_LANGUAGES.map((lang) => (
                <Card key={lang.name} className="shadow-none border-0">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-bold text-foreground">
                        {lang.icon}
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">{lang.name}</h4>
                    </div>
                    <pre className="rounded-lg bg-muted p-3 text-xs text-foreground overflow-x-auto font-mono">
                      {lang.installCmd}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Webhooks */}
          {activeSubsection === "Webhooks" && (
            <div className="space-y-4">
              <Card className="shadow-none border-0">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Webhook Events</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Event</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.webhookEvents.map((evt) => (
                          <tr key={evt} className="border-b border-border last:border-0">
                            <td className="px-3 py-2 font-mono text-xs text-foreground">{evt}</td>
                            <td className="px-3 py-2 text-muted-foreground">
                              Triggered when {evt.split(".").slice(1).join(" ")} occurs
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none border-0">
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Code size={16} className="text-muted-foreground" />
                    <h4 className="text-sm font-semibold text-foreground">Sample Webhook Payload</h4>
                  </div>
                  <pre className="rounded-lg bg-muted p-4 text-xs text-foreground overflow-x-auto font-mono">
                    {product.webhookPayload}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* FAQs */}
          {activeSubsection === "FAQs" && (
            <div className="space-y-2">
              {product.faqs.map((faq, idx) => (
                <Card key={idx} className="shadow-none border-0">
                  <CardContent className="p-0">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                      {expandedFaqs.has(idx) ? (
                        <CaretDown size={16} className="text-muted-foreground shrink-0" />
                      ) : (
                        <CaretRight size={16} className="text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {expandedFaqs.has(idx) && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Button */}
      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <Robot size={24} weight="fill" />
        </button>
      )}

      {/* AI Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-[400px] max-h-[560px] flex flex-col rounded-2xl border border-border bg-background shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Robot size={20} weight="fill" className="text-primary" />
              <span className="text-sm font-semibold text-foreground">Setu AI Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[360px]">
            {chatMessages.length === 0 && !isTyping && (
              <div className="text-center py-6">
                <Robot size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Ask me anything about {product.title}
                </p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Questions */}
          {chatMessages.length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(chatInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-opacity"
                aria-label="Send message"
              >
                <PaperPlaneTilt size={16} weight="fill" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
