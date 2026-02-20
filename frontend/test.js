import axios from 'axios';

// axios({method:'get', url:'https://status.starrezcloud.io/api/v2/status.json'}).then(response => {
//     let data = response.data;
//     let path = "status.description";
//     console.log(getByPath(data, path));
// });

// AXIOS.get("https://status.cloud.microsoft/api/posts/mac")
//     .then(res => {
//         console.log(res.data.Status);
//     });

import { formatJson } from './src/utils/jsonTreeFormatter';


const data = {
  page: {
    id: "jbt6k9g57c34",
    name: "Oracle NetSuite Service",
    url: "https://status.netsuite.com"
  },
  status: {
    indicator: "none",
    description: "All Systems Operational"
  }
};


const treeItems = formatJson(data, "root");

console.log(treeItems);



// DO NOT DELETE - REFERENCE FOR SERVICES
// // Default services
// const defaultServices = [
//   {
//     service: "SalesForce", 
//     url: "https://status.salesforce.com/api/instances/AUS92/status/preview?locale=en", 
//     path: "isActive",
//     success: true,
//   },
//   {
//     service: "StarRez", 
//     url: "https://status.starrezcloud.io/api/v2/status.json", 
//     path: "status.description",
//     success: "All Systems Operational"
//   },
//   {
//     service: "Atlassian", 
//     url: "https://status.atlassian.com/api/v2/status.json", 
//     path: "status.description",
//     success: "All Systems Operational"
//   },
//   {
//     service: "NetSuite", 
//     url: "https://status.netsuite.com/api/v2/status.json", 
//     path: "status.description",
//     success: "All Systems Operational"
//   },
//   {
//     service: "Microsoft 365 Apps", 
//     url: "https://status.cloud.microsoft/api/posts/mac", 
//     path: "Status",
//     success: "Available"
//   },
//   {
//     service: "Dayforce", 
//     url: "https://uptime.com/graphql/?op=IsItDownService",   // this one doesn't work period
//     path: null,
//     success: "Available"
//   }
// ];
