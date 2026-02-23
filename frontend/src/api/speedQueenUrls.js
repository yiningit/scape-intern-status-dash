// Build URLs for GET requests

// Build GET URL for available buildings/organisations
export const buildOrganisationsUrl = (userId) => {
    if (!userId) return;
    const orgs_url = `https://platform.sqinsights.com/users/${userId}/organizations`;
    return orgs_url;
};

// Build GET URL for building's rooms
export const buildRoomsUrl = (orgId) => {
    if (!orgId) return;
    const rooms_url = `https://platform.sqinsights.com/paywall/organizations/${orgId}/locations`;
    return rooms_url;
};

// Build GET URL for machine statuses
export const buildStatusUrl = (roomId) => {
    if (!roomId) return;
    const status_url = `https://api.sqinsights.com/rooms/${roomId}/machines?roomId=${roomId}`;
    return status_url;
};
