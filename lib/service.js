// Hardcoded database simulation
const HARDCODED_DATA = {
  announcements: [],
  visitors: [],
  residents: []
}



  // --- Alerts ---
  export async function getAlerts() {
    const data = [
      { id: 1, title: 'Unauthorized Access Attempt', description: 'Failed biometric scan at North Gate', time: '10 mins ago', severity: 'High' },
      { id: 2, title: 'Fire Alarm Test', description: 'Scheduled maintenance in Building B', time: '1 hour ago', severity: 'Medium' },
      { id: 3, title: 'Perimeter Breach', description: 'Motion detector triggered in Sector 4', time: '2 hours ago', severity: 'Critical' },
    ]
    return data 
  }

  export async function sendEmergencyAlert(alert) {
    const data = []
    data.push(alert)
    return data 
  }


  // --- Staff & Management ---
  export async function getUserData() {
    const data = []
    return data 
  }

  

  export async function getStaffMembers() {
    const data = []
    return data 
  }


  export async function getTasks() {
    const data = []
    return data 
  }


  // --- Inventory & Work Logs ---
  export async function getInventory() {
    const data = []
    return data 
  }

  export async function getWorkLogs() {
    const data = []
    return data 
  }


  // Get announcements
 export async function getAnnouncements() {
    try {
      // Try to fetch from placeholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
      const data = await response.json();
      
      return data.map((post, index) => ({
        id: post.id,
        title: post.title.substring(0, 30) + '...',
        content: post.body.substring(0, 100) + '...',
        date: `2024-01-${18 - index}`,
        type: ['maintenance', 'security', 'event'][index % 3],
        read: index > 0
      }));
    } catch (error) {
      console.log('Using hardcoded announcements data');
      return HARDCODED_DATA.announcements;
    }
  }

  // Get resident data
  export async function getResidentData(userId = 1) {
    const resident = HARDCODED_DATA.residents.find(r => r.id === userId);
    if (!resident) {
      // Return default resident data
      return {
        id: 1,
        name: 'John Resident',
        email: 'resident@demo.com',
        unitNumber: 'A-101',
        building: 'Tower A',
        phone: '+91 9876543210',
        joinDate: '2023-01-15',
        emergencyContact: '+91 9876543211',
        familyMembers: 3,
        vehicleNumber: 'MH01AB1234'
      };
    }
    return resident;
  }

  // Get visitors
  export async function getVisitors() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=4');
      const data = await response.json();
      
      return data.map((user, index) => ({
        id: user.id,
        name: user.name,
        purpose: ['Delivery', 'Service', 'Personal', 'Delivery'][index % 4],
        time: ['Today, 10:30 AM', 'Today, 2:00 PM', 'Yesterday, 7:00 PM', 'Jan 15, 11:30 AM'][index % 4],
        status: ['Active', 'Pending', 'Completed', 'Completed'][index % 4]
      }));
    } catch (error) {
      console.log('Using hardcoded visitors data');
      return HARDCODED_DATA.visitors;
    }
  }

  // Mark announcement as read
  export async function markAnnouncementAsRead(announcementId) {
    const announcementIndex = HARDCODED_DATA.announcements.findIndex(a => a.id === announcementId);
    if (announcementIndex !== -1) {
      HARDCODED_DATA.announcements[announcementIndex].read = true;
    }
    return { success: true };
  }

  // Mark all announcements as read
  export async function markAllAnnouncementsAsRead() {
    HARDCODED_DATA.announcements.forEach(ann => ann.read = true);
    return { success: true };
  }

  // Update resident profile
  export async function updateResidentProfile(userId, updatedData) {
    const residentIndex = HARDCODED_DATA.residents.findIndex(r => r.id === userId);
    if (residentIndex !== -1) {
      HARDCODED_DATA.residents[residentIndex] = {
        ...HARDCODED_DATA.residents[residentIndex],
        ...updatedData
      };
      return { success: true, data: HARDCODED_DATA.residents[residentIndex] };
    }
    
    // Add new resident if not found
    HARDCODED_DATA.residents.push({ id: userId, ...updatedData });
    return { success: true, data: { id: userId, ...updatedData } };
  }

  // Get Security Logs
  export async function getSecurityLogs() {
    return [
      { id: 'LOG-001', event: 'Biometric Access Denied', location: 'Gate 1 - North', time: '10 mins ago', date: '2024-03-15', severity: 'High', status: 'Investigating', user: 'Unknown' },
      { id: 'LOG-002', event: 'Perimeter Breach Det.', location: 'Sector 4 Fence', time: '2 hours ago', date: '2024-03-15', severity: 'Critical', status: 'Resolved', user: 'System' },
      { id: 'LOG-003', event: 'Fire Alarm Test', location: 'Building B', time: '1 hour ago', date: '2024-03-15', severity: 'Low', status: 'Completed', user: 'Admin' },
      { id: 'LOG-004', event: 'Visitor Entry Logged', location: 'Main Reception', time: '3 hours ago', date: '2024-03-15', severity: 'Info', status: 'Logged', user: 'Rajesh Kumar' },
      { id: 'LOG-005', event: 'CCTV Offline', location: 'Parking P2', time: '1 day ago', date: '2024-03-14', severity: 'Medium', status: 'Resolved', user: 'System' },
      { id: 'LOG-006', event: 'Vehicle Plate Unrecognized', location: 'Gate 2 - South', time: '1 day ago', date: '2024-03-14', severity: 'Low', status: 'Flagged', user: 'System' },
    ]
  }