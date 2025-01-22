export const config = {
  clientId: "",
  clientSecret: "",
  tenantId: "",
  redirectUri: "https://app-dev.build.zuzocard.com/", 
  graphApiEndpoint: "https://graph.microsoft.com/v1.0",
  emailSubjectPattern: "You have requested to log in to Zuzo",
  senderEmail: "hello@zuzocard.com",
  scope: "https://graph.microsoft.com/.default",
  graphApiBaseUrl: "https://graph.microsoft.com/v1.0",
  graphApiToken: process.env.GRAPH_API_TOKEN || "your-token-here",
  credentials: {
    email: "kaviraj.meetooa@yoyogroup.com",
    password: "",
  },
  baseUrl: "https://app-dev.build.zuzocard.com/", 
};
