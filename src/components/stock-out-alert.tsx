"use client";

import { PackageX, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type StockOutStation = { id: string; name: string; customerId: string; stockOutItemIds: string[] };

export function stationStockOutUrl(customerId: string, stationId: string) {
  return `/customers/${encodeURIComponent(customerId)}?station=${encodeURIComponent(stationId)}&tab=stations`;
}

export function StockOutBadge({ count, href }: { count: number; href?: string }) {
  if (count === 0) return null;
  const content = <><PackageX size={16} aria-hidden="true"/><span>{count} stocked out</span></>;
  const label = `${count} stocked-out ${count === 1 ? "SKU" : "SKUs"}${href ? "; open station" : ""}`;
  return href ? <Link href={href} className="stock-out-badge" aria-label={label}>{content}</Link> : <span className="stock-out-badge" aria-label={label}>{content}</span>;
}

export function CustomerStockOutAlert({ stations }: { stations: StockOutStation[] }) {
  const affected = stations.filter(s => s.stockOutItemIds.length > 0);
  const count = new Set(affected.flatMap(s => s.stockOutItemIds)).size;
  if (!count) return null;
  return <div className="customer-stock-out"><StockOutBadge count={count} href={stationStockOutUrl(affected[0].customerId, affected[0].id)} /></div>;
}

export function DashboardStockOutAlert({ stations, loading, error }: { stations: (StockOutStation & { customerName: string })[]; loading: boolean; error: boolean }) {
  const router = useRouter();
  const affected = stations.filter(s => s.stockOutItemIds.length > 0);
  const count = new Set(affected.flatMap(s => s.stockOutItemIds)).size;
  const pending = loading || error;
  return <section className={`dashboard-stock-out ${pending ? "stock-out-pending" : count ? "stock-out-active" : "stock-out-clear"}`} aria-label="Stock out alert">
    <div className="flex items-center gap-3" aria-live="polite">{count || pending ? <PackageX size={26} aria-hidden="true"/> : <CircleCheck size={26} aria-hidden="true"/>}<div><p className="text-lg">Stock out alert · {error ? "Unavailable" : loading ? "Checking…" : `${count} ${count === 1 ? "SKU" : "SKUs"} stocked out`}</p><p className="text-sm mt-1">{error ? "Unable to load inventory. Try refreshing." : loading ? "Checking station inventory." : count ? `Across ${affected.length} ${affected.length === 1 ? "station" : "stations"}. Select a station to review its inventory.` : "No stocked-out SKUs across your vending stations."}</p></div></div>
    <select aria-label="Open a stocked-out station" value="" disabled={pending || !count} onChange={e=>{if(e.target.value) router.push(e.target.value);}}><option value="">{count ? "Choose a stocked-out station" : "No stocked-out stations"}</option>{affected.map(s=><option key={s.id} value={stationStockOutUrl(s.customerId,s.id)}>{s.customerName} · {s.name} · {s.stockOutItemIds.length} stocked out</option>)}</select>
  </section>;
}
