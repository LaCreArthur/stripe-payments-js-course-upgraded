import { stripe } from "./api";
import { db } from "./firebase";
import Stripe from "stripe";
import { getOrCreateCustomer } from "./customers";
import { firestore } from "firebase-admin";

/**
 * Attaches a payment method to the Stripe customer,
 * subscribes to a Stripe plan, and saves the plan to Firestore
 */
export async function createSubscription(
  userId: string,
  price: string,
  payment_method: string
) {
  const customer = await getOrCreateCustomer(userId);

  // Attach the payment method to the customer (new user)
  // Can be skipped if customer already attached one (returning user)
  await stripe.paymentMethods.attach(payment_method, {
    customer: customer.id,
  });

  // Set it as the default payment method
  // Not necessary if user already have a default payment method
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: payment_method },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price }],
    expand: ["latest_invoice.payment_intent"],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;

  // Update the user's status
  if (payment_intent.status === "succeeded") {
    await db
      .collection("users")
      .doc(userId)
      .set(
        {
          stripeCustomerId: customer.id,
          // they can be subscribed to several plan potentially
          activePlans: firestore.FieldValue.arrayUnion(price),
        },
        { merge: true }
      );
  }

  return subscription;
}

/**
 * Cancels an active subscription, syncs the data in Firestore
 */
export async function cancelSubscription(
  userId: string,
  subscriptionId: string
) {
  const customer = await getOrCreateCustomer(userId);

  // prevent an user to cancel a subscription of another user
  if (customer.metadata.firebaseUID !== userId) {
    throw Error("Firebase UID does not match Stripe Customer");
  }
  const subscription = await stripe.subscriptions.del(subscriptionId);

  // cancel at end of period
  // this needs a webhook to update firestore at the end of period
  // const subscription = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true})

  if (subscription.status === "canceled") {
    await db
      .collection("users")
      .doc(userId)
      .update({
        activePlans: firestore.FieldValue.arrayRemove(
          subscription.items.data[0].price.id
        ),
      });
  }

  return subscription;
}

/**
 * Returns all the subscriptions linked to a Firebase userID in Stripe
 */
export async function listSubscriptions(userId: string) {
  const customer = await getOrCreateCustomer(userId);
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
  });

  return subscriptions;
}
