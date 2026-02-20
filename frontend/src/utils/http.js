// Handles troubleshooting for fetch errors

import axios from 'axios';

export function classifyError(err) {
  if (!axios.isAxiosError(err)) return 'Unknown error';
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') return 'Timeout';
  if (err.response) return `HTTP ${err.response.status}`;
  if (err.request && !err.response) return 'Network/CORS';
  return 'Unknown';
};

export function getServerError(err, fallback = "Something went wrong") {
  // Axios error shapes
  const data = err?.response?.data;
  return (
    data?.error || data?.message || err?.message || fallback
  );
}