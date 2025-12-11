const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Add error handling helper
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function updateProfile(token, data) {
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

export async function getHistory(token, params = {}) {
  const url = new URL(`${API_URL}/auth/history`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url.toString(), {
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

export async function createDonorProfile(token, data) {
  const res = await fetch(`${API_URL}/donor/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

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

export async function getMatches(token, requestId) {
  const res = await fetch(`${API_URL}/recipient/matches/${requestId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return handleResponse(res);
}