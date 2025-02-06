// src/config.ts
export const config = {
  graphApiBaseUrl: "https://graph.microsoft.com/v1.0",
  loginemailSubject: "You have requested to log in to Zuzo",  
  senderEmail: "hello@zuzocard.com", 
  scope: 'https://graph.microsoft.com/.default',
  baseUrl: 'https://app-dev.build.zuzocard.com/',
  registrationUrl : 'https://app-dev.build.zuzocard.com/create-account/',
  paymentMethodsUrl : 'https://app-dev.build.zuzocard.com/dashboard/create-rewards',
  credentials: {
    email: "AutomationUser@yoyogroup.com", 
  },
  validCard : "4000000000000002",
  expiryDate : "05/29",
  cvv : "234"
};
