'use client'

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { TechCard } from '@/components/ui/TechCard';
import { CleanTable } from '@/components/ui/CleanTable';
import { Key, Clock, ShieldCheck, Phone, MapPin, User, Calendar, Plus, ExternalLink, QrCode } from 'lucide-react';

// Hardcoded database simulation
const HARDCODED_DATA = {
  passHistory: [],
  entryExitLogs: [],
  blacklist: []
}

// Mock API functions
const mockAPI = {
  // Get pass history
  async getPassHistory() {
    try {
      // Try to fetch from placeholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const data = await response.json();
      
      // Transform to our format
      return data.map((post, index) => ({
        id: post.id,
        visitorName: `Visitor ${post.id}`,
        phone: `98765${post.id.toString().padStart(5, '0')}`,
        purpose: ['Personal', 'Delivery', 'Service'][index % 3],
        residentName: 'John Doe',
        unitNumber: `A-${101 + index}`,
        passCode: `PASS${post.id.toString().padStart(3, '0')}`,
        pin: Math.floor(1000 + Math.random() * 9000).toString(),
        timestamp: new Date(Date.now() - (index * 86400000)).toISOString(),
        status: ['pending', 'active', 'completed'][index % 3]
      }));
    } catch (error) {
      console.log('Using hardcoded pass history');
      return HARDCODED_DATA.passHistory;
    }
  },

  // Get entry/exit logs
  async getEntryExitLogs() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=3');
      const data = await response.json();
      
      return data.map((comment, index) => ({
        id: comment.id,
        visitor: `Visitor ${comment.id}`,
        type: index % 2 === 0 ? 'entry' : 'exit',
        passCode: `PASS${comment.id.toString().padStart(3, '0')}`,
        timestamp: new Date(Date.now() - (index * 3600000)).toISOString(),
        verifiedBy: index % 2 === 0 ? 'System' : 'Security'
      }));
    } catch (error) {
      console.log('Using hardcoded entry/exit logs');
      return HARDCODED_DATA.entryExitLogs;
    }
  },

  // Save pass to history
  async savePassToHistory(passData) {
    HARDCODED_DATA.passHistory.unshift(passData);
    return { success: true, id: passData.id };
  },

  // Add to blacklist
  async addToBlacklist(visitor) {
    HARDCODED_DATA.blacklist.push(visitor);
    return { success: true };
  },

  // Remove from blacklist
  async removeFromBlacklist(index) {
    HARDCODED_DATA.blacklist.splice(index, 1);
    return { success: true };
  },

  // Log entry/exit
  async logEntryExit(log) {
    HARDCODED_DATA.entryExitLogs.unshift(log);
    return { success: true, id: log.id };
  },

  async getBlacklist() {
    HARDCODED_DATA.blacklist;
    return { success: true };
  },
};

