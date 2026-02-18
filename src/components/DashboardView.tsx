"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, CalendarBlank, ArrowUp, ArrowDown } from "@phosphor-icons/react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sankey = require("highcharts/modules/sankey");
  if (typeof sankey === "function") sankey(Highcharts);
  else if (sankey?.default) sankey.default(Highcharts);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const variablePie = require("highcharts/modules/variable-pie");
  if (typeof variablePie === "function") variablePie(Highcharts);
  else if (variablePie?.default) variablePie.default(Highcharts);
}

/* ── Mock Data ── */
const MOCK_REPORTS = Array.from({ length: 20 }, (_, i) => ({
  date: `2024-01-${String(i + 5).padStart(2, "0")}`,
  paymentId: `PAY${String(900100 + i)}`,
  txnId: `TXN${String(770200 + i)}`,
  merchantRef: `MER${String(330400 + i)}`,
  rrn: `${String(112200300 + i * 7)}`,
  amount: (Math.random() * 50000 + 500).toFixed(2),
}));

/* ── Highcharts theme helper ── */
function getChartTheme(isDark: boolean) {
  return {
    chart: {
      backgroundColor: "transparent",
      style: { fontFamily: "inherit" },
    },
    title: {
      style: { color: isDark ? "#e5e5e5" : "#171717", fontSize: "14px", fontWeight: "600" },
    },
    legend: {
      itemStyle: { color: isDark ? "#a3a3a3" : "#525252", fontSize: "12px" },
      itemHoverStyle: { color: isDark ? "#e5e5e5" : "#171717" },
    },
    tooltip: {
      backgroundColor: isDark ? "#262626" : "#ffffff",
      borderColor: isDark ? "#404040" : "#e5e5e5",
      style: { color: isDark ? "#e5e5e5" : "#171717" },
    },
    plotOptions: {
      pie: {
        borderWidth: 0,
        dataLabels: {
          color: isDark ? "#a3a3a3" : "#525252",
          style: { textOutline: "none" },
        },
      },
    },
  };
}

/* ── Chart configs ── */
function paymentAppsChart(isDark: boolean): Highcharts.Options {
  const theme = getChartTheme(isDark);
  return {
    ...theme,
    chart: { ...theme.chart, type: "variablepie", height: 300 },
    title: { text: undefined },
    tooltip: {
      ...theme.tooltip,
      pointFormat: "<b>{point.percentage:.1f}%</b> ({point.y:,.0f})",
    },
    plotOptions: {
      ...theme.plotOptions,
      variablepie: {
        borderWidth: 0,
        innerSize: "40%",
        minPointSize: 10,
        zMin: 0,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
          distance: 16,
          style: {
            color: isDark ? "#a3a3a3" : "#525252",
            textOutline: "none",
            fontSize: "11px",
            fontWeight: "500",
          },
        },
        showInLegend: false,
      },
    },
    legend: { enabled: false },
    series: [
      {
        type: "variablepie" as const,
        name: "Transactions",
        data: [
          { name: "PhonePe", y: 185200, z: 185, color: "#84E3F0E6" },   // setu-brand-400 / 90%
          { name: "Google Pay", y: 142800, z: 143, color: "#818cf8E6" }, // indigo-400 / 90%
          { name: "Paytm", y: 78300, z: 78, color: "#fb923cE6" },       // orange-400 / 90%
          { name: "Amazon Pay", y: 52100, z: 52, color: "#57D9EAE6" },  // setu-brand-500 / 90%
          { name: "CRED", y: 28400, z: 28, color: "#6366f1E6" },        // indigo-500 / 90%
          { name: "Others", y: 17711, z: 18, color: "#2ACFE5E6" },      // setu-brand-600 / 90%
        ],
      },
    ],
    credits: { enabled: false },
  };
}

