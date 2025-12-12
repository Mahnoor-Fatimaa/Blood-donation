const API_URL = "http://127.0.0.1:8000";

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "API request failed");
  }
  return res.json();
}

// --- AUTH ---
export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// --- PROFILE ---
export async function getProfile(token) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function updateUserProfile(token, data) {
  const res = await fetch(`${API_URL}/auth/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// --- DASHBOARD & STATS ---
export async function getDashboardStats(token) {
  const res = await fetch(`${API_URL}/stats/dashboard`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function getHistory(token) {
  const res = await fetch(`${API_URL}/auth/history`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function getDonors(token) {
  const res = await fetch(`${API_URL}/donor/all`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return handleResponse(res);
}

// --- REQUESTS ---
export async function createRecipientRequest(token, data) {
  const res = await fetch(`${API_URL}/recipient/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}


// ... existing code ...

export async function logDonation(token, data) {
  const res = await fetch(`${API_URL}/history/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}