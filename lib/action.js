"use server";

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

const db_url = process.env.DB_URL
const base_url = process.env.BASE_URL

if (!db_url) {
  throw new Error('DB_URL environment variable is not set')
}

// Helper function to get auth headers
async function getAuthHeaders(includeJson = true) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
}

// Helper function to get current user
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

// Helper for consistent fetch responses
async function handleFetchResponse(res, defaultErrorMessage = 'Operation failed') {
  try {
    const data = await res.json();
    if (data.success === false) {
      return { success: false, message: data.message || data.errors[0] || defaultErrorMessage };
    }
    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, message: error.message || defaultErrorMessage };
  }
}

export async function saveAnnouncement(announcement) {
  try {
    const headers = await getAuthHeaders(true);
    const user = await getCurrentUser();
    
    const res = await fetch(`${db_url}/api/announcement`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: announcement.title,
        message: announcement.message,
        type: announcement.type,
        author: user?.name || 'Admin',
        estateID: user?.estateID || 'EST-001'
      }),
    })
    return await handleFetchResponse(res, 'Failed to save announcement');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function readAnnouncement(id) {
  try {
    const headers = await getAuthHeaders(true);
    const user = await getCurrentUser();
    
    const res = await fetch(`${db_url}/api/announcement/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        readBy: user,
      })
    })
    return await handleFetchResponse(res, 'Failed to update read status');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function sendEmergencyAlert(alert) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/api/emergency`, {
      method: 'POST',
      headers,
      body: JSON.stringify(alert),
    })
    return await handleFetchResponse(res, 'Failed to send alert');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function verifyVisitorPass(code, pin) {
  // TODO: Implement this function
  return { success: false, message: 'Not implemented yet' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('currentUser');
  cookieStore.delete('sessionId');
  cookieStore.delete('session_token');
  return { success: true, data: 'Logged out successfully' };
}

export async function submitWorkLog(log) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/work`, {
      method: 'POST',
      headers,
      body: JSON.stringify(log),
    })
    return await handleFetchResponse(res, 'Failed to submit log');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function savePassToHistory(passData) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/pass_history`, {
      method: 'POST',
      headers,
      body: JSON.stringify(passData),
    })
    return await handleFetchResponse(res, 'Failed to save pass');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function addToBlacklist(visitor) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/blacklist`, {
      method: 'POST',
      headers,
      body: JSON.stringify(visitor),
    })
    return await handleFetchResponse(res, 'Failed to add to blacklist');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function removeFromBlacklist(index) {
  try {
    const headers = await getAuthHeaders(false);
    const res = await fetch(`${db_url}/blacklist/${index}`, {
      method: 'DELETE',
      headers
    })
    return await handleFetchResponse(res, 'Failed to remove from blacklist');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function logEntryExit(log) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/entry_exit_logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(log),
    })
    return await handleFetchResponse(res, 'Failed to log entry/exit');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function submitLostAndFound(lostAndFound) {
  try {
    const cookieStore = await cookies();
    const user = await getCurrentUser();

    const enrichedData = {
      icon: lostAndFound.icon || 'unknown',
      type: lostAndFound.status || 'unknown',
      name: lostAndFound.name || 'unknown',
      category: lostAndFound.category || 'unknown',
      location: lostAndFound.location || 'unknown',
      date: lostAndFound.date || 'unknown',
      image: lostAndFound.image || '',
      description: lostAndFound.description || 'unknown',
      resolved: false,
      foundBy: lostAndFound.status === 'found' ? (user?.name || 'Security') : 'Resident',
      claimedBy: 'System',
      residentID: user?.residentID || user?._id || user?.id || "unknown",
      estateID: user?.estateID || "unknown"
    }
    
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/api/lost-and-found`, {
      method: 'POST',
      headers,
      body: JSON.stringify(enrichedData),
    })
    return await handleFetchResponse(res, 'Failed to submit report');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function bookService(service) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/service_requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify(service),
    })
    return await handleFetchResponse(res, 'Failed to book service');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function submitMaintenanceRequest(request) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/api/request`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    })
    return await handleFetchResponse(res, 'Failed to submit maintenance request');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateMaintenanceRequest(request) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/maintenance_requests/${encodeURIComponent(request.id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(request),
    })
    return await handleFetchResponse(res, 'Failed to update request');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateProfile(profile) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/users/${encodeURIComponent(profile.id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(profile),
    })
    return await handleFetchResponse(res, 'Failed to update profile');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteProfile(id) {
  try {
    const headers = await getAuthHeaders(false);
    const res = await fetch(`${db_url}/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    })
    return await handleFetchResponse(res, 'Failed to delete profile');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function editProfile(profile) {
  return await updateProfile(profile); // Reuse updateProfile
}

