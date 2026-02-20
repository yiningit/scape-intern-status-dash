// Used to reset database to defaults

export const DEFAULT_SERVICES = [
  {
    service: "SalesForce (AUS92)",
    url: "https://status.salesforce.com/api/instances/AUS92/status/preview?locale=en",
    type: "manual",
    data: {
      path: "isActive",
      success: true,
    },
  },
  {
    service: "StarRez",
    url: "https://status.starrezcloud.io/api/v2/status.json",
    type: "manual",
    data: {
      path: "status.description",
      success: "All Systems Operational",
    },
  },
  {
    service: "Atlassian",
    url: "https://status.atlassian.com/api/v2/status.json",
    type: "manual",
    data: {
      path: "status.description",
      success: "All Systems Operational",
    },
  },
  {
    service: "NetSuite",
    url: "https://status.netsuite.com/api/v2/status.json",
    type: "manual",
    data: {
      path: "status.description",
      success: "All Systems Operational",
    },
  },
  {
    service: "Microsoft 365 Apps",
    url: "https://status.cloud.microsoft/api/posts",
    type: "manual",
    data: {
      path: "Status",
      success: "Available",
    },
  },
  {
    service: "Dayforce",
    url: "https://uptime.com/graphql/?op=IsItDownService", // this one doesn't work period
    type: "manual",
    data: {
      path: null,
      success: "Available",
    },
  },
];