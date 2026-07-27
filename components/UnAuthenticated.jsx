// app/components/UnauthenticatedWithImage.jsx
import Image from 'next/image'
import Link from 'next/link'

export default function UnauthenticatedWithImage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 w-full">
      <div className=" w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Image header */}
        <div className="relative h-48 bg-slate-600">
          <Image 
            src="/auth-banner.jpg" // Add your image to public folder
            alt="Welcome"
            fill
            className="object-cover"
          />
          
        </div>
        
        <div className="p-8 flex flex-col gap-1 text-center bg-slate-100 dark:bg-white ">
          <span className="text-2xl font-bold text-gray-900 mb-4">
            You're Not Authorized
          </span>
          
          <p className="text-gray-600 ">
            Youre not allowed to access this page. 
          </p>
          
          <Link 
            href="/auth/login"
            className="inline-block w-full py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
          >
            Sign In
          </Link>
          
          <Link 
            href="/"
            className="inline-block w-full mt-3 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-slate-700 hover:text-white dark:hover:bg-gray-700 transition font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}