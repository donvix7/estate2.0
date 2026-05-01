"use server"
import { cookies } from "next/headers"

const db_url = process.env.DB_URL

export async function getResidentData() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  const token = cookieStore.get('session_token')?.value;
  
  if (!currentUser) return null;

  try {
    const user = JSON.parse(currentUser);
    const userId = user._id || user.id;

    const res = await fetch(`${db_url}/api/profile/${userId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching resident data:', error)
    return null
  }
}

export async function getAdminData() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  const token = cookieStore.get('session_token')?.value;
  
  if (!currentUser) return {message: "No user data found login again"};

  try {
    const user = JSON.parse(currentUser);
    const userId = user._id || user.id;

    const res = await fetch(`${db_url}/api/admin/${userId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching admin data:', error)
    return null
  }
}

export async function getEmergencies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/emergency`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching emergencies:', error)
    return []
  }
}

export async function getSecurityLogs() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/log`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching security logs:', error)
    return []
  }
}

export async function getPendingInvites() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  const token = cookieStore.get('session_token')?.value;
  if (!currentUser) return [];

  try {
    const user = JSON.parse(currentUser);
    const res = await fetch(`${db_url}/invites`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data.filter(item => item.residentId === user.id)
  } catch (error) {
    console.error('Error fetching invites:', error)
    return []
  }
}

export async function getAnnouncements() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/announcement`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return []
  }
}

export async function getServiceRequests() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  const token = cookieStore.get('session_token')?.value;
  if (!currentUser) return [];

  try {
    const user = JSON.parse(currentUser);
    const res = await fetch(`${db_url}/api/request`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) return [];
    const {data} = await res.json()
    return data.docs.filter(item => item.residentId === user.id)
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return []
  }
}

export async function getPassHistory() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/pass-history`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) return [];
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching pass history:', error)
    return []
  }
}

export async function getResidentPassHistory() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/pass-history`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) return [];
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching pass history:', error)
    return []
  }
}

export async function getEntryExitLogs() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/entry-exit-logs`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) return [];
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching entry exit logs:', error)
    return []
  }
}

export async function getEntryExitLogsResidents() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/scan-history`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) return [];
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching entry exit logs:', error)
    return []
  }
}

export async function getBlacklist() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/blacklist`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching blacklist:', error)
    return []
  }
}

export async function getLostAndFound() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/lost-and-found`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) return [];
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching lost and found:', error)
    return []
  }
}

export async function getWorkers() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/workers`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching workers:', error)
    return []
  }
}

export async function getWorkerById(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/workers/${id}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching worker:', error)
    return null
  }
}

export async function getActiveBills() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  const token = cookieStore.get('session_token')?.value;
  if (!currentUser) return [];

  try {
    const user = JSON.parse(currentUser);
    const res = await fetch(`${db_url}/active_bills`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data.filter(item => item.residentId === user.id)
  } catch (error) {
    console.error('Error fetching active bills:', error)
    return []
  }
}

export async function getRecentTransactions() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  const token = cookieStore.get('session_token')?.value;
  if (!currentUser) return [];

  try {
    const user = JSON.parse(currentUser);
    const res = await fetch(`${db_url}/recent_transactions`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data.filter(item => item.residentId === user.id)
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return []
  }
}

export async function getMaintenanceRequests() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/maintenance_requests`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching maintenance requests:', error)
    return []
  }
}

export async function getResidentsMaintenanceRequests() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  const token = cookieStore.get('session_token')?.value;
  if (!currentUser) return [];
  
  try {
    const user = JSON.parse(currentUser);
    const res = await fetch(`${db_url}/maintenance_requests`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data.filter(item => item.residentId === user.id)
  } catch (error) {
    console.error('Error fetching maintenance requests:', error)
    return []
  }
}

export async function getAllProfiles() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/profile`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return []
  }
}

export async function getAdminSecurityLogs() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/log`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching admin security logs:', error)
    return []
  }
}

export async function getInvoices() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/invoice`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    console.log(data)
    
    return data
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return []
  }
}

export async function getTransactions() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/transaction`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

export async function getResidentTransactions() {
  return getRecentTransactions();
}

export async function getResidents() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/profile`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data.filter(u => u.type === 'resident')
  } catch (error) {
    console.error('Error fetching residents:', error)
    return []
  }
}

export async function getUserById(id) {
  if (!id) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/profile/${id}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching user by id:', error)
    return null
  }
}

export async function getScanHistory() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/scan`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching scan history:', error)
    return []
  }
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  const token = cookieStore.get('session_token')?.value;
  if (!sessionId) return null;
  try {
    const res = await fetch(`${db_url}/sessions/${sessionId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return null
  }
}

export async function getAdminEmergencies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/emergency`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching emergencies:', error)
    return []
  }
}

export async function getEstateData() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  const token = cookieStore.get('session_token')?.value;
  if (!currentUser) return null;
  
  try {
    const user = JSON.parse(currentUser);
    const estateId = user.estateID;
    const res = await fetch(`${db_url}/api/estate/${estateId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching estate data:', error)
    return null
  }
}

export async function getStaffMembers() {
  return getEstateData();
}

export async function getVisitors() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  try {
    const res = await fetch(`${db_url}/api/visitors`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const {data} = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching visitors:', error)
    return []
  }
}