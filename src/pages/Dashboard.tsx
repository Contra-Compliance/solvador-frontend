import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
  Copy,
  KeyRound,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Webhook,
} from "lucide-react"
import { SolvadorWordmark } from "@/components/Brand"
import Sidebar from "@/components/dashboard/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { isTabKey, NAV, tabPath, type TabKey } from "@/components/dashboard/nav"

type Transaction = {
  id: string
  status: "Settled" | "Pending"
  network: string
  asset: string
  amount: string
  date: string
  hash: string
}

const transactions: Transaction[] = [
  { id: "tx_98F2A1", status: "Settled", network: "Base", asset: "USDC", amount: "$240.00", date: "Today, 10:42 AM", hash: "0x8f2a…c91e" },
  { id: "tx_98F19C", status: "Settled", network: "Ethereum", asset: "USDC", amount: "$86.40", date: "Today, 9:18 AM", hash: "0x2b91…a0d4" },
  { id: "tx_97E84B", status: "Pending", network: "Solana", asset: "USDC", amount: "$1,250.00", date: "Yesterday, 4:06 PM", hash: "5xGk…7Pq2" },
  { id: "tx_97D11A", status: "Settled", network: "Base", asset: "USDC", amount: "$42.50", date: "Yesterday, 1:32 PM", hash: "0x99bd…21fa" },
  { id: "tx_96C0D8", status: "Settled", network: "Polygon", asset: "USDC", amount: "$680.00", date: "Oct 22, 11:04 AM", hash: "0x71ce…90b1" },
]

const trend = [36, 52, 42, 64, 58, 72, 61, 78, 66, 84, 76, 92]

const titles: Record<TabKey, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Your settlement activity at a glance" },
  metrics: { title: "Metrics", subtitle: "Settlements and volume over time" },
  settlements: { title: "Settlements", subtitle: "Review recent settlement activity" },
  confidential: { title: "Confidential", subtitle: "Private settlement experience" },
  keys: { title: "API Keys", subtitle: "Manage your project keys" },
  webhooks: { title: "Webhooks", subtitle: "Configure event notifications" },
  plans: { title: "Plans", subtitle: "Choose the right workspace plan" },
}

function TrendChart() {
  return (
    <div className="flex h-52 items-end gap-2 pt-8">
      {trend.map((height, index) => (
        <div key={index} className="group relative flex h-full flex-1 items-end">
          <div
            className="w-full rounded-t-md bg-primary/80 transition-all group-hover:bg-primary"
            style={{ height: `${height}%` }}
          />
        </div>
      ))}
    </div>
  )
}

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total volume", "$24,892.40", "+12.8%", CircleDollarSign],
          ["Settlements", "1,284", "+8.4%", Activity],
          ["Success rate", "99.2%", "+0.6%", ShieldCheck],
          ["Avg. settlement", "$19.39", "-2.1%", ArrowUpRight],
        ].map(([label, value, change, Icon]) => (
          <Card key={label as string}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-sm">{label as string}</span>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{value as string}</div>
              <div className="mt-1 text-xs text-emerald-600">{change as string} from last month</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Settlement activity</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <Button variant="outline" size="sm">Monthly <ChevronRight className="ml-1 h-3 w-3" /></Button>
          </CardHeader>
          <CardContent><TrendChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Monthly quota</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2"><span className="text-4xl font-semibold">72</span><span className="pb-1 text-sm text-muted-foreground">/ 100 settlements</span></div>
            <Progress value={72} className="mt-5 h-2" />
            <p className="mt-3 text-xs text-muted-foreground">28 settlements remaining this month</p>
            <Button variant="outline" className="mt-6 w-full">Compare plans <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Network mix</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[ ["Base", "52%", "bg-[#4d74f5]"], ["Ethereum", "28%", "bg-[#8c9eff]"], ["Solana", "14%", "bg-[#9c6df2]"], ["Polygon", "6%", "bg-[#b6a4ff]"] ].map(([name, value, color]) => (
              <div key={name} className="space-y-2"><div className="flex justify-between text-sm"><span>{name}</span><span className="text-muted-foreground">{value}</span></div><div className="h-2 rounded-full bg-secondary"><div className={cn("h-full rounded-full", color)} style={{ width: value }} /></div></div>
            ))}
          </CardContent>
        </Card>
        <TransactionTable compact />
      </div>
    </div>
  )
}

