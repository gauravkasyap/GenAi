const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const JSON_HEADERS = { "Content-Type": "application/json" };

function withBase(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

export async function requestJson(path, options = {}, cacheKey = null) {
  const response = await fetch(withBase(path), options);
  const contentType = response.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage = typeof data === "object" && data?.error
      ? data.error
      : typeof data === "string" && data.trim()
        ? data.trim()
        : `Request failed: ${response.status}`;
    throw new Error(errorMessage);
  }

  if (cacheKey && data && typeof data === "object") {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  }

  return data;
}

export function fetchBootstrap(cacheKey = null) {
  return requestJson("/api/bootstrap", {}, cacheKey);
}

export function fetchBooks(userEmail) {
  return requestJson(`/api/books?user=${encodeURIComponent(userEmail)}`);
}

export function uploadBook(payload) {
  return requestJson("/api/books/upload", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export function removeBook(payload) {
  return requestJson("/api/books/remove", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export function confirmBook(payload) {
  return requestJson("/api/books/confirm", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export function queryBook(payload) {
  return requestJson("/api/books/query", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export function analyzeSymptoms(payload) {
  return requestJson("/api/analyze", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export function explainPrescriptionRequest(payload) {
  return requestJson("/api/prescription/explain", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export function searchHospitals({ language, state, district, specialty }) {
  const params = new URLSearchParams({ language });
  if (state) params.set("state", state);
  if (district) params.set("district", district);
  if (specialty) params.set("specialty", specialty);
  return requestJson(`/api/hospitals?${params.toString()}`);
}
