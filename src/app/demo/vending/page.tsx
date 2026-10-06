"use client";

import { ForgeLayout } from "@/components/forge-layout";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  timestamp: Date;
  userId?: string;
  jobNumber?: string;
}

interface SelectedItem {
  stationItemId: string;
  partNumber: string;
  description: string;
  currentQoh: number;
  packageQty: number;
}

export default function VendingSimulatorPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [issueQty, setIssueQty] = useState(1);
  const [employeeId, setEmployeeId] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dispensing, setDispensing] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const utils = trpc.useUtils();

  const customersQuery = trpc.customers.list.useQuery();
  const stationsQuery = trpc.demo.getVendingStationsForDemo.useQuery(
    { customerId: selectedCustomerId },
    { enabled: !!selectedCustomerId }
  );

  const issueMutation = trpc.demo.issueItem.useMutation({
    onSuccess: () => {
      utils.demo.getVendingStationsForDemo.invalidate();
      utils.customers.list.invalidate();
      utils.customers.getById.invalidate();
    },
  });

  const customers = customersQuery.data ?? [];
  const stations = stationsQuery.data ?? [];
  const selectedStation = stations.find(
    (s: { id: string }) => s.id === selectedStationId
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stationItems = (selectedStation as any)?.stationItems ?? [];

  function handleRowClick(item: {
    id: string;
    item: { partNumber: string; description: string };
    quantityOnHand: number;
    packageQty: number;
  }) {
    setSelectedItem({
      stationItemId: item.id,
      partNumber: item.item.partNumber,
      description: item.item.description,
      currentQoh: item.quantityOnHand,
      packageQty: item.packageQty,
    });
    setIssueQty(item.packageQty);
    setEmployeeId("");
    setJobNumber("");
    setConfirmationMsg("");
    setDialogOpen(true);
  }

  async function handleDispense() {
    if (!selectedItem) return;
    setDispensing(true);
    setConfirmationMsg("");
    try {
      await issueMutation.mutateAsync({
        stationItemId: selectedItem.stationItemId,
        quantity: issueQty,
        userId: employeeId || undefined,
        jobNumber: jobNumber || undefined,
      });
      const txn: Transaction = {
        id: crypto.randomUUID(),
        partNumber: selectedItem.partNumber,
        description: selectedItem.description,
        quantity: issueQty,
        timestamp: new Date(),
        userId: employeeId || undefined,
        jobNumber: jobNumber || undefined,
      };
      setTransactions((prev) => [txn, ...prev].slice(0, 10));
      setConfirmationMsg(
        `DISPENSED ${issueQty}x ${selectedItem.partNumber}`
      );
    } catch {
      setConfirmationMsg("ERROR: DISPENSE FAILED");
    } finally {
      setDispensing(false);
    }
  }

  function qohColor(qoh: number, min: number): string {
    if (qoh === 0) return "text-red-500";
    if (qoh <= min) return "text-amber-400";
    return "text-emerald-400";
  }

  return (
    <ForgeLayout>
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily:
          "var(--font-outfit), sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3"
        style={{
          backgroundColor: "var(--card)",
          borderBottom: "2px solid #2196F3",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="text-xl font-bold tracking-widest"
            style={{ color: "var(--copper)" }}
          >
            VENDING SYSTEM DEMO
          </div>
          <div
            className="text-xs tracking-wide"
            style={{ color: "var(--muted-foreground)" }}
          >
            AUTOCRIB / CRIBMASTER SIMULATOR
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: "#3fb950" }}
          />
          <span
            className="text-xs font-bold tracking-widest"
            style={{ color: "#3fb950" }}
          >
            ONLINE
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-6">
        {/* Selectors */}
        <div
          className="mb-6 flex flex-wrap gap-4 rounded p-4"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid #30363d",
          }}
        >
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-bold tracking-widest"
              style={{ color: "var(--muted-foreground)" }}
            >
              CUSTOMER
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setSelectedStationId("");
              }}
              className="h-9 rounded px-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid #30363d",
                color: "var(--foreground)",
                minWidth: "260px",
              }}
            >
              <option value="">-- SELECT CUSTOMER --</option>
              {customers.map((c: { id: string; name: string }) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-bold tracking-widest"
              style={{ color: "var(--muted-foreground)" }}
            >
              STATION
            </label>
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
              disabled={!selectedCustomerId}
              className="h-9 rounded px-3 text-sm outline-none disabled:opacity-50"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid #30363d",
                color: "var(--foreground)",
                minWidth: "260px",
              }}
            >
              <option value="">-- SELECT STATION --</option>
              {stations.map((s: { id: string; name: string }) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Table */}
        {selectedStationId && (
          <div
            className="mb-6 overflow-hidden rounded"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid #30363d",
            }}
          >
            <div
              className="px-4 py-2 text-xs font-bold tracking-widest"
              style={{
                backgroundColor: "#1c2128",
                borderBottom: "1px solid #30363d",
                color: "var(--muted-foreground)",
              }}
            >
              STATION INVENTORY
            </div>
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="sticky top-0 z-10 text-left text-xs font-bold tracking-wider"
                    style={{
                      backgroundColor: "#1c2128",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    <th
                      className="px-4 py-2"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      PART NUMBER
                    </th>
                    <th
                      className="px-4 py-2"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      DESCRIPTION
                    </th>
                    <th
                      className="px-4 py-2 text-right"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      QOH
                    </th>
                    <th
                      className="px-4 py-2 text-right"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      MIN
                    </th>
                    <th
                      className="px-4 py-2 text-right"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      MAX
                    </th>
                    <th
                      className="px-4 py-2 text-right"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      PKG QTY
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stationItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        NO ITEMS IN STATION
                      </td>
                    </tr>
                  ) : (
                    stationItems.map(
                      (si: {
                        id: string;
                        item: {
                          partNumber: string;
                          description: string;
                        };
                        quantityOnHand: number;
                        currentMin: number;
                        currentMax: number;
                        packageQty: number;
                      }) => (
                        <tr
                          key={si.id}
                          onClick={() => handleRowClick(si)}
                          className="cursor-pointer transition-colors"
                          style={{ borderBottom: "1px solid #21262d" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "#1c2128")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <td
                            className="px-4 py-2 font-bold"
                            style={{ color: "var(--copper)" }}
                          >
                            {si.item.partNumber}
                          </td>
                          <td className="px-4 py-2">
                            {si.item.description}
                          </td>
                          <td
                            className={`px-4 py-2 text-right font-bold ${qohColor(si.quantityOnHand, si.currentMin)}`}
                          >
                            {si.quantityOnHand}
                          </td>
                          <td
                            className="px-4 py-2 text-right"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {si.currentMin}
                          </td>
                          <td
                            className="px-4 py-2 text-right"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {si.currentMax}
                          </td>
                          <td
                            className="px-4 py-2 text-right"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {si.packageQty}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <div
            className="overflow-hidden rounded"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid #30363d",
            }}
          >
            <div
              className="px-4 py-2 text-xs font-bold tracking-widest"
              style={{
                backgroundColor: "#1c2128",
                borderBottom: "1px solid #30363d",
                color: "var(--muted-foreground)",
              }}
            >
              RECENT TRANSACTIONS
            </div>
            <div className="max-h-[200px] overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="sticky top-0 text-left text-xs font-bold tracking-wider"
                    style={{
                      backgroundColor: "#1c2128",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    <th
                      className="px-4 py-2"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      TIME
                    </th>
                    <th
                      className="px-4 py-2"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      PART NUMBER
                    </th>
                    <th
                      className="px-4 py-2"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      DESCRIPTION
                    </th>
                    <th
                      className="px-4 py-2 text-right"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      QTY
                    </th>
                    <th
                      className="px-4 py-2"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      EMP ID
                    </th>
                    <th
                      className="px-4 py-2"
                      style={{ borderBottom: "1px solid #30363d" }}
                    >
                      JOB #
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      style={{ borderBottom: "1px solid #21262d" }}
                    >
                      <td
                        className="px-4 py-1.5"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {txn.timestamp.toLocaleTimeString()}
                      </td>
                      <td
                        className="px-4 py-1.5 font-bold"
                        style={{ color: "var(--copper)" }}
                      >
                        {txn.partNumber}
                      </td>
                      <td className="px-4 py-1.5">{txn.description}</td>
                      <td className="px-4 py-1.5 text-right font-bold">
                        {txn.quantity}
                      </td>
                      <td
                        className="px-4 py-1.5"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {txn.userId || "-"}
                      </td>
                      <td
                        className="px-4 py-1.5"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {txn.jobNumber || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!selectedCustomerId && (
          <div
            className="mt-12 text-center text-sm tracking-wide"
            style={{ color: "#484f58" }}
          >
            SELECT A CUSTOMER AND STATION TO BEGIN
          </div>
        )}
        {selectedCustomerId && !selectedStationId && (
          <div
            className="mt-12 text-center text-sm tracking-wide"
            style={{ color: "#484f58" }}
          >
            SELECT A STATION TO VIEW INVENTORY
          </div>
        )}
      </div>

      {/* Issue Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid #30363d",
            color: "var(--foreground)",
            fontFamily:
              "var(--font-outfit), sans-serif",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-base font-bold tracking-widest"
              style={{ color: "var(--copper)" }}
            >
              ISSUE ITEM
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="flex flex-col gap-4">
              <div
                className="rounded p-3"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid #30363d",
                }}
              >
                <div
                  className="text-xs tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  PART NUMBER
                </div>
                <div
                  className="text-lg font-bold"
                  style={{ color: "var(--copper)" }}
                >
                  {selectedItem.partNumber}
                </div>
                <div className="mt-1 text-sm" style={{ color: "var(--foreground)" }}>
                  {selectedItem.description}
                </div>
                <div
                  className="mt-2 text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  CURRENT QOH:{" "}
                  <span className="font-bold" style={{ color: "var(--foreground)" }}>
                    {selectedItem.currentQoh}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold tracking-widest"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    QUANTITY{" "}
                    <span style={{ color: "#484f58" }}>
                      (MULTIPLES OF {selectedItem.packageQty})
                    </span>
                  </label>
                  <input
                    type="number"
                    min={selectedItem.packageQty}
                    max={selectedItem.currentQoh}
                    step={selectedItem.packageQty}
                    value={issueQty}
                    onChange={(e) =>
                      setIssueQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="h-9 rounded px-3 text-sm outline-none"
                    style={{
                      backgroundColor: "var(--background)",
                      border: `1px solid ${issueQty % selectedItem.packageQty !== 0 ? "#f85149" : "var(--border)"}`,
                      color: "var(--foreground)",
                    }}
                  />
                  {issueQty % selectedItem.packageQty !== 0 && (
                    <div
                      className="text-xs font-bold"
                      style={{ color: "#f85149" }}
                    >
                      QTY MUST BE A MULTIPLE OF {selectedItem.packageQty}
                    </div>
                  )}
                  {issueQty > selectedItem.currentQoh && (
                    <div
                      className="text-xs font-bold"
                      style={{ color: "#f85149" }}
                    >
                      EXCEEDS QUANTITY ON HAND ({selectedItem.currentQoh})
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold tracking-widest"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    EMPLOYEE ID{" "}
                    <span style={{ color: "#484f58" }}>(OPTIONAL)</span>
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="E.G. EMP-1234"
                    className="h-9 rounded px-3 text-sm outline-none placeholder:opacity-30"
                    style={{
                      backgroundColor: "var(--background)",
                      border: "1px solid #30363d",
                      color: "var(--foreground)",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-bold tracking-widest"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    JOB NUMBER{" "}
                    <span style={{ color: "#484f58" }}>(OPTIONAL)</span>
                  </label>
                  <input
                    type="text"
                    value={jobNumber}
                    onChange={(e) => setJobNumber(e.target.value)}
                    placeholder="E.G. JOB-5678"
                    className="h-9 rounded px-3 text-sm outline-none placeholder:opacity-30"
                    style={{
                      backgroundColor: "var(--background)",
                      border: "1px solid #30363d",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>

              {confirmationMsg && (
                <div
                  className="rounded px-3 py-2 text-center text-sm font-bold tracking-wide"
                  style={{
                    backgroundColor: confirmationMsg.startsWith("ERROR")
                      ? "#3d1117"
                      : "#0d2818",
                    border: `1px solid ${confirmationMsg.startsWith("ERROR") ? "#f85149" : "#3fb950"}`,
                    color: confirmationMsg.startsWith("ERROR")
                      ? "#f85149"
                      : "#3fb950",
                  }}
                >
                  {confirmationMsg}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="tracking-widest"
              style={{
                color: "var(--muted-foreground)",
                border: "1px solid #30363d",
              }}
            >
              CANCEL
            </Button>
            <button
              onClick={handleDispense}
              disabled={dispensing || !selectedItem || (selectedItem != null && (issueQty % selectedItem.packageQty !== 0 || issueQty > selectedItem.currentQoh || issueQty <= 0))}
              className="h-10 rounded px-6 text-sm font-bold tracking-widest text-white transition-colors disabled:opacity-50"
              style={{
                backgroundColor: dispensing ? "#1a3a5c" : "var(--copper)",
                border: "2px solid #2196F3",
              }}
              onMouseEnter={(e) => {
                if (!dispensing)
                  e.currentTarget.style.backgroundColor = "var(--copper-dark)";
              }}
              onMouseLeave={(e) => {
                if (!dispensing)
                  e.currentTarget.style.backgroundColor = "var(--copper)";
              }}
            >
              {dispensing ? "DISPENSING..." : "DISPENSE"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </ForgeLayout>
  );
}