function bankSplitChart(isDark: boolean): Highcharts.Options {
  const theme = getChartTheme(isDark);
  return {
    ...theme,
    chart: { ...theme.chart, type: "variablepie", height: 300 },
    title: { text: undefined },
    tooltip: {
      ...theme.tooltip,
      pointFormat: "<b>{point.percentage:.1f}%</b> ({point.y:,.0f})",
    },
    plotOptions: {
      ...theme.plotOptions,
      variablepie: {
        borderWidth: 0,
        innerSize: "40%",
        minPointSize: 10,
        zMin: 0,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
          distance: 16,
          style: {
            color: isDark ? "#a3a3a3" : "#525252",
            textOutline: "none",
            fontSize: "11px",
            fontWeight: "500",
          },
        },
        showInLegend: false,
      },
    },
    legend: { enabled: false },
    series: [
      {
        type: "variablepie" as const,
        name: "Transactions",
        data: [
          { name: "HDFC Bank", y: 132000, z: 132, color: "#4f46e5E6" },    // indigo-600 / 90%
          { name: "SBI", y: 118500, z: 119, color: "#84E3F0E6" },          // setu-brand-400 / 90%
          { name: "ICICI Bank", y: 95200, z: 95, color: "#ea580cE6" },     // orange-600 / 90%
          { name: "Kotak Mahindra", y: 68800, z: 69, color: "#57D9EAE6" }, // setu-brand-500 / 90%
          { name: "Axis Bank", y: 53100, z: 53, color: "#818cf8E6" },      // indigo-400 / 90%
          { name: "Others", y: 36911, z: 37, color: "#2ACFE5E6" },         // setu-brand-600 / 90%
        ],
      },
    ],
    credits: { enabled: false },
  };
}

function failedRequestsChart(isDark: boolean): Highcharts.Options {
  const theme = getChartTheme(isDark);
  return {
    ...theme,
    chart: { ...theme.chart, type: "bar", height: 160 },
    title: { text: undefined },
    xAxis: {
      categories: ["Failed Requests"],
      labels: { enabled: false },
      lineWidth: 0,
      tickWidth: 0,
    },
    yAxis: {
      visible: false,
      reversedStacks: false,
    },
    tooltip: {
      ...theme.tooltip,
      pointFormat: "<b>{series.name}</b>: {point.y:,.0f} ({point.percentage:.1f}%)",
    },
    plotOptions: {
      bar: {
        stacking: "percent",
        borderWidth: 0,
        borderRadius: 4,
        pointWidth: 48,
        dataLabels: {
          enabled: false,
        },
      },
    },
    legend: {
      ...theme.legend,
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        ...theme.legend.itemStyle,
        fontSize: "12px",
      },
    },
    series: [
      {
        type: "bar" as const,
        name: "Technical decline",
        data: [18900],
        color: "#ea580cE6",  // orange-600 / 90%
      },
      {
        type: "bar" as const,
        name: "Business decline",
        data: [11200],
        color: "#fb923cE6",  // orange-400 / 90%
      },
      {
        type: "bar" as const,
        name: "Not applicable",
        data: [3359],
        color: "#57D9EAE6",  // setu-brand-500 / 90%
      },
    ],
    credits: { enabled: false },
  };
}

