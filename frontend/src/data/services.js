const defaultServices = [
  {
    service: "SalesForce (AUS92)", 
    url: "https://status.salesforce.com/api/instances/AUS92/status/preview?locale=en", 
    path: "isActive",
    success: true,
  },
  {
    service: "StarRez", 
    url: "https://status.starrezcloud.io/api/v2/status.json", 
    path: "status.description",
    success: "All Systems Operational"
  },
  {
    service: "Atlassian", 
    url: "https://status.atlassian.com/api/v2/status.json", 
    path: "status.description",
    success: "All Systems Operational"
  },
  {
    service: "NetSuite", 
    url: "https://status.netsuite.com/api/v2/status.json", 
    path: "status.description",
    success: "All Systems Operational"
  },
  {
    service: "Microsoft 365 Apps", 
    url: "https://status.cloud.microsoft/api/posts/mac", 
    path: "Status",
    success: "Available"
  },
  {
    service: "Dayforce", 
    url: "https://uptime.com/graphql/?op=IsItDownService",   // this one doesn't work period
    path: null,
    success: "Available"
  }
];

export default defaultServices;