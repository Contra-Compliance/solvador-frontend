import type { ComponentType } from "react"
import {
  LayoutDashboard,
  ChartNoAxesColumn,
  ArrowLeftRight,
  KeyRound,
  Webhook,
  CreditCard,
  EyeOff,
} from "lucide-react"

export type TabKey =
  | "overview"
  | "metrics"
  | "settlements"
  | "confidential"
  | "keys"
  | "webhooks"
  | "plans"

export interface NavSubItem {
  key: string
  label: string
  /** Tailwind class painting the network dot (brand color). */
  dotClass: string
}

export const NAV: {
  key: TabKey
  label: string
  icon: ComponentType<{ className?: string }>
  /** Sidebar sub-entries (e.g. the networks a confidential tier runs on). */
  subItems?: NavSubItem[]
}[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "metrics", label: "Metrics", icon: ChartNoAxesColumn },
  { key: "settlements", label: "Settlements", icon: ArrowLeftRight },
  {
    key: "confidential",
    label: "Confidential",
    icon: EyeOff,
    // Per-network sub-sections; Base is the only network the tier runs on today.
    subItems: [{ key: "base", label: "Base", dotClass: "bg-[#0052FF]" }],
  },
  { key: "keys", label: "API Keys", icon: KeyRound },
  { key: "webhooks", label: "Webhooks", icon: Webhook },
  { key: "plans", label: "Plans", icon: CreditCard },
]

/** URL for a tab — Overview lives at the root, the rest at /<key>. */
export const tabPath = (t: TabKey) => (t === "overview" ? "/" : `/${t}`)

export const isTabKey = (v: string | undefined): v is TabKey => NAV.some((n) => n.key === v)