function TransactionTable({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => transactions.filter((tx) => `${tx.network} ${tx.asset} ${tx.hash}`.toLowerCase().includes(query.toLowerCase())), [query])
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-sm font-medium">{compact ? "Recent settlements" : "All settlements"}</CardTitle><p className="mt-1 text-xs text-muted-foreground">Latest activity in your workspace</p></div>{!compact && <Button variant="outline" size="sm"><ArrowDownToLine className="mr-2 h-4 w-4" />Export</Button>}</CardHeader>
      <CardContent>
        {!compact && <div className="mb-4 flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search settlements" className="pl-9" /></div><Button variant="outline" size="icon"><SlidersHorizontal className="h-4 w-4" /></Button></div>}
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs text-muted-foreground"><tr><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Network</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Hash</th><th /></tr></thead><tbody>{filtered.map((tx) => <tr key={tx.id} className="border-b last:border-0"><td className="py-3"><span className={cn("inline-flex items-center gap-1.5 text-xs", tx.status === "Settled" ? "text-emerald-600" : "text-amber-600")}><span className="h-1.5 w-1.5 rounded-full bg-current" />{tx.status}</span></td><td className="py-3">{tx.network}<div className="text-xs text-muted-foreground">{tx.asset}</div></td><td className="py-3 font-medium">{tx.amount}</td><td className="py-3 text-muted-foreground">{tx.date}</td><td className="py-3 font-mono text-xs text-muted-foreground">{tx.hash}</td><td className="py-3 text-right"><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div>
      </CardContent>
    </Card>
  )
}

function PlaceholderPanel({ tab }: { tab: TabKey }) {
  const copy: Record<TabKey, { icon: typeof KeyRound; title: string; body: string }> = {
    overview: { icon: Activity, title: "Overview", body: "" }, metrics: { icon: Activity, title: "Metrics", body: "Explore settlement trends and performance indicators." }, settlements: { icon: RefreshCw, title: "Settlements", body: "Review and filter your settlement activity." }, confidential: { icon: ShieldCheck, title: "Confidential mode", body: "Private settlement controls will appear here." }, keys: { icon: KeyRound, title: "Project keys", body: "Create and organize keys for your projects." }, webhooks: { icon: Webhook, title: "Webhook endpoints", body: "Configure event destinations for your workspace." }, plans: { icon: CircleDollarSign, title: "Workspace plans", body: "Compare plans and manage your workspace settings." }, }
  const item = copy[tab]
  const Icon = item.icon
  return <Card className="min-h-[420px]"><CardContent className="flex h-full min-h-[420px] flex-col items-center justify-center text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary"><Icon className="h-6 w-6" /></div><h2 className="mt-5 text-xl font-semibold">{item.title}</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">{item.body}</p><Button className="mt-6"><Plus className="mr-2 h-4 w-4" />Add example</Button></CardContent></Card>
}

export default function Dashboard() {
  const { tab: tabParam } = useParams()
  const tab: TabKey = isTabKey(tabParam) ? tabParam : "overview"
  const head = titles[tab]
  const [copied, setCopied] = useState(false)
  const copyDemoKey = () => { setCopied(true); window.setTimeout(() => setCopied(false), 1600) }

  return <div className="dashboard-theme flex h-screen overflow-hidden bg-background text-foreground"><Sidebar active={tab} />
    <div className="flex min-w-0 flex-1 flex-col"><header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur"><div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8"><SolvadorWordmark className="text-lg text-foreground md:hidden" /><div className="hidden md:block"><h1 className="text-lg font-semibold leading-tight">{head.title}</h1><p className="text-xs text-muted-foreground">{head.subtitle}</p></div><div className="flex items-center gap-3"><span className="rounded-full border border-border px-3 py-1 font-mono text-xs uppercase">UI preview</span><Button onClick={copyDemoKey} variant="outline" size="sm"><Copy className="mr-2 h-3.5 w-3.5" />{copied ? "Copied" : "Copy demo key"}</Button></div></div><div className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 md:hidden">{NAV.map((item) => <Link key={item.key} to={tabPath(item.key)} className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm", tab === item.key ? "bg-secondary font-medium text-primary" : "text-muted-foreground")}><item.icon className="h-4 w-4" />{item.label}</Link>)}</div></header>
      <main className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8"><div className="mx-auto max-w-6xl">{tab === "overview" ? <Overview /> : tab === "settlements" ? <TransactionTable /> : tab === "keys" ? <PlaceholderPanel tab="keys" /> : <PlaceholderPanel tab={tab} />}</div></main></div>
  </div>
}