export function VisitorPassGenerator() {
  // Form state
  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    purpose: 'Personal',
    vehicleNumber: '',
    expectedArrival: '',
    expectedDeparture: '',
    residentName: 'John Doe',
    unitNumber: 'A-101'
  })

  // Generated pass state
  const [generatedPass, setGeneratedPass] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCodeData, setQrCodeData] = useState('')
  const [passHistory, setPassHistory] = useState([])
  const [blacklistedVisitors, setBlacklistedVisitors] = useState([])
  const [entryExitLogs, setEntryExitLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active') // 'active', 'history', 'logs', 'blacklist'

  // Timer state for pass expiry
  const [timeLeft, setTimeLeft] = useState(null)
  const timerRef = useRef(null)

  // Initialize component
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [history, blacklist, logs] = await Promise.all([
          mockAPI.getPassHistory(),
          mockAPI.getBlacklist(),
          mockAPI.getEntryExitLogs()
        ])
        
        setPassHistory(history)
        setBlacklistedVisitors(blacklist)
        setEntryExitLogs(logs)
      } catch (error) {
        console.error('Error loading data:', error)
        setBlacklistedVisitors(HARDCODED_DATA.blacklist)
      } finally {
        setIsLoading(false)
      }
    }

    // Set default times
    const now = new Date()
    const arrival = new Date(now.getTime() + 30 * 60000)
    const departure = new Date(arrival.getTime() + 2 * 60 * 60000)

    setFormData(prev => ({
      ...prev,
      expectedArrival: arrival.toISOString().slice(0, 16),
      expectedDeparture: departure.toISOString().slice(0, 16)
    }))

    loadData()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))


  }

  

  // Generate QR code data URL
  const generateQRCode = (passData) => {
    const qrData = JSON.stringify({
      passId: passData.id,
      visitor: passData.visitorName,
      resident: passData.residentName,
      unit: passData.unitNumber,
      purpose: passData.purpose,
      passCode: passData.passCode,
      generated: passData.timestamp
    })

    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
  }

  // Generate visitor pass
  const generatePass = async () => {
    if (!formData.visitorName || !formData.phone) {
      alert('Please fill in visitor name and phone number')
      return
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(async () => {
      try {
        const passCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        const pin = Math.floor(1000 + Math.random() * 9000).toString()
        const timestamp = new Date().toISOString()
        const id = Date.now().toString()

        const passData = {
          id,
          ...formData,
          passCode,
          pin,
          timestamp,
          status: 'pending',
          securityVerified: false
        }

        const qrCodeUrl = generateQRCode(passData)
        
        setGeneratedPass(passData)
        setQrCodeData(qrCodeUrl)

        // Save to history via API
        await mockAPI.savePassToHistory(passData)

        // Update local state
        const newHistory = [passData, ...passHistory.slice(0, 9)]
        setPassHistory(newHistory)

        // Log entry
        const logEntry = {
          id: Date.now(),
          type: 'entry',
          visitor: passData.visitorName,
          passCode: passData.passCode,
          timestamp: new Date().toISOString(),
          verifiedBy: 'System'
        }
        await mockAPI.logEntryExit(logEntry)

        // Update logs state
        setEntryExitLogs(prev => [logEntry, ...prev.slice(0, 9)])

        // Start expiry timer
        const expiryTime = new Date(formData.expectedDeparture).getTime() - Date.now()
        if (expiryTime > 0) {
          setTimeLeft(Math.floor(expiryTime / 1000))
          
          timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(timerRef.current)
                alert(`Pass for ${formData.visitorName} has expired!`)
                return null
              }
              return prev - 1
            })
          }, 1000)
        }

        alert(`✅ Visitor pass generated!\nPass Code: ${passCode}\nPIN: ${pin}`)
      } catch (error) {
        console.error('Error generating pass:', error)
        alert('Failed to generate pass. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    }, 1500)
  }

  // Verify visitor entry
  const verifyEntry = async () => {
    if (!generatedPass) return

    const enteredPin = prompt('Security: Enter visitor PIN for verification:')
    if (enteredPin === generatedPass.pin) {
      setGeneratedPass(prev => ({ ...prev, securityVerified: true, status: 'active' }))
      alert('✅ Visitor verified and allowed entry!')
      
      // Log entry
      const logEntry = {
        id: Date.now(),
        type: 'entry',
        visitor: generatedPass.visitorName,
        passCode: generatedPass.passCode,
        timestamp: new Date().toISOString(),
        verifiedBy: 'Security'
      }
      await mockAPI.logEntryExit(logEntry)
      setEntryExitLogs(prev => [logEntry, ...prev.slice(0, 9)])
    } else {
      alert('❌ Invalid PIN. Access denied.')
    }
  }

  // Mark visitor exit
  const markExit = async () => {
    if (!generatedPass) return
    
    setGeneratedPass(prev => ({ ...prev, status: 'completed' }))
    alert(`Visitor ${generatedPass.visitorName} has checked out.`)
    
    // Log exit
    const logExit = {
      id: Date.now(),
      type: 'exit',
      visitor: generatedPass.visitorName,
      passCode: generatedPass.passCode,
      timestamp: new Date().toISOString(),
      verifiedBy: 'Security'
    }
    await mockAPI.logEntryExit(logExit)
    setEntryExitLogs(prev => [logExit, ...prev.slice(0, 9)])
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setTimeLeft(null)
    }
  }

  // Add to blacklist
  const addToBlacklist = async () => {
    if (!formData.visitorName) {
      alert('Please enter visitor name first')
      return
    }

    const reason = prompt('Enter reason for blacklisting:')
    if (reason) {
      const visitor = {
        name: formData.visitorName,
        phone: formData.phone,
        reason,
        added: new Date().toISOString()
      }
      
      await mockAPI.addToBlacklist(visitor)
      setBlacklistedVisitors(prev => [...prev, visitor])
      alert('✅ Visitor added to blacklist')
    }
  }

  // Remove from blacklist
  const removeFromBlacklist = async (index) => {
    await mockAPI.removeFromBlacklist(index)
    setBlacklistedVisitors(prev => prev.filter((_, i) => i !== index))
  }

  // Share pass
  const sharePass = () => {
    if (!generatedPass) return

    const message = `Visitor Pass for ${generatedPass.visitorName}:
Pass Code: ${generatedPass.passCode}
PIN: ${generatedPass.pin}
Resident: ${generatedPass.residentName} (${generatedPass.unitNumber})
Purpose: ${generatedPass.purpose}
Valid until: ${new Date(generatedPass.expectedDeparture).toLocaleString()}`

    if (navigator.share) {
      navigator.share({
        title: 'Visitor Pass',
        text: message,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(message)
      alert('Pass details copied to clipboard!')
    }
  }

  // Format time
  const formatTime = (seconds) => {
    if (!seconds) return null
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Load from history
  const loadFromHistory = (pass) => {
    setFormData({
      visitorName: pass.visitorName,
      phone: pass.phone,
      purpose: pass.purpose,
      vehicleNumber: pass.vehicleNumber || '',
      expectedArrival: pass.expectedArrival || '',
      expectedDeparture: pass.expectedDeparture || '',
      residentName: pass.residentName,
      unitNumber: pass.unitNumber
    })
    alert(`Loaded ${pass.visitorName}'s details from history`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 border-4  -muted border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Loading Visitor Pass Generator...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading tracking-tight flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Key className="w-6 h-6" /></div>
            Visitor Pass Management
          </h2>
          <p className="text-gray-500 mt-1">Generate secure QR codes and Entry PINs for expected visitors</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'active', label: 'Generator' },
            { id: 'history', label: 'Recent Passes' },
            { id: 'logs', label: 'Activity Logs' },
            { id: 'blacklist', label: 'Blacklist' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <TechCard>
              <h3 className="text-lg font-bold text-gray-900 font-heading mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" /> Resident Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    name="residentName"
                    value={formData.residentName}
                    onChange={handleChange}
                    className="w-full bg-white border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Unit</label>
                  <input
                    type="text"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleChange}
                    className="w-full bg-white border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
                  />
                </div>
              </div>
            </TechCard>

            <TechCard>
              <h3 className="text-lg font-bold text-gray-900 font-heading mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" /> Visitor Details
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Visitor Name *</label>
                    <input
                      type="text"
                      name="visitorName"
                      value={formData.visitorName}
                      onChange={handleChange}
                      className="w-full bg-white border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purpose of Visit</label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full bg-white border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Service">Service/Maintenance</option>
                      <option value="Guest">Guest</option>
                      <option value="Business">Business</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vehicle Number <span className="text-gray-400 font-normal lowercase">(Optional)</span></label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className="w-full bg-white border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
                      placeholder="Registration number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expected Arrival</label>
                    <input
                      type="datetime-local"
                      name="expectedArrival"
                      value={formData.expectedArrival}
                      onChange={handleChange}
                      className="w-full bg-white border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expected Departure</label>
                    <input
                      type="datetime-local"
                      name="expectedDeparture"
                      value={formData.expectedDeparture}
                      onChange={handleChange}
                      className="w-full bg-white border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row gap-4">
                  <button
                    onClick={generatePass}
                    disabled={isGenerating || !formData.visitorName || !formData.phone}
                    className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span>
                        Generating...
                      </span>
                    ) : (
                      <>
                        <QrCode className="w-5 h-5 opacity-80" /> Generate Pass
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        visitorName: '',
                        phone: '',
                        purpose: 'Personal',
                        vehicleNumber: '',
                        expectedArrival: formData.expectedArrival,
                        expectedDeparture: formData.expectedDeparture,
                        residentName: formData.residentName,
                        unitNumber: formData.unitNumber
                      })
                    }}
                    className="md:w-auto px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </TechCard>
          </div>

          {/* Right Column: Generated Pass & Features */}
          <div className="lg:col-span-5 relative">
            {generatedPass ? (
              <TechCard className="sticky top-6">
                <div className="bg-white border-2 border-slate-200 rounded-2xl relative overflow-hidden">
                  {/* Pass Header */}
                  <div className="bg-slate-50 border-b border-slate-200 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 font-heading">Digital Pass</h3>
                        <p className="text-slate-500 font-medium font-mono mt-1 text-sm">#{generatedPass.passCode}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${
                        generatedPass.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        generatedPass.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {generatedPass.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* QR and PIN visual centered */}
                    <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100 border-dashed">
                      {qrCodeData && (
                        <div className="relative mb-6">
                          <div className="p-2 bg-white rounded-xl shadow-sm border-slate-100">
                             <Image
                               width={180}
                               height={180}
                               src={qrCodeData} 
                               alt="QR Code" 
                               className="rounded"
                             />
                          </div>
                          {timeLeft && (
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-700 border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-sm">
                              Expires: {formatTime(timeLeft)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-6 w-full max-w-[280px]">
                        <div className="flex-1 bg-slate-50 p-4 rounded-xl border-slate-200 text-center">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Pass Code</p>
                          <p className="text-xl font-bold font-mono text-slate-900 tracking-wider">{generatedPass.passCode}</p>
                        </div>
                        <div className="flex-1 bg-blue-50 p-4 rounded-xl border-blue-200 text-center">
                          <p className="text-[10px] text-blue-500 uppercase tracking-widest font-bold mb-1">Entry PIN</p>
                          <p className="text-xl font-bold font-mono text-blue-900 tracking-wider">{generatedPass.pin}</p>
                        </div>
                      </div>
                    </div>

                    {/* Meta details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 text-slate-500 rounded-lg"><User className="w-4 h-4" /></div>
                         <div className="flex-1">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visitor</p>
                           <p className="font-bold text-slate-900 text-sm">{generatedPass.visitorName} • {generatedPass.phone}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 text-slate-500 rounded-lg"><MapPin className="w-4 h-4" /></div>
                         <div className="flex-1">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destination</p>
                           <p className="font-bold text-slate-900 text-sm">{generatedPass.residentName} (Unit {generatedPass.unitNumber})</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 text-slate-500 rounded-lg"><Calendar className="w-4 h-4" /></div>
                         <div className="flex-1">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Valid Until</p>
                           <p className="font-bold text-slate-900 text-sm">{new Date(generatedPass.expectedDeparture).toLocaleString(undefined, {
                             month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                           })}</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="bg-slate-50 border-t border-slate-200 p-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={verifyEntry}
                      disabled={generatedPass.securityVerified}
                      className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        generatedPass.securityVerified
                          ? 'bg-green-50 text-green-700 border-green-200 cursor-default shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-sm'
                      }`}
                    >
                      {generatedPass.securityVerified ? <><ShieldCheck className="w-4 h-4" /> Verified</> : 'Verify Check-in'}
                    </button>
                    <button
                      onClick={markExit}
                      className="py-3 bg-red-50 text-red-700 border-red-200 rounded-xl hover:bg-red-100 font-bold text-sm shadow-sm transition-all"
                    >
                      Mark Exit
                    </button>
                    <button
                      onClick={sharePass}
                      className="py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm shadow-sm col-span-2 flex items-center justify-center gap-2 transition-all"
                    >
                      <ExternalLink className="w-4 h-4 opacity-80" /> Share Digital Pass
                    </button>
                  </div>
                </div>
              </TechCard>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
                 <div className="w-16 h-16 bg-white border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                   <QrCode className="w-8 h-8 text-gray-400" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">No Pass Generated</h3>
                 <p className="text-gray-500 max-w-[250px]">Fill out the visitor details form to generate a secure QR code and Entry PIN.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADDITIONAL TABS CONTENT */}
      {activeTab === 'history' && (
        <TechCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 font-heading">Recent Passes</h3>
          </div>
          <CleanTable 
            data={passHistory}
            columns={[
              { accessorKey: 'visitorName', header: 'Visitor' },
              { accessorKey: 'purpose', header: 'Purpose' },
              { accessorKey: 'passCode', header: 'Pass Code', render: (val) => <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">{val}</span> },
              { accessorKey: 'status', header: 'Status', render: (val) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest   ${
                  val === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                  val === 'completed' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>{val}</span>
              ) },
              { id: 'actions', header: 'Actions', render: (_, row) => (
                <button onClick={() => loadFromHistory(row)} className="text-blue-600 hover:text-blue-700 text-xs font-bold uppercase tracking-widest">Load</button>
              ) }
            ]}
          />
        </TechCard>
      )}

      {activeTab === 'logs' && (
        <TechCard>
           <h3 className="text-lg font-bold text-gray-900 font-heading mb-6">Activity Logs</h3>
           <CleanTable 
             data={entryExitLogs}
             columns={[
               { accessorKey: 'visitor', header: 'Visitor' },
               { accessorKey: 'type', header: 'Event', render: (val) => (
                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest   ${
                   val === 'entry' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                 }`}>
                   {val}
                 </span>
               ) },
               { accessorKey: 'passCode', header: 'Code', render: (val) => <span className="font-mono text-slate-500 text-xs">{val}</span> },
               { accessorKey: 'timestamp', header: 'Time', render: (val) => new Date(val).toLocaleTimeString() },
               { accessorKey: 'verifiedBy', header: 'Verified By' }
             ]}
           />
        </TechCard>
      )}

      {activeTab === 'blacklist' && (
        <TechCard>
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-red-600 font-heading flex items-center gap-2">Blacklisted Visitors</h3>
             <button onClick={addToBlacklist} className="px-4 py-2 bg-red-50 text-red-700 font-bold text-sm rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">
               <Plus className="w-4 h-4" /> Add Entry
             </button>
           </div>
           <CleanTable 
             data={blacklistedVisitors}
             columns={[
               { accessorKey: 'name', header: 'Name' },
               { accessorKey: 'phone', header: 'Phone' },
               { accessorKey: 'reason', header: 'Reason' },
               { accessorKey: 'added', header: 'Date Added', render: (val) => new Date(val).toLocaleDateString() },
               { id: 'actions', header: 'Actions', render: (_, row, index) => (
                 <button onClick={() => removeFromBlacklist(index)} className="text-sm text-gray-500 hover:text-red-600 font-bold transition-colors">Remove</button>
               ) }
             ]}
           />
        </TechCard>
      )}
    </div>
  )
}