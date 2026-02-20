// utils/status/manualStatus.js

import { getByPath } from '../jsonPath.js';
import { classifyError } from '../http.js';

export function computeManualStatus(result, def) {
  const { _id: id, service, data } = def || {};
  const { path, success } = data || {};

  // Request failed
  if (result.status === "rejected") {
    return {
      id,
      service,
      status: `Error: ${classifyError(result.reason)}`,
      state: "error",
    };
  }

  const responseData = result.value.data;
  const statusValue = getByPath(responseData, path);

  if (statusValue === undefined) {
    return { id, service, status: "Unknown", state: "error" };
  }

  if (typeof statusValue === "boolean") {
    const isUp = statusValue === success;
    return {
      id,
      service,
      status: isUp ? "Operational" : "Not Operational",
      state: isUp ? "up" : "warn",
    };
  }

  const isUp = statusValue === success;

  return {
    id,
    service,
    status: statusValue,
    state: isUp ? "up" : "warn",
  };
}