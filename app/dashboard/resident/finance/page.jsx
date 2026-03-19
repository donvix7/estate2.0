'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WalletCard } from '@/components/resident/WalletCard'

const ACTIVE_BILLS = [
  {
    id: 'water',
    name: 'Water Bill',
    icon: 'water_drop',
    iconColor: 'text-blue-500',
    gradientFrom: 'from-blue-500/20',
    amount: 4500,
    due: 'Due Oct 15',
    dueClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    id: 'electricity',
    name: 'Electricity Bill',
    icon: 'bolt',
    iconColor: 'text-yellow-500',
    gradientFrom: 'from-yellow-500/20',
    amount: 12500,
    due: 'Due Oct 12',
    dueClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    id: 'service',
    name: 'Service Fee',
    icon: 'apartment',
    iconColor: 'text-[#1241a1]',
    gradientFrom: 'from-[#1241a1]/20',
    amount: 45000,
    due: 'Overdue',
    dueClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
]

const RECENT_TRANSACTIONS = [
  { date: 'Oct 01, 2024', description: 'Water Bill — Payment #TRX982', amount: '₦4,250.00', status: 'Completed', statusClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { date: 'Sep 28, 2024', description: 'Electricity Bill — Payment #TRX961', amount: '₦12,800.00', status: 'Completed', statusClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { date: 'Sep 01, 2024', description: 'Service Fee — Monthly #SRV-SEP', amount: '₦45,000.00', status: 'Completed', statusClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { date: 'Aug 20, 2024', description: 'Late Fee Adjustment', amount: '−₦1,500.00', amountClass: 'text-rose-600', status: 'Reversed', statusClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
]

const TOTAL_OUTSTANDING = ACTIVE_BILLS.reduce((s, b) => s + b.amount, 0)
const formatNGN = (n) => `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

export default function FinancePage() {
  const [selectedTx, setSelectedTx] = useState(null)

  const handleDownloadReport = () => {
    const headers = "Date,Description,Amount,Status\n"
    const csvContent = RECENT_TRANSACTIONS.map(tx => `${tx.date},${tx.description},${tx.amount},${tx.status}`).join("\n")
    const blob = new Blob([headers + csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `finance_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleDownloadReceipt = (tx) => {
    const content = `RECEIPT\n-------\nDate: ${tx.date}\nDescription: ${tx.description}\nAmount: ${tx.amount}\nStatus: ${tx.status}\n\nThank you for your payment.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt_${tx.date.replace(/ /g, '_')}.txt`
    link.click()
  }
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111621]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 space-y-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
              <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-[#1241a1] font-semibold">Bills &amp; Invoices</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">Bills &amp; Invoices</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage your property payments and view transaction history.</p>
          </div>

          {/* Outstanding summary + Pay All */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl flex items-center justify-between gap-8 shadow-sm min-w-[300px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Total Outstanding</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{formatNGN(TOTAL_OUTSTANDING)}</p>
            </div>
            <Link
              href="/dashboard/resident/finance/checkout"
              className="bg-[#1241a1] hover:bg-[#1241a1]/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#1241a1]/20 whitespace-nowrap"
            >
              Pay All
            </Link>
          </div>
        </div>

        {/* Wallet Card */}
        <WalletCard />

        {/* ── Active Bills ── */}
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1241a1]">pending_actions</span>
            Active Bills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACTIVE_BILLS.map(bill => (
              <div
                key={bill.id}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden hover:shadow-md transition-all group"
              >
                {/* Bill image / icon area */}
                <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${bill.gradientFrom} to-transparent`} />
                  <span className={`material-symbols-outlined text-4xl relative z-10 ${bill.iconColor}`} style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
                    {bill.icon}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-base">{bill.name}</h4>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${bill.dueClass}`}>{bill.due}</span>
                  </div>
                  <p className="text-2xl font-black mb-4">{formatNGN(bill.amount)}</p>
                  <Link
                    href="/dashboard/resident/finance/checkout"
                    className="block w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#1241a1] hover:text-white dark:hover:bg-[#1241a1] font-bold text-sm transition-all"
                  >
                    Pay Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Transactions ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500">history</span>
              Recent Transactions
            </h3>
            <button 
              onClick={handleDownloadReport}
              className="text-sm font-semibold text-[#1241a1] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Download PDF Report
            </button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
            {/* Desktop Table */}
            <table className="w-full text-left hidden md:table">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  {['Date', 'Description', 'Amount', 'Status', 'Receipt'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-0">
                {RECENT_TRANSACTIONS.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{tx.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{tx.description}</td>
                    <td className={`px-6 py-4 text-sm font-bold ${tx.amountClass || ''}`}>{tx.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${tx.statusClass}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedTx(tx)}
                        className="text-slate-400 hover:text-[#1241a1] transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card List */}
            <div className="md:hidden flex flex-col gap-4">
              {RECENT_TRANSACTIONS.map((tx, i) => (
                <div key={i} className="p-4 flex flex-col gap-3 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tx.date}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{tx.description}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.statusClass}`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-black ${tx.amountClass || 'text-slate-900 dark:text-white'}`}>{tx.amount}</span>
                    <button 
                      onClick={() => setSelectedTx(tx)}
                      className="flex items-center gap-2 text-[#1241a1] font-bold text-xs bg-[#1241a1]/5 px-3 py-1.5 rounded-lg"
                    >
                      <span className="material-symbols-outlined text-sm">receipt</span>
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="size-16 rounded-2xl bg-[#1241a1]/5 flex items-center justify-center text-[#1241a1] shadow-lg">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Transaction Receipt</h3>
                <p className="text-sm text-slate-500">{selectedTx.description}</p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-bold">{selectedTx.date}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-emerald-600">{selectedTx.status}</p>
                </div>
                <div className="bg-[#1241a1]/5 p-4 rounded-2xl text-left col-span-2">
                  <p className="text-[10px] font-bold text-[#1241a1] uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-black text-[#1241a1]">{selectedTx.amount}</p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3 mt-4">
                <button 
                  onClick={() => handleDownloadReceipt(selectedTx)}
                  className="w-full bg-[#1241a1] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#1241a1]/20 active:scale-[0.98] transition-all"
                >
                  Download Receipt
                </button>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="w-full font-bold text-slate-400 py-2 hover:text-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
