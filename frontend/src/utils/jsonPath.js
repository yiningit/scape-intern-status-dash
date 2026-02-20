// Resolves JSON path from user-entered string

// Converts eg. "status[0].description" into ["status", "0", "description"]
function normalisePath(pathString) {
  // Convert any bracket notation into dot notation: a[0].b -> a.0.b
  const dotted = pathString.replace(/\[(\d+)\]/g, '.$1');
  // Split on dots, filter empty (to avoid accidental leading/trailing dots)
  return dotted.split('.').filter(Boolean);
}

// Return data at JSON path
export function getByPath(obj, pathString) {
  if (!obj || !pathString) return undefined;   // early exit if either is null
  const parts = normalisePath(pathString);

  // Traverse JSON object
  let current = obj;
  for (const key of parts) {
    if (current === null) return undefined;   // early exit if traverse into null
    current = current[key]
  }

  return current;
}