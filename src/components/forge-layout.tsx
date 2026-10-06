"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForgeMark, BrandBadge } from "@/components/brand-icons";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Warehouse,
  Box,
  Database,
} from "lucide-react";

interface ForgeLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
];

export function ForgeLayout({ children }: ForgeLayoutProps) {
  const pathname = usePathname();
  const navigation = [
    ...navItems,
    { href: "/machines", label: "Machine library", icon: Warehouse },
    { href: "/demo/vending", label: "Vending simulator", icon: Box },
    { href: "/demo/erp", label: "ERP workspace", icon: Database },
  ];
  return <div className="forge-shell">
    <aside className="forge-sidebar">
      <Link href="/" className="forge-brand" aria-label="Forge home"><ForgeMark className="w-11 h-11" /><span>Forge<small>One connected operation</small></span></Link>
      <p className="sidebar-caption">Your workspace</p>
      <nav aria-label="Main navigation">{navigation.map(({href,label,icon:Icon}) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={cn("sidebar-link", (pathname === href || (href === "/customers" && pathname.startsWith(href))) && "active")}><Icon size={18}/>{label}</Link>)}</nav>
      <div className="sidebar-systems"><p>Systems, brought together.</p><div><BrandBadge brand="AUTOCRIB" /></div><div><BrandBadge brand="CRIBMASTER" /></div><div className="flex items-center gap-2 text-sm"><Database size={14} /> Prophet 21</div><div className="sidebar-fusion"><ForgeMark className="w-7 h-7"/><span>One view. Better decisions.</span></div></div>
      <div className="sidebar-footer"><span className="status-dot status-dot-ok" /> Demo workspace</div>
    </aside>
    <div className="forge-workspace"><header className="workspace-bar"><span>Inventory operations</span><span className="workspace-mode"><span className="status-dot status-dot-ok"/> Sample data</span></header><main>{children}</main><footer className="workspace-footer">Forge · Vending and ERP, working together.</footer></div>
  </div>;
}

// Stat card component for dashboard
interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: "default" | "highlight" | "warning";
  className?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  trend,
  trendValue,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "forge-card forge-stat rounded-lg p-5 transition-all duration-300 hover:border-[var(--border-strong)]",
        variant === "highlight" && "border-[var(--copper)]/30 bg-gradient-to-br from-[var(--card)] to-[var(--copper)]/5",
        variant === "warning" && "border-[var(--status-warn)]/30",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-[var(--muted-foreground)] font-medium">
          {label}
        </span>
        {icon && (
          <div className={cn(
            "p-2 rounded",
            variant === "highlight" ? "bg-[var(--copper)]/10 text-[var(--copper)]" : "bg-[var(--accent)] text-[var(--muted-foreground)]"
          )}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end gap-3">
        <span className="font-[family-name:var(--font-bebas)] text-4xl font-semibold text-[var(--foreground)] tracking-tight">
          {value}
        </span>
        {trend && trendValue && (
          <span
            className={cn(
              "text-sm font-medium mb-1",
              trend === "up" && "text-[var(--status-ok)]",
              trend === "down" && "text-[var(--status-critical)]",
              trend === "neutral" && "text-[var(--muted-foreground)]"
            )}
          >
            {trend === "up" && "+"}{trendValue}
          </span>
        )}
      </div>

      {sublabel && (
        <p className="text-sm text-[var(--muted-foreground)] mt-2">{sublabel}</p>
      )}
    </div>
  );
}

// Section header component
interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// Empty state component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="forge-card rounded-lg p-12 text-center">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
