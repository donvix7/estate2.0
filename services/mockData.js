// Centralized Mock Data Store
// This ensures all dashboards share the same initial data state

export const INITIAL_DATA = {
  // Visitor Management
  visitors: [],
  currentVisitors: [],
  logs: [], // Security logs
  securityLogs: [], // detailed logs

  // Service Requests
  serviceRequests: [
    {
      id: 'SRQ-001',
      residentName: 'Alice Johnson',
      unit: 'Block A, Flat 4',
      serviceType: 'Plumbing',
      description: 'Leaking pipe under the kitchen sink.',
      status: 'pending',
      priority: 'high',
      dateRequested: new Date(Date.now() - 86400000).toISOString(),
      assignedTo: null
    },
    {
      id: 'SRQ-002',
      residentName: 'Michael Smith',
      unit: 'Block C, Flat 12',
      serviceType: 'Electrical',
      description: 'Living room light switch is sparking when turned on.',
      status: 'in-progress',
      priority: 'high',
      dateRequested: new Date(Date.now() - 172800000).toISOString(),
      assignedTo: 'Samuel Okeke'
    },
    {
      id: 'SRQ-003',
      residentName: 'Sarah Williams',
      unit: 'Block B, Flat 8',
      serviceType: 'Carpentry',
      description: 'Front door lock is sticking and hard to turn.',
      status: 'completed',
      priority: 'normal',
      dateRequested: new Date(Date.now() - 604800000).toISOString(),
      assignedTo: 'David Mensah'
    }
  ],

  // Communications
  announcements: [
    {
      id: 1,
      title: 'Maintainence Notice: Main Gate',
      message: 'The main gate will be undergoing maintenance on Saturday from 2 PM to 4 PM. Please use the side entrance.',
      type: 'maintenance',
      priority: 'normal',
      author: 'Admin',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: 2,
      title: 'Security Alert: Suspicious Activity',
      message: 'Report of suspicious individual near Block C. Security has been dispatched.',
      type: 'security',
      priority: 'high',
      author: 'System',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true
    }
  ],
  broadcasts: [],
  emergencyAlerts: [],
  securityIncidents: [], 
  alerts: [], // specific security alerts

  // User Management
  userData: {
    id: 'admin_001',
    name: 'John Admin',
    gateStation: 'Main Office',
    type: 'admin',
    estateId: 'estate_001'
  },
  estates: [
    { id: 'estate_001', name: 'Sunrise Estate', adminId: 'admin_001' }
  ],
  buildings: [
    {
      id: "BLD-A",
      name: "Block A - Crimson",
      totalUnits: 24,
      occupiedUnits: 22,
      manager: "Adebayo Johnson",
      managerPhone: "+234 800 111 2222",
      status: "Operational"
    },
    {
      id: "BLD-B",
      name: "Block B - Sapphire",
      totalUnits: 24,
      occupiedUnits: 18,
      manager: "Sarah Williams",
      managerPhone: "+234 800 333 4444",
      status: "Operational"
    },
    {
      id: "BLD-C",
      name: "Block C - Emerald",
      totalUnits: 36,
      occupiedUnits: 36,
      manager: "David Okonkwo",
      managerPhone: "+234 800 555 6666",
      status: "Fully Occupied"
    },
    {
      id: "BLD-D",
      name: "Block D - Amber",
      totalUnits: 20,
      occupiedUnits: 4,
      manager: "Michael Chang",
      managerPhone: "+234 800 777 8888",
      status: "Under Maintenance"
    }
  ],
  pendingInvites: [
    {
      id: "INV-001",
      guestName: "Oluwaseun Adebayo",
      residentName: "Alice Johnson",
      unit: "Block A, Flat 4",
      date: new Date(Date.now() + 86400000).toISOString(),
      type: "Guest Invite",
      status: "pending",
      code: "GT-9821"
    },
    {
      id: "INV-002",
      guestName: "MTN Broadband Team",
      residentName: "Michael Smith",
      unit: "Block C, Flat 12",
      date: new Date(Date.now() + 172800000).toISOString(),
      type: "Service Provider",
      status: "approved",
      code: "SV-4402"
    },
    {
      id: "INV-003",
      guestName: "Sarah Connor",
      residentName: "System",
      unit: "Admin",
      date: new Date(Date.now() - 86400000).toISOString(),
      type: "Event Access",
      status: "expired",
      code: "EV-1129"
    }
  ],
  
  // Emergencies
  emergencies: [
    {
      id: "EMG-001",
      residentName: "Alice Johnson",
      unit: "Block A, Flat 4",
      type: "Medical",
      description: "Severe allergic reaction, needs immediate assistance.",
      date: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
      status: "active", // active, resolved
      resolvedBy: null,
      resolvedAt: null
    },
    {
      id: "EMG-002",
      residentName: "Michael Smith",
      unit: "Block C, Flat 12",
      type: "Fire",
      description: "Smoke coming from the kitchen vent.",
      date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: "resolved",
      resolvedBy: "Admin / Security Team",
      resolvedAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: "EMG-003",
      residentName: "Sarah Williams",
      unit: "Block B, Flat 8",
      type: "Security",
      description: "Suspicious individual loitering near the back fence.",
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: "resolved",
      resolvedBy: "Chief Security Officer",
      resolvedAt: new Date(Date.now() - 80000000).toISOString()
    }
  ],
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'resident', status: 'verified', unit: 'A-101', buildingId: 'BLD-A' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'verified', unit: 'Main Office' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'resident', status: 'pending', unit: 'B-204', buildingId: 'BLD-B' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'vendor', status: 'verified', company: 'ABC Plumbers' },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'resident', status: 'verified', unit: 'C-305', buildingId: 'BLD-C' },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'resident', status: 'verified', unit: 'A-102', buildingId: 'BLD-A' },
  ],
  emergencyContacts: [
    { id: 1, name: "Estate Clinic", role: "Medical Alert", phone: "+234 800 123 4567", type: "Medical" },
    { id: 2, name: "Central Fire Station", role: "Fire Emergency", phone: "112", type: "Fire" },
    { id: 3, name: "Estate Security Desk", role: "Security Breach", phone: "+234 800 987 6543", type: "Security" },
    { id: 4, name: "Facility Manager (John)", role: "General/Maintenance", phone: "+234 811 222 3333", type: "General" }
  ],

  // Staff Management
  staffMembers: [
    {
      id: 'staff_001',
      name: 'Samuel Okeke',
      role: 'Senior Technician',
      employeeId: 'STF-2024-042',
      department: 'Maintenance',
      shift: 'Morning (8:00 AM - 4:00 PM)',
      phone: '+234 801 234 5678',
      email: 'samuel.okeke@estate.com',
      joinDate: '2022-03-15',
      rating: 4.8,
      status: 'active',
      skills: ['Electrical Repair', 'Plumbing']
    }
  ],
  staffAttendance: [],
  staffTasks: [
    {
      id: 1,
      title: 'Inspect Water Pump B',
      location: 'Block C Utility Room',
      priority: 'high',
      status: 'pending',
      assignedBy: 'Facility Manager',
      dueDate: '2024-10-25',
      description: 'Reported unusual noise. Check pressure levels and vibration.'
    }
  ],
  inventory: [
    { id: 1, name: 'LED Bulbs (15W)', quantity: 45, unit: 'pcs', minLevel: 20, category: 'Electrical' },
    { id: 2, name: 'PVC Pipe (2 inch)', quantity: 8, unit: 'lengths', minLevel: 10, category: 'Plumbing' }
  ],
  workLogs: [],
  
  // Lost and Found
  lostAndFoundItems: [
    {
      id: 'LF-001',
      itemName: 'Black Leather Wallet',
      category: 'Personal Item',
      locationFound: 'Swimming Pool Area',
      dateFound: new Date(Date.now() - 172800000).toISOString(),
      foundBy: 'Security Guard - David',
      description: 'Contains ID cards and some cash. Handed over to security desk.',
      status: 'unclaimed', // unclaimed, claimed, discarded
      claimedBy: null,
      claimedDate: null
    },
    {
      id: 'LF-002',
      itemName: 'Toyota Car Keys',
      category: 'Keys',
      locationFound: 'Block B Parking Lot',
      dateFound: new Date(Date.now() - 86400000).toISOString(),
      foundBy: 'Resident - Jane Smith',
      description: 'Keys with a red keychain. Dropped near parking slot B14.',
      status: 'claimed',
      claimedBy: 'Mr. Olamide (Apt B14)',
      claimedDate: new Date().toISOString()
    },
    {
      id: 'LF-003',
      itemName: 'Apple AirPods Pro',
      category: 'Electronics',
      locationFound: 'Estate Gym',
      dateFound: new Date(Date.now() - 432000000).toISOString(),
      foundBy: 'Gym Instructor - Mike',
      description: 'Left on the treadmill. White charging case.',
      status: 'unclaimed',
      claimedBy: null,
      claimedDate: null
    }
  ],
  
  // Finance - Invoices
  invoices: [
    {
      id: "INV-2024-001",
      residentName: "Alice Johnson",
      unit: "Block A, Flat 4",
      amount: 45000,
      status: "pending",
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      dateIssued: new Date(Date.now() - 86400000 * 2).toISOString(),
      description: "Monthly Estate Service Charge",
      category: "Service Charge"
    },
    {
      id: "INV-2024-002",
      residentName: "Michael Smith",
      unit: "Block C, Flat 12",
      amount: 15000,
      status: "paid",
      dueDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      dateIssued: new Date(Date.now() - 86400000 * 25).toISOString(),
      description: "Water Utility Bill",
      category: "Utility"
    },
    {
      id: "INV-2024-003",
      residentName: "Sarah Williams",
      unit: "Block B, Flat 8",
      amount: 125000,
      status: "overdue",
      dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      dateIssued: new Date(Date.now() - 86400000 * 30).toISOString(),
      description: "Annual Maintenance Levy",
      category: "Maintenance"
    }
  ],
  
  // Finance - Transactions
  transactions: [
    {
      id: "TXN-001A9B",
      date: new Date().toISOString(),
      residentName: "Michael Smith",
      unit: "Block C, Flat 12",
      amount: 15000,
      type: "Payment",
      method: "Bank Transfer",
      status: "completed",
      reference: "INV-2024-002"
    },
    {
      id: "TXN-002XYZ",
      date: new Date(Date.now() - 86400000).toISOString(),
      residentName: "Sarah Williams",
      unit: "Block B, Flat 8",
      amount: 25000,
      type: "Part-Payment",
      method: "Card",
      status: "completed",
      reference: "INV-2024-003"
    }
  ]
};

// Blacklisted codes for security checks
export const BLACKLISTED_CODES = ['BLOCK123', 'BLOCK456', 'DENY789'];
