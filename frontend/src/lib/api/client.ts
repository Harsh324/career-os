import axios from "axios";

const isServer = typeof window === "undefined";

const getBaseURL = () => {
  if (isServer) {
    return (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace("localhost:8002", "backend:8000") ||
      "http://backend:8000/api/v1"
    );
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
