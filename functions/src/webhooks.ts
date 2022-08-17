import { stripe } from "./api";
import Stripe from "stripe";
// import { db } from './firebase';
// import { firestore } from 'firebase-admin';
/**
 * Business logic for specific webhook event types
 */
async function webhookHandlers(event: Stripe.Event) {
  switch (event.type) {
    case "payment_intent.succeeded":
      // const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    case "checkout.session.completed":
      // Add your business logic here
      console.log("checkout.session.completed hook received!");
      break;

    case "payment_intent.succeeded":
      // Add your business logic here
      break;

    case "payment_intent.payment_failed":
      // Add your business logic here
      break;

    case "customer.subscription.deleted":
      console.log("customer.subscription.deleted hook received!");
      // const customer = (await stripe.customers.retrieve(
      //   data.customer as string
      // )) as Stripe.Customer;
      // const userId = customer.metadata.firebaseUID;
      // console.log('customer.subscription.deleted: userID:', userId);
      // const userRef = db.collection('users').doc(userId);
      // console.log('customer.subscription.deleted: data:', data);
      // await userRef.update({
      //   activePlans: firestore.FieldValue.arrayRemove(data.items.data[0].plan),
      // });
      break;

    case "customer.subscription.created":
      console.log("customer.subscription.created hook received!");
      // const customer = (await stripe.customers.retrieve(
      //   data.customer as string
      // )) as Stripe.Customer;
      // const userId = customer.metadata.firebaseUID;
      // const userRef = db.collection('users').doc(userId);

      // await userRef.update({
      //   activePlans: firestore.FieldValue.arrayUnion(data.items.data[0].plan),
      // });
      break;

    case "invoice.payment_succeeded":
      // Add your business logic here
      break;

    case "invoice.payment_failed":
      //   const customer = (await stripe.customers.retrieve(
      //     data.customer as string
      //   )) as Stripe.Customer;
      //   const userSnapshot = await db
      //     .collection('users')
      //     .doc(customer.metadata.firebaseUID)
      //     .get();
      //   await userSnapshot.ref.update({ status: 'PAST_DUE' });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }
}

/**
 * Validate the stripe webhook secret, then call the handler for the event type
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  const event = stripe.webhooks.constructEvent(
    req["rawBody"],
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  try {
    await webhookHandlers(event);
    res.send({ received: true });
  } catch (err: any) {
    console.error(err.message);
    res.status(400).send(`Webhook Error: ${err}`);
  }
};
