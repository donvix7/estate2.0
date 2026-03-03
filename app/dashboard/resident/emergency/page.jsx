import React from 'react'
import Link from 'next/link'
import { Stethoscope, ShieldAlert, Flame, TriangleAlert } from 'lucide-react'

const page = () => {
  const cases = [
    {label: 'Medical Emergency', icon: Stethoscope, description: 'Request an ambulance or local medic.', color: 'red'},
    {label: 'Security Alert', icon: ShieldAlert, description: 'Report a security breach or suspicious activity.', color: 'blue'},
    {label: 'Fire', icon: Flame, description: 'Report a fire outbreak immediately.', color: 'orange'},
    {label: 'Other', icon: TriangleAlert, description: 'General emergency not listed above.', color: 'gray'},
  ]

  const getColorClasses = (color) => {
    switch (color) {
      case 'red': return { bg: 'bg-red-50 dark:bg-red-500/10', icon: 'text-red-600 dark:text-red-500', btn: 'bg-red-600 hover:bg-red-700 text-white' }
      case 'blue': return { bg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'text-blue-600 dark:text-blue-500', btn: 'bg-blue-600 hover:bg-blue-700 text-white' }
      case 'orange': return { bg: 'bg-orange-50 dark:bg-orange-500/10', icon: 'text-orange-600 dark:text-orange-500', btn: 'bg-orange-600 hover:bg-orange-700 text-white' }
      default: return { bg: 'bg-gray-100 dark:bg-gray-800', icon: 'text-gray-600 dark:text-gray-400', btn: 'bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white' }
    }
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((item, index) => {
          const colors = getColorClasses(item.color);
          const IconComponent = item.icon;

          return (
            <Link key={index} href={`/dashboard/resident/emergency/${item.label.toLowerCase().replace(' ', '-')}`}>
              <div className={`bg-gray-800 dark:bg-gray-800/80 rounded-2xl shadow-sm p-5`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`rounded-2xl p-3 shrink-0 ${colors.bg}`}>
                      <IconComponent className={`w-6 h-6  ${colors.icon}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white font-heading">{item.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-snug mt-0.5">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default page
