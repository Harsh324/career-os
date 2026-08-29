const isServer = typeof window === "undefined";

export const getBaseURL = () => {
  if (isServer) {
    return (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace("localhost:8002", "backend:8000") ||
      "http://backend:8000/api/v1"
    );
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";
};

export const apiClient = {
  async get<T>(endpoint: string, config?: { params?: Record<string, string> }): Promise<{ data: T }> {
    let url = `${getBaseURL()}${endpoint}`;
    if (config?.params) {
      const searchParams = new URLSearchParams(config.params);
      url += `?${searchParams.toString()}`;
    }
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    const data = text ? JSON.parse(text) : ({} as T);
    return { data };
  },
  
  async post<T>(endpoint: string, body: any): Promise<{ data: T }> {
    const res = await fetch(`${getBaseURL()}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    const data = text ? JSON.parse(text) : ({} as T);
    return { data };
  },
};
