import * as functions from "firebase-functions";

// declaration of stripe had to be moved to another file because
// Firebase Functions doesn't allow any export in index.ts

// Deploy the /server/api code to Firebase Cloud Functions as an Express App
import { app } from "./api";
exports.app = functions.https.onRequest(app);

// OR use callable functions instead of Express
// They automatically decode the Auth token, no need to do it manually
// Also No need of API File in the server, we can use the helper functions directly
// import { createStripeCheckoutSession } from "./checkout";
// export const stripeCheckout = functions.https.onCall(async (data, context) => {
//   if (context.auth) {
//     // User is logged in
//   } else {
//     // User is NOT logged in
//   }

//   const checkoutSession = await createStripeCheckoutSession(data.line_items);
//   return checkoutSession;
// });