function paymentsSankeyChart(isDark: boolean): Highcharts.Options {
  const theme = getChartTheme(isDark);
  return {
    ...theme,
    chart: {
      ...theme.chart,
      inverted: true,
      height: 580,
    },
    title: { text: undefined },
    tooltip: {
      ...theme.tooltip,
      pointFormat: "{point.fromNode.name} → {point.toNode.name}: <b>{point.weight:,.0f}</b>",
    } as Highcharts.TooltipOptions,
    plotOptions: {
      sankey: {
        nodeWidth: 20,
        nodePadding: 24,
        curveFactor: 0.5,
        dataLabels: {
          enabled: true,
          style: {
            color: isDark ? "#a3a3a3" : "#525252",
            textOutline: "none",
            fontSize: "11px",
            fontWeight: "500",
          },
          nodeFormat: "{point.name}: {point.sum:,.0f}",
        },
        states: {
          hover: { brightness: 0.1 },
        },
      },
    },
    series: [
      {
        type: "sankey" as const,
        name: "Payment Flow",
        keys: ["from", "to", "weight"],
        nodes: [
          { id: "Total Transactions", color: "#84E3F0E6" },       // setu-brand-400 / 90%
          { id: "Processed", color: "#57D9EAE6" },                // setu-brand-500 / 90%
          { id: "Dropped", color: "#818cf8E6" },                  // indigo-400 / 90%
          { id: "Successful", color: "#2ACFE5E6" },               // setu-brand-600 / 90%
          { id: "Failed", color: "#f97316E6" },                   // orange-500 / 90%
          { id: "Technical Decline", color: "#ea580cE6" },        // orange-600 / 90%
          { id: "Business Decline", color: "#fb923cE6" },         // orange-400 / 90%
          { id: "Not Applicable", color: "#6366f1E6" },           // indigo-500 / 90%
        ] as Highcharts.SeriesSankeyNodesOptionsObject[],
        data: [
          ["Total Transactions", "Processed", 478200],
          ["Total Transactions", "Dropped", 26311],
          ["Processed", "Successful", 467666],
          ["Processed", "Failed", 10534],
          ["Dropped", "Failed", 26411],
          ["Failed", "Technical Decline", 18900],
          ["Failed", "Business Decline", 11200],
          ["Failed", "Not Applicable", 6845],
        ],
      },
    ],
    credits: { enabled: false },
  };
}

