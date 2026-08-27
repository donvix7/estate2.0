// app/components/UnauthenticatedWithImage.jsx
import Image from 'next/image'
import Link from 'next/link'

export default function UnauthenticatedWithImage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 from-gray-900 to-gray-800 p-4 w-full">
      <div className=" w-full max-w-2xl bg-[#1a1d23] rounded-2xl shadow-xl overflow-hidden">
        {/* Image header */}
        <div className="relative h-48 bg-[#1a1d23]">
          <Image 
            src="/auth-banner.jpg" // Add your image to public folder
            alt="Welcome"
            fill
            className="object-cover"
          />
          
        </div>
        
        <div className="p-8 flex flex-col gap-1 text-center bg-[#1a1d23] bg-white ">
          <span className="text-3xl font-bold text-white mb-4">
            Not Authorized
          </span>
          
          <p className="text-[#8a8f98] ">
            You&apos;re not allowed to access this page. To access this page, please login with the correct credentials. use the button below to navigate to the login page. 
          </p>
          
          <Link 
            href="/auth/login"
            className="inline-block w-fit py-3 px-12 my-3 mx-auto bg-[#1a1d23] text-white rounded-lg  transition font-medium"
          >
            Sign In
          </Link>
          
          <Link 
            href="/"
            className=" text-black "
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}