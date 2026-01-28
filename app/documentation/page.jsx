'use client'

import { useState } from 'react'
import { 
  Shield, 
  Lock, 
  Clock, 
  Building, 
  UserCheck, 
  Mail,
  Link,
  CheckCircle,
  AlertTriangle,
  Megaphone,
  Bell,
  Users,
  BarChart3,
  ChevronRight,
  Key,
  Smartphone,
  Target,
  FileText
} from 'lucide-react'

const InvitationWorkflowPage = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { id: 1, title: 'Admin Authentication', icon: <Key className="w-5 h-5" /> },
    { id: 2, title: 'Invitation Creation', icon: <Mail className="w-5 h-5" /> },
    { id: 3, title: 'Link Delivery', icon: <Link className="w-5 h-5" /> },
    { id: 4, title: 'User Registration', icon: <UserCheck className="w-5 h-5" /> },
    { id: 5, title: 'Authorization Complete', icon: <CheckCircle className="w-5 h-5" /> },
  ]

  const securityFeatures = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Estate-Specific Links',
      description: 'Each invitation link is uniquely generated and bound to a specific estate',
      details: 'Links contain encrypted estate identifiers that cannot be tampered with'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Time-Limited Validity',
      description: 'Invitation links automatically expire after 7 days',
      details: 'Prevents unauthorized registration attempts after the validity period'
    },
    {
      icon: <Building className="w-5 h-5" />,
      title: 'Restricted Registration',
      description: 'Users can only register for the estate specified in the invitation',
      details: 'Prevents cross-estate registration attempts'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Admin Authorization',
      description: 'Only authenticated estate admins can generate invitation links',
      details: 'Multi-factor verification ensures authorization integrity'
    }
  ]

  const broadcastChannels = [
    {
      channel: 'Resident Notifications',
      icon: <Bell className="w-5 h-5" />,
      recipients: 'All registered residents',
      priority: 'High',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      channel: 'Admin Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      recipients: 'Administration team',
      priority: 'Medium',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      channel: 'Security Personnel',
      icon: <Users className="w-5 h-5" />,
      recipients: 'On-duty security staff',
      priority: 'High',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      channel: 'Announcement Archive',
      icon: <FileText className="w-5 h-5" />,
      recipients: '30-day storage log',
      priority: 'Info',
      color: 'bg-gray-50 text-gray-700 border-gray-200'
    }
  ]

  const priorityLevels = [
    {
      level: 'Emergency',
      icon: <AlertTriangle className="w-5 h-5" />,
      description: 'Critical security alerts and immediate action required',
      examples: ['Security breach', 'Fire emergency', 'Medical crisis'],
      color: 'bg-red-50 border-red-200 text-red-800'
    },
    {
      level: 'Security Update',
      icon: <Shield className="w-5 h-5" />,
      description: 'Important security notifications and updates',
      examples: ['Visitor policy changes', 'Maintenance alerts', 'System updates'],
      color: 'bg-orange-50 border-orange-200 text-orange-800'
    },
    {
      level: 'General Announcement',
      icon: <Megaphone className="w-5 h-5" />,
      description: 'Community updates and informational broadcasts',
      examples: ['Event announcements', 'Utility notices', 'Community meetings'],
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    }
  ]

  const workflowSteps = [
    {
      step: 1,
      title: 'Admin Authentication & Link Generation',
      icon: <Key className="w-6 h-6" />,
      description: 'Authenticated admin generates unique invitation link',
      details: ['Admin must be logged into their estate', 'System verifies admin permissions', 'Link includes encrypted estate identifier']
    },
    {
      step: 2,
      title: 'Invitation Delivery',
      icon: <Mail className="w-6 h-6" />,
      description: 'Invitation link is sent via secure email',
      details: ['Email contains personalized invitation', 'Link includes 7-day expiry timer', 'Clear instructions for registration']
    },
    {
      step: 3,
      title: 'User Registration',
      icon: <UserCheck className="w-6 h-6" />,
      description: 'User completes registration using the invitation link',
      details: ['Link validates estate identifier', 'User provides required information', 'System validates user details']
    },
    {
      step: 4,
      title: 'Automatic Authorization',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'User account is automatically authorized for the specific estate',
      details: ['Account linked to estate database', 'Role-based permissions assigned', 'Access to estate-specific features granted']
    },
    {
      step: 5,
      title: 'Access & Integration',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'User gains full access to estate management platform',
      details: ['Mobile app access configured', 'Notification preferences set', 'Community features activated']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-900 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Secure Invitation & Authorization System
              </h1>
              <p className="text-gray-600 mt-2">
                Enterprise-grade invitation workflow with multi-layered security and automated authorization
              </p>
            </div>
          </div>

          {/* Steps Progress */}
          <div className="mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    activeStep === step.id - 1
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveStep(step.id - 1)}
                >
                  <div className={`p-2 rounded ${
                    activeStep === step.id - 1 ? 'bg-white/20' : 'bg-white'
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Step {step.id}</div>
                    <div className="text-sm">{step.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Security Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Features Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Security Features</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {feature.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {feature.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Workflow */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Detailed Workflow</h2>
              </div>

              <div className="space-y-6">
                {workflowSteps.map((step, index) => (
                  <div
                    key={index}
                    className="relative"
                  >
                    {/* Connector line */}
                    {index < workflowSteps.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                    )}

                    <div className="flex items-start">
                      <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        {step.step}
                      </div>
                      
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                          {step.icon}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {step.description}
                        </p>
                        
                        <div className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Broadcast & Authorization */}
          <div className="space-y-6">
            {/* Authorization Process */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Key className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Authorization Process</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Estate Identifier</span>
                    <code className="px-2 py-1 bg-gray-900 text-white text-xs rounded font-mono">
                      adminEstateId
                    </code>
                  </div>
                  <p className="text-sm text-gray-600">
                    Embedded in all invitation links for automatic estate assignment
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Automatic Assignment</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Auto-Configured</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    Users are automatically assigned to{' '}
                    <strong className="text-blue-800">adminEstate</strong> upon registration
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Security Validation</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Real-time</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Link validation occurs during registration to prevent unauthorized access
                  </p>
                </div>
              </div>
            </div>

            {/* Broadcast Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Broadcast Distribution</h2>
              </div>

              <div className="space-y-4">
                {broadcastChannels.map((channel, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${channel.color}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {channel.icon}
                        <span className="font-medium">{channel.channel}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        channel.priority === 'High' 
                          ? 'bg-red-100 text-red-800'
                          : channel.priority === 'Medium'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {channel.priority}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">{channel.recipients}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Levels */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Priority Levels</h2>
              </div>

              <div className="space-y-4">
                {priorityLevels.map((level, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${level.color}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {level.icon}
                      <div>
                        <h3 className="font-semibold">{level.level}</h3>
                        <p className="text-sm opacity-90">{level.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {level.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-current rounded-full opacity-50"></div>
                          <span className="text-sm">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Guidelines */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Security Guidelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Before Sending</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Verify user email address
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Confirm estate assignment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Review user role permissions
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">During Registration</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Link validation in real-time
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Automatic estate assignment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Role-based access configuration
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">After Completion</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Audit log generation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Welcome notification sent
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Access verification completed
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-gray-900 text-white rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Enterprise Security Standards</p>
              <p className="text-sm text-gray-300 mt-1">
                All invitation processes follow ISO 27001 security standards with end-to-end encryption and audit trails
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvitationWorkflowPage