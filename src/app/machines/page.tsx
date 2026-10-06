"use client";

import { useState } from "react";
import { ForgeLayout } from "@/components/forge-layout";
import { MachineIcon, BrandBadge, machineTypes } from "@/components/brand-icons";
import { trpc } from "@/lib/trpc";

export default function MachinesPage() {
  const [brandFilter, setBrandFilter] = useState("ALL");
  const { data: customers } = trpc.customers.list.useQuery();
  const stations = customers?.flatMap(c => c.vendingStations) ?? [];
  return <ForgeLayout><div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
    <h1>Meet your machines.</h1><p className="text-[var(--muted-foreground)] mt-3 max-w-2xl">Different hardware. One workspace. Recognize every machine in your fleet by its form and manufacturer.</p>
    <div className="flex gap-2 my-8 flex-wrap" role="group" aria-label="Filter by manufacturer">{["ALL", "AUTOCRIB", "CRIBMASTER"].map(b => <button key={b} aria-pressed={brandFilter === b} onClick={()=>setBrandFilter(b)} className={`px-5 py-2.5 rounded-full border text-sm ${brandFilter === b ? "bg-[var(--copper)] text-[var(--background)] border-[var(--copper)]" : "border-[var(--border)]"}`}>{b === "ALL" ? "All machines" : b === "AUTOCRIB" ? "AutoCrib" : "CribMaster"}</button>)}</div>
    {Object.entries(machineTypes).filter(([brand])=>brandFilter === "ALL" || brandFilter === brand).map(([brand,types])=><section key={brand} className="mb-10"><div className="flex items-center justify-between mb-5"><h2 className="text-2xl font-semibold"><BrandBadge brand={brand}/><span className="block mt-2">{brand === "AUTOCRIB" ? "Red. Black. Ready to dispense." : "Yellow. Black. Under control."}</span></h2><span className="text-sm text-[var(--muted-foreground)]">{stations.filter(s=>s.vendingType===brand).length} stations</span></div><div className="machine-grid">{types.map(type=>{
      const count=stations.filter(s=>s.vendingType===brand && s.name.split(" - ")[0].toLowerCase()===type.toLowerCase()).length;
      return <article key={type} className="machine-tile"><MachineIcon type={type} brand={brand}/><h3>{type}</h3><p>{count ? `${count} in your fleet` : "Machine family"}</p></article>;
    })}</div><p className="text-xs text-[var(--muted-foreground)] mt-4">{brand === "AUTOCRIB" ? "Existing Robo500 / 1000 / 2000 station names are retained. Icons represent hardware families, including legacy equipment." : "Illustrated icons represent hardware families and are not exact product renderings."}</p></section>)}
  </div></ForgeLayout>;
}