/* ── KPI Card ── */
function KpiCard({
  label,
  value,
  sub,
  bar,
}: {
  label: string;
  value: string;
  sub?: string;
  bar?: { success: number; failed: number };
}) {
  return (
    <Card className="shadow-none border border-border/40">
      <CardContent className="p-6 space-y-2">
        <p className="text-xs font-medium text-muted-foreground tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        {bar && (
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${bar.success}%` }}
              />
              <div
                className="h-full bg-red-400"
                style={{ width: `${bar.failed}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Success {bar.success}%
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                Failed {bar.failed}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Main Dashboard ── */
export default function DashboardView() {
  const [dashboardTab, setDashboardTab] = useState<"analytics" | "reports">("analytics");
  const [timeFilter, setTimeFilter] = useState("Last 30 days");
  const [tableSearch, setTableSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const chartRefs = useRef<(HighchartsReact.RefObject | null)[]>([]);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  // Reflow charts when dark mode changes
  useEffect(() => {
    chartRefs.current.forEach((ref) => {
      ref?.chart?.reflow();
    });
  }, [isDark]);

  const filteredReports = tableSearch
    ? MOCK_REPORTS.filter(
        (r) =>
          r.paymentId.toLowerCase().includes(tableSearch.toLowerCase()) ||
          r.txnId.toLowerCase().includes(tableSearch.toLowerCase()) ||
          r.merchantRef.toLowerCase().includes(tableSearch.toLowerCase())
      )
    : MOCK_REPORTS;

  const TIME_FILTERS = ["Last 7 days", "Last 30 days", "Last 90 days", "Custom"];

  return (
    <div className="my-2 ml-2 mr-2 rounded-xl bg-background h-[calc(100vh-16px)] overflow-hidden flex flex-col">
      <div className="shrink-0 bg-background z-10 px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">UPI Transactions</h1>
      </div>
    <div className="flex-1 overflow-y-auto px-6 pb-16">

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {(["analytics", "reports"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setDashboardTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              dashboardTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {dashboardTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
        ))}
      </div>

      {dashboardTab === "analytics" && (
      <>
      {/* Time Filter Chips */}
      <div className="flex items-center gap-2 mb-6">
        {TIME_FILTERS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setTimeFilter(chip)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              timeFilter === chip
                ? "bg-foreground text-background"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Card className="shadow-none border border-border/40">
          <CardContent className="p-6">
            <p className="text-xs font-medium text-muted-foreground tracking-wide">Total transactions</p>
            <p className="text-2xl font-bold text-foreground mt-1">5,04,511</p>
            <p className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUp size={11} weight="bold" />
              12.4% vs last period
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none border border-border/40">
          <CardContent className="p-6">
            <p className="text-xs font-medium text-muted-foreground tracking-wide">Total amount paid</p>
            <p className="text-2xl font-bold text-foreground mt-1">₹25,832Cr</p>
            <p className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUp size={11} weight="bold" />
              8.1% vs last period
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-none border border-border/40">
          <CardContent className="p-6 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground tracking-wide">Success rate</p>
              <p className="text-3xl font-bold text-foreground mt-1">94.7%</p>
              <div className="mt-3 w-full">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "94.7%" }} />
                  <div className="h-full bg-red-400" style={{ width: "5.3%" }} />
                </div>
              </div>
            </div>
            <div className="flex gap-6 pt-1">
              <div>
                <p className="text-xs font-medium text-muted-foreground tracking-wide">Successful</p>
                <p className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-bold text-foreground">4,67,666</span>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"><ArrowUp size={11} weight="bold" />92.7%</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground tracking-wide">Failed</p>
                <p className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-bold text-foreground">36,945</span>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-red-500 dark:text-red-400"><ArrowDown size={11} weight="bold" />7.3%</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel (left, 2 rows) + Payment Apps & Bank Split (right, stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="shadow-none border border-border/40 lg:row-span-2">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-base font-medium text-center">
              Payment funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={paymentsSankeyChart(isDark)}
              ref={(el: HighchartsReact.RefObject | null) => { chartRefs.current[3] = el; }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border/40">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-base font-medium text-center">
              Split of payment apps used by customer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <HighchartsReact
              highcharts={Highcharts}
              options={paymentAppsChart(isDark)}
              ref={(el: HighchartsReact.RefObject | null) => { chartRefs.current[0] = el; }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-none border border-border/40">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-base font-medium text-center">
              Split of customer bank used for payment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <HighchartsReact
              highcharts={Highcharts}
              options={bankSplitChart(isDark)}
              ref={(el: HighchartsReact.RefObject | null) => { chartRefs.current[1] = el; }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Failed Requests Chart */}
      <div className="mb-4">
        <Card className="shadow-none border border-border/40">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center justify-center gap-3">
              <CardTitle className="text-base font-medium text-center">
                Reasons for failed requests
              </CardTitle>
              <span className="rounded-full bg-red-100 dark:bg-red-950 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                33,459 total
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <HighchartsReact
              highcharts={Highcharts}
              options={failedRequestsChart(isDark)}
              ref={(el: HighchartsReact.RefObject | null) => { chartRefs.current[2] = el; }}
            />
          </CardContent>
        </Card>
      </div>
      </>
      )}

      {/* Reports Table */}
      {dashboardTab === "reports" && (
      <Card className="shadow-none border border-border/40">
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base font-medium text-center">Reports</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
                <CalendarBlank size={14} />
                <span>Jan 5, 2024</span>
                <span>–</span>
                <span>Jan 25, 2024</span>
              </div>
              <div className="relative">
                <MagnifyingGlass
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="Search by ID"
                  className="h-8 pl-8 text-xs w-44"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-border">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Merchant Ref ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    RRN
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Net Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((row) => (
                  <tr
                    key={row.paymentId}
                    className="border-t border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-foreground whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-4 py-2.5 text-foreground font-mono text-xs">
                      {row.paymentId}
                    </td>
                    <td className="px-4 py-2.5 text-foreground font-mono text-xs">
                      {row.txnId}
                    </td>
                    <td className="px-4 py-2.5 text-foreground font-mono text-xs">
                      {row.merchantRef}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">
                      {row.rrn}
                    </td>
                    <td className="px-4 py-2.5 text-right text-foreground font-mono text-xs">
                      ₹{Number(row.amount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
    </div>
  );
}
