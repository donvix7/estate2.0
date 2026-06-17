"use server";

import { cookies } from "next/headers"

const db_url = process.env.DB_URL
if (!db_url) {
  throw new Error('DB_URL environment variable is not set')
}

// Helper function to get auth headers
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  return {
    "Content-Type": "application/json",
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Helper for consistent fetching
async function fetchWithAuth(url, options = {}) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(url, { 
      ...options, 
      headers: { ...headers, ...options.headers }
    });
    
    if (!res.ok) {
      console.error(`Fetch failed for ${url}: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    return null;
  }
}

// Helper to get current user
async function getCurrentUser() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get('currentUser')?.value;
  if (!currentUser) return null;
  
  try {
    return JSON.parse(currentUser);
  } catch (error) {
    console.error('Error parsing currentUser:', error);
    return null;
  }
}

export async function getResidentData() {
  const user = await getCurrentUser();
  if (!user) return null;

  const userId = user._id || user.id;
  const data = await fetchWithAuth(`${db_url}/api/profile/${userId}`);
  return data || {};
}

export async function getAllEstates() {
  const data = await fetchWithAuth(`${db_url}/api/estates`);
  return data || [];
}

export async function getAdminData() {
  const user = await getCurrentUser();
  if (!user) return { message: "No user data found login again" };

  const userId = user._id || user.id;
  const data = await fetchWithAuth(`${db_url}/auth/admins/${userId}`);
  return data || null;
}

export async function getEmergencies(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/emergency?page=${page}`);
  return data || { docs: [] };
}

export async function getSecurityLogs() {
  const data = await fetchWithAuth(`${db_url}/api/log`);
  return data || { docs: [] };
}

export async function getPendingInvites() {
  const user = await getCurrentUser();
  if (!user) return [];

  const data = await fetchWithAuth(`${db_url}/invites`);
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => item.residentId === user.id);
}

export async function getAnnouncements(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/announcement?page=${page}`);
  return data || { docs: [] };
}

export async function getServiceRequests() {
  const user = await getCurrentUser();
  if (!user) return [];

  const data = await fetchWithAuth(`${db_url}/api/request`);
  if (!data || !data.docs) return [];
  
  return data.docs.filter(item => item.residentId === user._id);
}

export async function getServiceRequestById(id) {
  if (!id) return null;
  const data = await fetchWithAuth(`${db_url}/api/request/${id}`);
  return data || null;
}

export async function getAllServiceRequests(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/request?page=${page}`);
  return data || { docs: [] };
}

export async function getPassHistory() {
  const data = await fetchWithAuth(`${db_url}/api/pass-history`);
  return data || { docs: [] };
}

export async function getResidentPassHistory() {
  return await getPassHistory();
}

export async function getEntryExitLogs() {
  const data = await fetchWithAuth(`${db_url}/api/entry-exit-logs`);
  return data || { docs: [] };
}

export async function getEntryExitLogsResidents() {
  const data = await fetchWithAuth(`${db_url}/api/scan-history`);
  return data || { docs: [] };
}

export async function getBlacklist() {
  const data = await fetchWithAuth(`${db_url}/blacklist`);
  return data || { docs: [] };
}

export async function getLostAndFound() {
  const data = await fetchWithAuth(`${db_url}/api/lost-and-found`);
  return data || { docs: [] };
}

export async function getWorkers(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/worker?page=${page}`);
  return data || { docs: [] };
}

export async function getWorkerById(id) {
  if (!id) return null;
  const data = await fetchWithAuth(`${db_url}/api/worker/${id}`);
  return data || null;
}

export async function getActiveBills() {
  const user = await getCurrentUser();
  if (!user) return [];

  const data = await fetchWithAuth(`${db_url}/active_bills`);
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => item.residentId === user.id);
}

export async function getRecentTransactions() {
  const user = await getCurrentUser();
  if (!user) return [];

  const data = await fetchWithAuth(`${db_url}/recent_transactions`);
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => item.residentId === user.id);
}

export async function getMaintenanceRequests() {
  const data = await fetchWithAuth(`${db_url}/maintenance_requests`);
  return data || { docs: [] };
}

export async function getResidentsMaintenanceRequests() {
  const user = await getCurrentUser();
  if (!user) return [];

  const data = await fetchWithAuth(`${db_url}/maintenance_requests`);
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => item.residentId === user.id);
}

export async function getAllProfiles(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/profile?page=${page}`);
  return data || { docs: [] };
}

export async function getAdminSecurityLogs() {
  const data = await fetchWithAuth(`${db_url}/api/log`);
  return data || { docs: [] };
}

export async function getInvoices(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/invoice?page=${page}`);
  return data || { docs: [] };
}

export async function getTransactions(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/transaction?page=${page}`);
  return data || { docs: [] };
}

export async function getResidentTransactions() {
  return await getRecentTransactions();
}

export async function getResidents() {
  const data = await fetchWithAuth(`${db_url}/api/profile`);
  if (!data || !Array.isArray(data)) return { docs: [] };
  
  return data.filter(u => u.type === 'resident');
}

export async function getUserById(id) {
  if (!id) return null;
  const data = await fetchWithAuth(`${db_url}/api/profile/${id}`);
  return data || null;
}

export async function getScanHistory(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/scan?page=${page}`);
  return data || { docs: [] };
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  if (!sessionId) return null;
  
  const data = await fetchWithAuth(`${db_url}/sessions/${sessionId}`);
  return data || null;
}

export async function getAdminEmergencies() {
  const data = await fetchWithAuth(`${db_url}/api/emergency`);
  return data || { docs: [] };
}

export async function getEstateData() {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const estateId = user.estateID;
  if (!estateId) return null;
  
  const data = await fetchWithAuth(`${db_url}/api/estates/${estateId}`);
  return data || null;
}

export async function getStaffMembers() {
  return await getWorkers();
}

export async function getVisitors() {
  const data = await fetchWithAuth(`${db_url}/api/visitors`);
  return data || [];
}

export async function getResidentRequests(page = 1) {
  const data = await fetchWithAuth(`${db_url}/api/resident-request/?page=${page}`);
  return data || { docs: [] };
}

export async function getResidentRequestById(id) {
  if (!id) return null;
  const data = await fetchWithAuth(`${db_url}/api/resident-request/${id}`);
  return data || null;
}

// Additional helper function to clear all cookies if needed
export async function clearAllCookies() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  for (const cookie of allCookies) {
    cookieStore.delete(cookie.name);
  }
  
  return { success: true, deleted: allCookies.length };
}