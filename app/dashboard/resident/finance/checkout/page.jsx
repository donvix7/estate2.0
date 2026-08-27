'use client'

import React from 'react'
import { WalletCard } from '@/components/resident/WalletCard'
import PaystackPayment from '@/components/payment'
import { ShieldCheck, ShieldAlert, CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'

// Outstanding bills — shared with the bills overview page
export const OUTSTANDING_BILLS = [
  { description: 'Monthly Service Charge', subtitle: 'Residential Unit - Block A', period: 'Oct 2024', amount: 45.00 },
  { description: 'Security & Patrol Fee', subtitle: 'Quarterly Contribution', period: 'Q4 2024', amount: 12.00 },
  { description: 'Utility Surcharge', subtitle: 'Common Area Lighting', period: 'Oct 2024', amount: 3.50 },
]
const TOTAL = OUTSTANDING_BILLS.reduce((sum, b) => sum + b.amount, 0)

const formatUSD = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-700">

      {/* ── Page Header ── */}
      <PageHeader
        title="Complete Your Payment"
        description="Encrypted and secure transaction. Your data is protected."
        icon={CreditCard}
        iconColor="blue"
      />

      <div className="space-y-8">

        {/* Wallet Card at top */}
        <WalletCard />

        {/* ── Main Checkout Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Order Summary */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle title="1. Order Summary" />
                <span className="text-xs font-bold px-2.5 py-1 bg-[#1241a1]/10 text-[#1241a1] rounded-lg uppercase tracking-wider">
                  Outstanding Bills
                </span>
              </CardHeader>
              <CardBody padded={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase text-[#8a8f98] text-[#8a8f98] font-bold tracking-wider">
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Period</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-0">
                    {OUTSTANDING_BILLS.map((bill, i) => (
                      <tr key={i} className="hover:bg-[#1a1d23]/50 hover:bg-[#1a1d23]/30 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-sm">{bill.description}</p>
                          <p className="text-xs text-[#8a8f98] mt-0.5">{bill.subtitle}</p>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#8a8f98]">{bill.period}</td>
                        <td className="px-6 py-5 text-right font-semibold text-sm">{formatUSD(bill.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#1a1d23] bg-[#1a1d23]/30">
                      <td className="px-6 py-4 text-right text-sm font-medium text-[#8a8f98]" colSpan={2}>Subtotal</td>
                      <td className="px-6 py-4 text-right font-semibold text-sm">{formatUSD(TOTAL)}</td>
                    </tr>
                    <tr className="bg-[#1a1d23] bg-[#1a1d23]/30">
                      <td className="px-6 py-6 text-right font-bold text-lg" colSpan={2}>Total Due</td>
                      <td className="px-6 py-6 text-right font-black text-2xl text-[#1241a1]">{formatUSD(TOTAL)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              </CardBody>
            </Card>

            {/* Security Badges */}
            <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start px-1">
              {[
                { icon: ShieldCheck, label: 'SSL Secure Checkout' },
                { icon: ShieldAlert, label: 'PCI-DSS Compliant' },
                { icon: CreditCard, label: 'Fraud Protection' },
              ].map((badge, i, arr) => (
                <React.Fragment key={badge.label}>
                  <div className="flex items-center gap-2 text-[#8a8f98] text-sm">
                    <badge.icon className="size-5" />
                    <span>{badge.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className="h-4 w-px hidden sm:block" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RIGHT: Payment Method */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle title="2. Payment Method" />
              </CardHeader>
              <CardBody>
                <PaystackPayment />
              </CardBody>
            </Card>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 lg:px-10 py-8 bg-[#1a1d23]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8a8f98] text-sm">© 2024 EstatePay Secure Management. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-[#8a8f98] hover:text-[#1241a1] text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#8a8f98] hover:text-[#1241a1] text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-[#8a8f98] hover:text-[#1241a1] text-sm transition-colors">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
