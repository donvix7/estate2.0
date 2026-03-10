'use client'

import React from 'react'
import { WalletCard } from '@/components/resident/WalletCard'
import PaystackPayment from '@/components/payment'
import Link from 'next/link'

// Outstanding bills — shared with the bills overview page
export const OUTSTANDING_BILLS = [
  { description: 'Monthly Service Charge', subtitle: 'Residential Unit - Block A', period: 'Oct 2024', amount: 45000 },
  { description: 'Security & Patrol Fee', subtitle: 'Quarterly Contribution', period: 'Q4 2024', amount: 12000 },
  { description: 'Utility Surcharge', subtitle: 'Common Area Lighting', period: 'Oct 2024', amount: 3500 },
]
const TOTAL = OUTSTANDING_BILLS.reduce((sum, b) => sum + b.amount, 0)

const formatNGN = (n) => `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111621] font-sans">

      {/* ── Breadcrumbs & Title ── */}
      <div className="px-6 lg:px-10 pt-8 pb-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <Link href="/dashboard/resident" className="hover:text-[#1241a1] transition-colors">Dashboard</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/dashboard/resident/finance" className="hover:text-[#1241a1] transition-colors">Bills &amp; Invoices</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#1241a1] font-semibold">Checkout</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">Complete Your Payment</h1>
        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-green-500 text-base">lock</span>
          Encrypted and secure transaction. Your data is protected.
        </p>
      </div>

      <div className="px-6 lg:px-10 pb-16 max-w-7xl mx-auto space-y-8">

        {/* Wallet Card at top */}
        <WalletCard />

        {/* ── Main Checkout Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Order Summary */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <h3 className="font-bold text-lg">1. Order Summary</h3>
                <span className="text-xs font-bold px-2.5 py-1 bg-[#1241a1]/10 text-[#1241a1] rounded-lg uppercase tracking-wider">
                  Outstanding Bills
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Period</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0">
                    {OUTSTANDING_BILLS.map((bill, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-sm">{bill.description}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{bill.subtitle}</p>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500">{bill.period}</td>
                        <td className="px-6 py-5 text-right font-semibold text-sm">{formatNGN(bill.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 dark:bg-slate-800/30">
                      <td className="px-6 py-4 text-right text-sm font-medium text-slate-500" colSpan={2}>Subtotal</td>
                      <td className="px-6 py-4 text-right font-semibold text-sm">{formatNGN(TOTAL)}</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30">
                      <td className="px-6 py-6 text-right font-bold text-lg" colSpan={2}>Total Due</td>
                      <td className="px-6 py-6 text-right font-black text-2xl text-[#1241a1]">{formatNGN(TOTAL)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start px-1">
              {[
                { icon: 'verified_user', label: 'SSL Secure Checkout' },
                { icon: 'shield', label: 'PCI-DSS Compliant' },
                { icon: 'credit_score', label: 'Fraud Protection' },
              ].map((badge, i, arr) => (
                <React.Fragment key={badge.label}>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <span className="material-symbols-outlined text-lg">{badge.icon}</span>
                    <span>{badge.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className="h-4 w-px hidden sm:block" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RIGHT: Payment Method */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6">2. Payment Method</h3>
            <PaystackPayment />
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 lg:px-10 py-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2024 EstatePay Secure Management. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-[#1241a1] text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-[#1241a1] text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-[#1241a1] text-sm transition-colors">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
