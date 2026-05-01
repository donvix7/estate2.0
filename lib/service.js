"use server"
import { cookies } from "next/headers"

const db_url = process.env.DB_URL

// Internal Helpers
async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const currentUser = cookieStore.get('currentUser')?.value;
  let user = null;
  try {
    user = currentUser ? JSON.parse(currentUser) : null;
  } catch (e) {
    console.error("Failed to parse user cookie", e);
  }
  return { token, user };
}

async function apiFetch(path, options = {}) {
  const { token } = await getAuth();
  const url = path.startsWith('http') ? path : `${db_url}${path}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!res.ok) {
      console.error(`API Error [${res.status}] at ${url}`);
      return { error: true, status: res.status };
    }

    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.error(`Fetch Exception at ${url}:`, error);
    return { error: true, message: error.message };
  }
}

// Service Functions
export async function getResidentData() {
  const { user } = await getAuth();
  const userId = user?._id || user?.id;
  if (!userId) return null;
  const data = await apiFetch(`/api/profile/${userId}`);
  return data?.error ? null : data;
}

export async function getAdminData() {
  const { user } = await getAuth();
  const userId = user?._id || user?.id;
  if (!userId) return { message: "No user data found, please login again" };
  const data = await apiFetch(`/api/admin/${userId}`);
  return data?.error ? null : data;
}

export async function getEmergencies() {
  const data = await apiFetch(`/api/emergency`);
  return data?.error ? [] : data;
}

export async function getSecurityLogs() {
  const data = await apiFetch(`/api/log`);
  return data?.error ? [] : data;
}

export async function getPendingInvites() {
  const { user } = await getAuth();
  if (!user?.id) return [];
  const data = await apiFetch(`/invites`);
  if (data?.error) return [];
  return Array.isArray(data) ? data.filter(item => item.residentId === user.id) : [];
}

export async function getAnnouncements() {
  const data = await apiFetch(`/api/announcement`);
  return data?.error ? [] : data;
}

export async function getServiceRequests() {
  const { user } = await getAuth();
  if (!user?.id) return [];
  const data = await apiFetch(`/api/request`);
  if (data?.error || !data?.docs) return [];
  return data.docs.filter(item => item.residentId === user.id);
}

export async function getPassHistory() {
  const data = await apiFetch(`/api/pass-history`);
  return data?.error ? [] : data;
}

export async function getResidentPassHistory() {
  const data = await apiFetch(`/api/pass-history`);
  return data?.error ? [] : data;
}

export async function getEntryExitLogs() {
  const data = await apiFetch(`/api/entry-exit-logs`);
  return data?.error ? [] : data;
}

export async function getEntryExitLogsResidents() {
  const data = await apiFetch(`/api/scan-history`);
  return data?.error ? [] : data;
}

export async function getBlacklist() {
  const data = await apiFetch(`/blacklist`);
  return data?.error ? [] : data;
}

export async function getLostAndFound() {
  const data = await apiFetch(`/api/lost-and-found`);
  return data?.error ? [] : data;
}

export async function getWorkers() {
  const data = await apiFetch(`/workers`);
  return data?.error ? [] : data;
}

export async function getWorkerById(id) {
  const data = await apiFetch(`/workers/${id}`);
  return data?.error ? null : data;
}

export async function getActiveBills() {
  const { user } = await getAuth();
  if (!user?.id) return [];
  const data = await apiFetch(`/active_bills`);
  if (data?.error) return [];
  return Array.isArray(data) ? data.filter(item => item.residentId === user.id) : [];
}

export async function getRecentTransactions() {
  const { user } = await getAuth();
  if (!user?.id) return [];
  const data = await apiFetch(`/recent_transactions`);
  if (data?.error) return [];
  return Array.isArray(data) ? data.filter(item => item.residentId === user.id) : [];
}

export async function getMaintenanceRequests() {
  const data = await apiFetch(`/maintenance_requests`);
  return data?.error ? [] : data;
}

export async function getResidentsMaintenanceRequests() {
  const { user } = await getAuth();
  if (!user?.id) return [];
  const data = await apiFetch(`/maintenance_requests`);
  if (data?.error) return [];
  return Array.isArray(data) ? data.filter(item => item.residentId === user.id) : [];
}

export async function getAllProfiles() {
  const data = await apiFetch(`/api/profile`);
  return data?.error ? [] : data;
}

export async function getAdminSecurityLogs() {
  const data = await apiFetch(`/admin_security_logs`);
  return data?.error ? [] : data;
}

export async function getInvoices() {
  const data = await apiFetch(`/api/invoice`);
  return data?.error ? [] : data;
}

export async function getTransactions() {
  const data = await apiFetch(`/api/transaction`);
  return data?.error ? [] : data;
}

export async function getResidentTransactions() {
  return getRecentTransactions();
}

export async function getResidents() {
  const data = await apiFetch(`/api/profile`);
  if (data?.error || !Array.isArray(data)) return [];
  return data.filter(u => u.type === 'resident');
}

export async function getUserById(id) {
  if (!id) return null;
  const data = await apiFetch(`/api/profile/${id}`);
  if (data?.error) return null;
  return (data && typeof data === 'object') ? data : null;
}

export async function getScanHistory() {
  const data = await apiFetch(`/api/scan`);
  return data?.error ? [] : data;
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  if (!sessionId) return null;
  const data = await apiFetch(`/sessions/${sessionId}`);
  return data?.error ? null : data;
}

export async function getAdminEmergencies() {
  const data = await apiFetch(`/api/emergency`);
  return data?.error ? [] : data;
}

export async function getEstateData() {
  const { user } = await getAuth();
  const estateId = user?.estateID;
  if (!estateId) return null;
  const data = await apiFetch(`/api/estates/${estateId}`);
  return data?.error ? null : data;
}

export async function getStaffMembers() {
  return getEstateData();
}