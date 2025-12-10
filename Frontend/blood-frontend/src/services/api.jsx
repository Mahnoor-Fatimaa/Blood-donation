const API_URL = "http://localhost:8000";

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
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
  return res.json();
}

export async function getHistory(token, params = {}) {
  const url = new URL(`${API_URL}/auth/history`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
}

export async function getDonors(token) {
  const res = await fetch(`${API_URL}/donor/all`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
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
  return res.json();
}

export async function createRecipientRequest(token, userId, data) {
  const res = await fetch(`${API_URL}/recipient/?user_id=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getMatches(token, requestId) {
  const res = await fetch(`${API_URL}/recipient/matches/${requestId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.json();
}