export async function logSecurityIncident(incident) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/admin_security_logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(incident),
    })
    return await handleFetchResponse(res, 'Failed to log incident');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function validatePass(codeOrId, pin) {
  try {
    const headers = await getAuthHeaders(false);
    
    // 1. Fetch pass history
    const historyRes = await fetch(`${db_url}/pass_history`, { headers });
    const historyData = await historyRes.json();
    const history = historyData.data || historyData || [];

    // 2. Find matching pass (either by id or passCode)
    const pass = history.find(p => p.id === codeOrId || p.passCode === codeOrId);

    if (!pass) {
      return { success: false, message: 'Invalid Pass: Credentials not found in system' };
    }

    // 3. Verify PIN if required
    if (pass.pin && String(pass.pin) !== String(pin)) {
      return { success: false, message: 'Security Alert: PIN does not match. Access Denied.' };
    }

    if (pass.status === 'scanned') {
      return { success: false, message: 'Invalid Pass: This code has already been scanned' };
    }

    // 4. Update the pass record
    const updateHeaders = await getAuthHeaders(true);
    const updateRes = await fetch(`${db_url}/pass_history/${encodeURIComponent(pass.id)}`, {
      method: 'PATCH',
      headers: updateHeaders,
      body: JSON.stringify({
        status: 'scanned',
        securityVerified: true,
        scannedAt: new Date().toISOString()
      })
    });

    return await handleFetchResponse(updateRes, 'Failed to update pass');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function addToScanHistory(scanData) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/scan_history`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...scanData,
        timestamp: new Date().toISOString()
      }),
    })
    return await handleFetchResponse(res, 'Failed to log scan');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function handleUserLogin(email, password) {
  try {
    const res = await fetch(`${db_url}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    const data = await res.json();

    console.log(data)

    if (!res.ok || data.status === false) {
      return { success: false, message: data.errors[0] || 'Login failed' };
    }

    const cookieStore = await cookies();
    const token = data.token;
    const user = data.data || data.user || data;

    cookieStore.set('currentUser', JSON.stringify(user), { 
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    if (token) {
      cookieStore.set('session_token', token, { 
        path: '/', 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    return { success: true, user: data };
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: error.message || 'Login failed. Please check your credentials.' };
  }
}

export async function handleAdminLogin(email, password) {
  try {
    const res = await fetch(`${db_url}/auth/login/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    const data = await res.json();
    
    if (!res.ok || data.success === false) {
      return { success: false, message: data.message || 'Admin login failed' };
    }
    
    const cookieStore = await cookies();
    const token = data.token;
    const user = data.data || data.user || data;
    
    cookieStore.set('currentUser', JSON.stringify(user), { 
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    if (token) {
      cookieStore.set('session_token', token, { 
        path: '/', 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    return { success: true, user: data };
  } catch (error) {
    console.error('Error during admin login:', error);
    return { success: false, message: error.message || 'Admin login failed' };
  }
}

export async function handleCreateUser(payload) {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
    console.log(await res.json())
    return await handleFetchResponse(res, 'Failed to create user');
  
}

export async function handleCreateWorker(workerData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, message: 'Authentication required' };
    }
    
    const estateID = user.estateID;

    // Derived fields and formatting
    const initials = workerData.name 
      ? workerData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'W';
      
    const formattedRate = workerData.rate 
      ? (workerData.rate.startsWith('₦') ? (workerData.rate.includes('/hr') ? workerData.rate : `${workerData.rate}/hr`) : `₦${workerData.rate}/hr`)
      : '₦0/hr';

    const processedSkills = typeof workerData.skills === 'string'
      ? workerData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      : (Array.isArray(workerData.skills) ? workerData.skills : []);

    const payload = {
      ...workerData,
      estateID,
      initials,
      color: workerData.color || 'bg-violet-500',
      rate: formattedRate,
      skills: processedSkills,
      verified: workerData.verified || false,
      rating: workerData.rating || 0,
      jobs: workerData.jobs || "0",
      image: null
    };

    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/api/worker`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    const result = await handleFetchResponse(res, 'Failed to create worker');
    if (result.success) {
      result.message = 'Service worker created successfully';
    }
    return result;
  } catch (error) {
    console.error('Create worker error:', error);
    return { success: false, message: error.message };
  }
}

export async function updateEmergencyContacts(contact) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'Authentication required' };
    }
    
    const id = user._id;
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/api/profile/${id}/contacts`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(contact)
    });
    
    return await handleFetchResponse(res, 'Failed to update contacts');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function resolveLostAndFound(id) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/lost_and_found/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      })
    });
    return await handleFetchResponse(res, 'Failed to resolve item');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function resolveServiceRequest(id) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/service_requests/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      })
    });
    return await handleFetchResponse(res, 'Failed to resolve request');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function resolveEmergency(id) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/emergencies/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      })
    });
    return await handleFetchResponse(res, 'Failed to resolve emergency');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function removeAnnouncement(id) {
  try {
    const headers = await getAuthHeaders(false);
    const res = await fetch(`${db_url}/announcements/${id}`, {
      method: 'DELETE',
      headers
    });
    return await handleFetchResponse(res, 'Failed to delete announcement');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateLostAndFoundAction(id, type) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: 'Unauthorized: No user session found' };
    }
    
    const headers = await getAuthHeaders(false);
    
    // 1. Fetch item details first
    const itemRes = await fetch(`${db_url}/api/lost-and-found/${id}`, { headers });
    const itemData = await itemRes.json();
    const item = itemData.data || itemData;

    // 2. Mark as resolved with appropriate actor
    const updateData = {
      resolved: true,
      resolvedAt: new Date().toISOString()
    };

    if (type === 'claim') {
      updateData.claimedBy = user.name || 'Admin';
    } else {
      updateData.foundBy = user.name || 'Admin';
    }

    const patchHeaders = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/api/lost-and-found/${id}`, {
      method: 'PATCH',
      headers: patchHeaders,
      body: JSON.stringify(updateData),
    });
    
    const result = await handleFetchResponse(res, 'Failed to update action');
    if (!result.success) return result;

    // 3. Send notification to admin (log to admin_security_logs)
    const now = new Date();
    const isFoundReport = item.status === 'lost';
    const logHeaders = await getAuthHeaders(true);
    
    await fetch(`${db_url}/admin_security_logs`, {
      method: 'POST',
      headers: logHeaders,
      body: JSON.stringify({
        date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: isFoundReport ? "Lost Item Found" : "Found Item Claimed",
        typeId: "lost_found",
        icon: isFoundReport ? "CheckCircle2" : "Tag",
        iconColor: "bg-emerald-500/10 text-emerald-500",
        location: item.location || "N/A",
        sub: isFoundReport 
          ? `${item.name} reported found by ${user?.name || 'Resident'}`
          : `${item.name} claimed by ${user?.name || 'Resident'}`,
        severity: "Low",
        status: "Resolved"
      })
    });

    return result;
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function assignWorkerToRequest(id, workerId, residentId) {
  const payload = {
    serviceWorkerId: workerId,
    assigned: true,
    status: 'In Progress'
  };
  
  try {
    const headers = await getAuthHeaders(true);
    
    // 1. Update the service request with the assigned worker
    const res = await fetch(`${db_url}/api/request/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload)
    });
    
    const requestResult = await handleFetchResponse(res, 'Failed to update request');
    if (!requestResult.success) return requestResult;

    // 2. Assign the job to the worker's history/assigned list
    const workerRes = await fetch(`${db_url}/api/worker/${workerId}/assign`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        requestId: id,
        residentId: residentId,
        assignedAt: new Date().toISOString(),
        status: 'Active'
      })
    });
    
    return await handleFetchResponse(workerRes, 'Failed to update worker assignment');
  } catch (error) {
    console.error('Assignment error:', error);
    return { success: false, message: error.message };
  }
}

export async function handleEstateCompleteRegistration(formData,token) {
  const payload = formData
  console.log(payload);

  try {
    const res = await fetch(`${db_url}/auth/complete-registration?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    return await handleFetchResponse(res, 'Registration failed');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function handleResidentRequest(formData, type) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/api/${type}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    });
    
    return await handleFetchResponse(res, 'Request failed');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function handleResidentRequestDecision(id, decision) {
  try {
    const headers = await getAuthHeaders(true);
    const res = await fetch(`${db_url}/api/resident-request/${id}/decision`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ decision }),
    });
    return await handleFetchResponse(res, 'Failed to update request');
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function Logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  cookieStore.delete('currentUser');
  cookieStore.delete('sessionId');
  cookieStore.delete('token');
  
  return { success: true, message: 'Logged out successfully' };
}

export async function sendJoinRequest(estateId) {
  console.log(estateId)
  const payload = {
    estateId: estateId,
    
  };

  try {
    const res = await fetch(`${db_url}/estate-join-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await handleFetchResponse(res, 'Failed to send join request');
  } catch (error) {
    return { success: false, message: error.message };
  }
}
///////////////////////////////////////////////

export async function handleLogout() {
  const res = await fetch(`${db_url}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleFetchResponse(res, 'Failed to logout');
}

export async function refreshAccessToken() {
  const res = await fetch(`${db_url}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });   
  const data = await res.json();
  if (!res.ok || data.success === false) {
    return { success: false, message: data.message || 'Login failed' };
  }
  
    const cookieStore = await cookies();
    const token = data.token;
    const user = data.data || data.user || data;

    cookieStore.set('currentUser', JSON.stringify(user), { 
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    if (token) {
      cookieStore.set('session_token', token, { 
        path: '/', 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
  return {success, data};
}
  

export async function estateJoinRequest(formData) {

    const payload = formData
  console.log(payload);

  try {
    const res = await fetch(`${db_url}/estate-join-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    return await handleFetchResponse(res, 'Registration failed');
  } catch (error) {
    return { success: false, message: error.message };
  }
}
