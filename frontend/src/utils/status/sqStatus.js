import { classifyError } from '../http.js';

export function computeSpeedQueenStatus(result, def) {
  const { _id: id, service } = def || {};

  if (result.status === "rejected") {
    return {
      id,
      service,
      status: `Error: ${classifyError(result.reason)}`,
      state: "error",
    };
  }

  const json = result.value.data ?? {};
  const machines = Array.isArray(json?.data) ? json.data : [];
  const included = Array.isArray(json?.included) ? json.included : [];

  if (machines.length === 0) {
    return {
      id,
      service,
      status: "No machines found",
      state: "warn",
    };
  }

  let down = 0;
  for (const m of machines) {
    const machine_id = m?.id;

    // Find the corresponding status object in included
    const status_obj = included.find(
      (inc) => inc?.type === "current-statuses" && inc?.id === machine_id
    );

    const statusId = status_obj?.attributes?.statusId ?? "";
    const active = !(statusId === "UNAVAILABLE" || statusId.includes("ERROR"));   
     
    if (!active) down++;
  }

  if (down === 0) {
    return {
      id,
      service,
      status: `All ${machines.length} machines available`,
      state: "up",
    };
  }

  return {
    id,
    service,
    status: `${down} of ${machines.length} machines down`,
    state: "warn",
  };
}