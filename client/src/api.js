const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const serverUrl =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
export function token() {
  return localStorage.getItem("house_token") || "";
}
export async function api(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  let res;

  try {
    console.log("API URL:", `${API}${path}`);

    res = await fetch(`${API}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("API connection failed:", error);
    console.error("API base URL:", API);

    throw new Error(
      `Cannot connect to backend at ${API}. Check server and API URL.`,
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
export function money(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(0);
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
