import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-6">
              <div className="w-12 h-12 bg-gray-800 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
                ES
              </div>
              <h3 className="text-xl font-bold mb-2">EstateSecure</h3>
              <p className="text-gray-400">Security Management Platform</p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm">
                Access Control
              </span>
              <span className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm">
                Emergency Response
              </span>
              <span className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm">
                Digital Payments
              </span>
              <span className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm">
                Surveillance
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
              <a href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </a>
              <a href="/#features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
              <a href="/docs" className="text-gray-400 hover:text-white transition-colors">
                Docs
              </a>
            </div>

            {/* Contact */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm">
                support@estatesecure.com | +1 (800) 123-4567
              </p>
            </div>

            {/* Legal */}
            <div className="pt-6 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                  © {currentYear} EstateSecure. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy
                  </a>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms
                  </a>
                  <a href="/security" className="text-gray-400 hover:text-white transition-colors">
                    Security
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer