import { Link } from "react-router-dom"
import { SolvadorWordmark } from "@/components/Brand"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { NAV, tabPath, type TabKey } from "@/components/dashboard/nav"

export default function Sidebar({ active }: { active: TabKey }) {
  return <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
    <div className="flex h-16 items-center border-b border-sidebar-border px-5"><SolvadorWordmark className="text-xl text-foreground" /></div>
    <nav className="flex-1 space-y-1 p-3">{NAV.map((item) => <div key={item.key}><Link to={tabPath(item.key)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition", active === item.key ? "bg-sidebar-accent font-medium text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground")}><item.icon className="h-4 w-4" />{item.label}</Link>{item.subItems && <div className="mt-1 space-y-0.5">{item.subItems.map((sub) => <Link key={sub.key} to={tabPath(item.key)} className="ml-6 flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"><span className={cn("size-2 rounded-full", sub.dotClass)} aria-hidden />{sub.label}</Link>)}</div>}</div>)}</nav>
    <div className="flex items-center gap-3 border-t border-sidebar-border p-3"><Avatar className="h-8 w-8"><AvatarFallback className="bg-secondary text-xs font-medium">UI</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="truncate text-xs font-medium">Preview workspace</div><div className="truncate text-[11px] text-muted-foreground">Local interface</div></div></div>
  </aside>
}
