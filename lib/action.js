'use server'

import { cookies } from 'next/headers'

const db_url = process.env.DB_URL

export async function saveAnnouncement(announcement) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const currentUser = cookieStore.get('currentUser')?.value;
    const user = currentUser ? JSON.parse(currentUser) : null;

    const res = await fetch(`${db_url}/api/announcement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        title: announcement.title,
        message: announcement.message,
        type: announcement.type,
        author: user?.name || 'Admin',
        estateID: user?.estateID || 'EST-001'
      }),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to save announcement' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
export async function readAnnouncement(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const currentUser = cookieStore.get('currentUser')?.value;
    const user = currentUser ? JSON.parse(currentUser) : null;

    const res = await fetch(`${db_url}/api/announcement/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        readBy:user,
      })
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to update read status' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


export async function sendEmergencyAlert(alert) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/emergencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(alert),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to send alert' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function verifyVisitorPass(code, pin) {
  const data = []
  return data
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('currentUser')
  cookieStore.delete('sessionId')
  return { success: true, data: 'Logged out successfully' };
}

export async function submitWorkLog(log) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/work`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(log),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to submit log' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function savePassToHistory(passData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/pass_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(passData),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to save pass' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function addToBlacklist(visitor) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/blacklist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(visitor),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to add to blacklist' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function removeFromBlacklist(index) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/blacklist/${index}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) {
       const data = await res.json();
       return { success: false, message: data.message || 'Failed to remove from blacklist' };
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function logEntryExit(log) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/entry_exit_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(log),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to log entry/exit' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function submitLostAndFound(lostAndFound) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('currentUser')
    let user = null
    
    if (userCookie) {
      user = JSON.parse(userCookie.value)
    }

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
    console.log(enrichedData);

    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/api/lost-and-found`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(enrichedData),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to submit report' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function bookService(service) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/service_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(service),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to book service' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function submitMaintenanceRequest(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/maintenance_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(request),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to submit maintenance request' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateMaintenanceRequest(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/maintenance_requests/${encodeURIComponent(request.id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(request),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to update request' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
export async function updateProfile(profile) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/users/${encodeURIComponent(profile.id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(profile),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to update profile' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteProfile(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.message || 'Failed to delete profile' };
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
export async function editProfile(profile) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/users/${encodeURIComponent(profile.id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(profile),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to edit profile' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


export async function logSecurityIncident(incident) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/admin_security_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(incident),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to log incident' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function validatePass(codeOrId, pin) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    // 1. Fetch pass history
    const historyRes = await fetch(`${db_url}/pass_history`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    const history = await historyRes.json()

    // 2. Find matching pass (either by id or passCode)
    const pass = history.find(p => p.id === codeOrId || p.passCode === codeOrId)

    if (!pass) {
      throw new Error('Invalid Pass: Credentials not found in system')
    }

    // 3. Verify PIN if required
    if (pass.pin && String(pass.pin) !== String(pin)) {
      throw new Error('Security Alert: PIN does not match. Access Denied.')
    }

    if (pass.status === 'scanned') {
      throw new Error('Invalid Pass: This code has already been scanned')
    }

    // 3. Update the pass record
    const updateRes = await fetch(`${db_url}/pass_history/${encodeURIComponent(pass.id)}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        status: 'scanned',
        securityVerified: true,
        scannedAt: new Date().toISOString()
      })
    })

    const updatedPass = await res.json()
    if (!res.ok) throw new Error(updatedPass.message || 'Failed to update pass')
    return { success: true, data: updatedPass }


  } catch (error) {
    return { success: false, message: error.message }
  }
}

export async function addToScanHistory(scanData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/scan_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        ...scanData,
        timestamp: new Date().toISOString()
      }),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to log scan' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function handleUserLogin(email, password) {
  try {
    const res = await fetch(`${db_url}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    const data = await res.json()

    if(data.status === false) {
      return { success: false, message: data.message }
    }
    const cookieStore = await cookies()
    
    // Extract user data and token (handling potential nesting)
    const token = data.token;

    const user = data.data || data.user || data;

    cookieStore.set('currentUser', JSON.stringify(user), { path: '/' })
    
    if (token) {
      cookieStore.set('session_token', token, { path: '/', httpOnly: true, secure: true })
    }
    
    return { success: true, user: data }

  } catch (error) {
    console.error('Error during login:', error)
    return { success: false, message: error.message || 'Login failed. Please check your credentials.' }
  }
}

export async function handleAdminLogin(email, password) {
  try {
    const res = await fetch(`${db_url}/auth/login/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    const data = await res.json()
    if(data.success === false){
      return {success: false, message: data.message}
    }
    const cookieStore = await cookies()
    const token = data.token
    const user = data.data || data.user || data;
    cookieStore.set('currentUser', JSON.stringify(user), { path: '/' })
    if (token) {
      cookieStore.set('session_token', token, { path: '/', httpOnly: true, secure: true })
    }
    return { success: true, user: data }
  } catch (error) {
    console.log(error);
  }
}

export async function handleCreateUser(userData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/auth/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(userData),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to create user' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


export async function updateEmergencyContacts(id, contacts) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        contacts: contacts,
      })  })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to update contacts' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function resolveLostAndFound(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/lost_and_found/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      })
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to resolve item' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function resolveServiceRequest(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/service_requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      })
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to resolve request' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function resolveEmergency(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/emergencies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      })
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to resolve emergency' };
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
export async function removeAnnouncement(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await fetch(`${db_url}/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
    if (!res.ok) {
       const data = await res.json();
       return { success: false, message: data.message || 'Failed to delete announcement' };
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateLostAndFoundAction(id, type) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('currentUser')
  
  if (!userCookie) {
    throw new Error('Unauthorized: No user session found')
  }

  const user = JSON.parse(userCookie.value)
  
  const token = cookieStore.get('session_token')?.value;
  
  // 1. Fetch item details first
  const itemRes = await fetch(`${db_url}/api/lost-and-found/${id}`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  })
  const item = await itemRes.json()

  // 2. Mark as resolved with appropriate actor
  const updateData = {
    resolved: true,
    resolvedAt: new Date().toISOString()
  }

  if (type === 'claim') {
    updateData.claimedBy = user || "Admin"
  } else {
    updateData.foundBy = user || "Admin"
  }

    const res = await fetch(`${db_url}/api/lost-and-found/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(updateData),
    })
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message || 'Failed to update action' };

  // 3. Send notification to admin (log to admin_security_logs)
  const now = new Date()
  const isFoundReport = item.status === 'lost'
  await fetch(`${db_url}/admin_security_logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
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
  })

  return { success: true, data }
  
}