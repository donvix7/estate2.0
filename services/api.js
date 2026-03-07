import { INITIAL_DATA, BLACKLISTED_CODES } from './mockData';

// Singleton state simulation (in-memory persistence during session)
let STATE = { ...INITIAL_DATA };

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- GENERAL ---
  resetData: () => {
    STATE = { ...INITIAL_DATA };
  },

  getState: () => STATE,

  logout: async () => {
    await delay(300);
    return { success: true };
  },

  // --- ANNOUNCEMENTS & ALERTS ---
  async getAnnouncements() {
    return STATE.announcements || [];
  },

  async saveAnnouncement(announcement) {
    const newAnnouncement = {
      id: Date.now(),
      ...announcement,
      timestamp: new Date().toISOString(),
      read: false,
      author: announcement.author || 'Admin'
    };
    if (!STATE.announcements) STATE.announcements = [];
    STATE.announcements.unshift(newAnnouncement);
    return { success: true, data: newAnnouncement };
  },

  async getAlerts() {
    const data = []
    return data;
  },

  // --- SERVICE REQUESTS ---
  async getServiceRequests() {
    return STATE.serviceRequests || [];
  },

  async updateServiceRequest(id, updates) {
    if (!STATE.serviceRequests) return { success: false, error: 'No requests found' };
    
    const index = STATE.serviceRequests.findIndex(req => req.id === id);
    if (index === -1) return { success: false, error: 'Request not found' };

    STATE.serviceRequests[index] = {
      ...STATE.serviceRequests[index],
      ...updates
    };

    return { success: true, data: STATE.serviceRequests[index] };
  },

  // --- STAFF / SERVICE WORKERS ---
  async getStaffMembers() {
    return STATE.staffMembers || [];
  },

  // --- LOST AND FOUND ---
  async getLostAndFoundItems() {
    return STATE.lostAndFoundItems || [];
  },

  async updateLostAndFoundItem(id, updates) {
    if (!STATE.lostAndFoundItems) return { success: false, error: 'No items found' };
    
    const index = STATE.lostAndFoundItems.findIndex(item => item.id === id);
    if (index === -1) return { success: false, error: 'Item not found' };

    STATE.lostAndFoundItems[index] = {
      ...STATE.lostAndFoundItems[index],
      ...updates
    };

    return { success: true, data: STATE.lostAndFoundItems[index] };
  },

  // --- FINANCE ---
  async getInvoices() {
    return STATE.invoices || [];
  },

  async getTransactions() {
    return STATE.transactions || [];
  },

  // --- ESTATES & BUILDINGS ---
  async getBuildings() {
    return STATE.buildings || [];
  },

  async getBuildingById(id) {
    if (!STATE.buildings) return null;
    const building = STATE.buildings.find(b => b.id === id);
    if (!building) throw new Error('Building not found');
    return building;
  },

  async getResidentsByBuildingId(id) {
    if (!STATE.users) return [];
    return STATE.users.filter(u => u.buildingId === id && u.role === 'resident');
  },

  // --- INVITES ---
  async getInvites() {
    return STATE.pendingInvites || [];
  },

  async updateInvite(id, updates) {
    if (!STATE.pendingInvites) return { success: false, error: 'No invites found' };
    
    const index = STATE.pendingInvites.findIndex(invite => invite.id === id);
    if (index === -1) return { success: false, error: 'Invite not found' };

    STATE.pendingInvites[index] = {
      ...STATE.pendingInvites[index],
      ...updates
    };

    return { success: true, data: STATE.pendingInvites[index] };
  },

  // --- EMERGENCIES ---
  async getEmergencies() {
    return STATE.emergencies || [];
  },
  
  async getEmergencyContacts() {
    return STATE.emergencyContacts || [];
  },

  async updateEmergencyStatus(id, updates) {
    if (!STATE.emergencies) return { success: false, error: 'No emergencies found' };
    
    const index = STATE.emergencies.findIndex(emg => emg.id === id);
    if (index === -1) return { success: false, error: 'Emergency not found' };

    STATE.emergencies[index] = {
      ...STATE.emergencies[index],
      ...updates
    };

    return { success: true, data: STATE.emergencies[index] };
  },

  async saveEmergencyAlert(alert) {
    if (!STATE.emergencies) STATE.emergencies = [];
    const newAlert = {
      id: `EMG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...alert,
      date: new Date().toISOString(),
      status: 'active',
      resolvedBy: null,
      resolvedAt: null
    };
    STATE.emergencies.unshift(newAlert);
    return { success: true, data: newAlert };
  },

  // --- VISITOR MANAGEMENT ---
  async getVisitors() {
    const data = []
    return data;
  },

  async getSecurityLogs() {
    const data = []
    return data;
  },

  async verifyVisitorPass(code, pin) {
    
    const isBlacklisted = BLACKLISTED_CODES.includes(code);
    
    if (isBlacklisted) {
      // Auto-log incident
      const incident = {
        id: Date.now(),
        type: 'blacklist_attempt',
        visitorCode: code,
        time: new Date().toISOString(),
        action: 'Denied entry',
        priority: 'high',
        message: `Blacklisted code ${code} attempted entry`
      };
      STATE.alerts.unshift(incident);
      STATE.securityLogs.unshift(incident);

      return {
        success: false,
        message: 'Visitor is blacklisted',
        blacklisted: true,
        visitor: null
      };
    }
    
    // Simulate finding a visitor
    const residents = [];
    const randomResident = residents[Math.floor(Math.random() * residents.length)];
    
    const visitorData = {
      id: `visitor_${Date.now()}`,
      code: code,
      pin: pin,
      name: `Visitor ${code.substring(0,6)}`,
      resident: randomResident,
      purpose: 'Verified Entry',
      entryTime: new Date().toISOString(),
      status: 'active',
      verifiedBy: 'QR Scan'
    };
    
    STATE.currentVisitors.unshift(visitorData);
    
    const logEntry = {
      id: Date.now(),
      type: 'entry',
      visitorCode: code,
      visitorName: visitorData.name,
      timestamp: new Date().toISOString(),
      action: 'Entry granted',
      method: 'QR Scan',
      location: 'Main Gate'
    };
    
    STATE.securityLogs.unshift(logEntry);
    STATE.logs.unshift(logEntry); // Legacy support
    
    return {
      success: true,
      message: 'Visitor verified successfully',
      visitor: visitorData,
      log: logEntry
    };
  },

  async updateVisitorStatus(visitorId, updates) {
    const data = []
    return { success: true, data: data };
  },

  // --- STAFF & USER MANAGEMENT ---
  async getUserData() {
    const data = []
    return data;
  },

  async getStaffMembers() {
    const data = []
    return data;
  },

  async addStaffMember(staff) {
    const data = []
    return { success: true, data: data };
  },

  async getStaffTasks() {
    const data = []
    return data;
  },

  async updateTaskStatus(taskId, status) {
    const data = []
    return { success: true, data: data };
  },

  async getInventory() {
    const data = []
    return data;
  },
  
  async getWorkLogs() {
    const data = []
    return data;
  },

  async submitWorkLog(log) {
     const newWorkLog = {
      id: Date.now(),
      ...log,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    STATE.workLogs.unshift(newWorkLog);
    return { success: true, data: newWorkLog };
  },

  async getEstates() {
    const data = []
    return data;
  },

  async sendUserInvitation(invitation) {
    const token = `invite_${Date.now()}`;
    const newInvite = {
      ...invitation,
      id: token,
      token,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    STATE.pendingInvites.unshift(newInvite);
    return { success: true, invitation: newInvite, message: `Invitation sent to ${invitation.email}` };
  },
  
  async getPendingInvites() {
    const data = []
    return data;
  },
  
  async getAdminEstate(adminId) {
    const data = []
    return data;
  }
};
