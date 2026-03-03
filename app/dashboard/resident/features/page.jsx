import React from 'react'
import ComingSoon from '@/components/ComingSoon'
import { Bell, History, Settings, TriangleAlert, UserPlus, Wallet, FileText, CreditCard, Receipt, CalendarRange, PartyPopper, FileBadge2, UsersRound, UserCircle, ShieldCheck, HardHat, Megaphone, Siren, Info, Activity, Headset } from 'lucide-react'
import { TechCard } from '@/components/ui/TechCard'
import Link from 'next/link'

const page = () => {

  const accessTabs = [
    { name: 'One Time Visit ', icon: UserPlus, href: '/dashboard/resident/visitors' },
    { name: 'Long Term Visit', icon: CalendarRange, href: '/dashboard/resident/visitors' },
    { name: 'Host Events', icon: PartyPopper, href: '/dashboard/resident/visitors' },
    { name: 'Permits', icon: FileBadge2, href: '/dashboard/resident/permits' },

    { name: 'Guests', icon: UsersRound, href: '/dashboard/resident/history' },
    { name: 'My Profile', icon: UserCircle, href: '/dashboard/resident/profile' },
    { name: 'Staff', icon: ShieldCheck, href: '/dashboard/resident/staff' },
    { name: 'Workers', icon: HardHat, href: '/dashboard/resident/workers' },
  ]
    const paymentTabs = [
    { name: 'Fund wallet', icon: Wallet, href: '/dashboard/resident/finance' },
    { name: 'Dues', icon: FileText, href: '/dashboard/resident/finance' },
    { name: 'Other Payments', icon: CreditCard, href: '/dashboard/resident/finance' },
    { name: 'Invoice', icon: Receipt, href: '/dashboard/resident/invoice' },
 ]
    const communicationTabs = [
      { name: 'Notice Board', icon: Megaphone, href: '/dashboard/resident/notice' },
      { name: 'Emergency', icon: Siren, href: '/dashboard/resident/emergency' },
      { name: 'Information', icon: Info, href: '/dashboard/resident/information' },
      { name: 'Activity', icon: Activity, href: '/dashboard/resident/activity' },
      { name: 'Report Issue', icon: TriangleAlert, href: '/dashboard/resident/report' },
      { name: 'Contact Us', icon: Headset, href: '/dashboard/resident/contact' },
    ]
  return (
    <div className=" ">
          <div className="block md:hidden text-sm p-2 max-w-md mx-auto">
            <div className="text-lg font-bold mb-4">Access </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 md:hidden">
                {accessTabs.map((tab, index) => (
                 <div key={index} className="flex flex-col items-center justify-start w-full">
                  <Link href={tab.href} className="flex flex-col items-center gap-2 w-full group">
                    <TechCard noPadding className="w-[80px] h-[80px] sm:w-[92px] sm:h-[92px] rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col items-center justify-center " hoverEffect={false}>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50/80 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                        <tab.icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </TechCard>
                    <span className="text-xs sm:text-sm font-bold text-gray-500 font-heading text-center leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">{tab.name}</span>
                  </Link>
                  </div>
                ))}
              </div>
          </div>

          <div className="block md:hidden text-sm p-2 max-w-md mx-auto">
            <div className="text-lg font-bold mb-4">Communication</div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 md:hidden">
                {communicationTabs.map((tab, index) => (
                 <div key={index} className="flex flex-col items-center justify-start w-full">
                  <Link href={tab.href} className="flex flex-col items-center gap-2 w-full group">
                    <TechCard noPadding className="w-[80px] h-[80px] sm:w-[92px] sm:h-[92px] rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col items-center justify-center " hoverEffect={false}>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50/80 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                        <tab.icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </TechCard>
                    <span className="text-xs sm:text-sm font-bold text-gray-500 font-heading text-center leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">{tab.name}</span>
                  </Link>
                  </div>
                ))}
              </div>
          </div>

          <div className="block md:hidden text-sm p-2 max-w-md mx-auto">
            <div className="text-lg font-bold mb-4">Payment </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 md:hidden">
                {paymentTabs.map((tab, index) => (
                 <div key={index} className="flex flex-col items-center justify-start w-full">
                  <Link href={tab.href} className="flex flex-col items-center gap-2 w-full group">
                    <TechCard noPadding className="w-[80px] h-[80px] sm:w-[92px] sm:h-[92px] rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col items-center justify-center " hoverEffect={false}>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50/80 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                        <tab.icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </TechCard>
                    <span className="text-xs sm:text-sm font-bold text-gray-500 font-heading text-center leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">{tab.name}</span>
                  </Link>
                  </div>
                ))}
              </div>
          </div>
          
          {/* Desktop View */}
          <div className="hidden md:block text-sm p-4 max-w-7xl mx-auto mt-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-heading">Access </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              {accessTabs.map((tab, index) => (
                <Link href={tab.href} key={index} className="group">
                  <TechCard className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-full flex flex-col justify-center ">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50/80 dark:bg-blue-900/40 rounded-xl flex items-center justify-center shrink-0">
                        <tab.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-300 font-heading group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tab.name}</span>
                    </div>
                  </TechCard>
                </Link>
              ))}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-heading">Communication </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {communicationTabs.map((tab, index) => (
                        <Link href={tab.href} key={index} className="group">
                            <TechCard className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-full flex flex-col justify-center ">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50/80 dark:bg-blue-900/40 rounded-xl flex items-center justify-center shrink-0">
                                        <tab.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-300 font-heading group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tab.name}</span>
                                </div>
                            </TechCard>
                        </Link>
                    ))}
                </div>
            </div>

            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white font-heading">Payment </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              {paymentTabs.map((tab, index) => (
                <Link href={tab.href} key={index} className="group">
                  <TechCard className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-full flex flex-col justify-center ">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50/80 dark:bg-blue-900/40 rounded-xl flex items-center justify-center shrink-0">
                        <tab.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-300 font-heading group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tab.name}</span>
                    </div>
                  </TechCard>
                </Link>
              ))}
            </div>
          </div>

    </div>
  )
}

export default page