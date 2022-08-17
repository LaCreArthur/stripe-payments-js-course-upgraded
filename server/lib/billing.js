"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSubscriptions = exports.cancelSubscription = exports.createSubscription = void 0;
const _1 = require(".");
const firebase_1 = require("./firebase");
const customers_1 = require("./customers");
const firebase_admin_1 = require("firebase-admin");
/**
 * Attaches a payment method to the Stripe customer,
 * subscribes to a Stripe plan, and saves the plan to Firestore
 */
async function createSubscription(userId, price, payment_method) {
    const customer = await (0, customers_1.getOrCreateCustomer)(userId);
    // Attach the payment method to the customer (new user)
    // Can be skipped if customer already attached one (returning user)
    await _1.stripe.paymentMethods.attach(payment_method, {
        customer: customer.id,
    });
    // Set it as the default payment method
    // Not necessary if user already have a default payment method
    await _1.stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: payment_method },
    });
    const subscription = await _1.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price }],
        expand: ['latest_invoice.payment_intent'],
    });
    const invoice = subscription.latest_invoice;
    const payment_intent = invoice.payment_intent;
    // Update the user's status
    if (payment_intent.status === 'succeeded') {
        await firebase_1.db
            .collection('users')
            .doc(userId)
            .set({
            stripeCustomerId: customer.id,
            // they can be subscribed to several plan potentially
            activePlans: firebase_admin_1.firestore.FieldValue.arrayUnion(price),
        }, { merge: true });
    }
    return subscription;
}
exports.createSubscription = createSubscription;
/**
 * Cancels an active subscription, syncs the data in Firestore
 */
async function cancelSubscription(userId, subscriptionId) {
    const customer = await (0, customers_1.getOrCreateCustomer)(userId);
    // prevent an user to cancel a subscription of another user
    if (customer.metadata.firebaseUID !== userId) {
        throw Error('Firebase UID does not match Stripe Customer');
    }
    const subscription = await _1.stripe.subscriptions.del(subscriptionId);
    // cancel at end of period
    // this needs a webhook to update firestore at the end of period
    // const subscription = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true})
    if (subscription.status === 'canceled') {
        await firebase_1.db
            .collection('users')
            .doc(userId)
            .update({
            activePlans: firebase_admin_1.firestore.FieldValue.arrayRemove(subscription.items.data[0].price.id),
        });
    }
    return subscription;
}
exports.cancelSubscription = cancelSubscription;
/**
 * Returns all the subscriptions linked to a Firebase userID in Stripe
 */
async function listSubscriptions(userId) {
    const customer = await (0, customers_1.getOrCreateCustomer)(userId);
    const subscriptions = await _1.stripe.subscriptions.list({
        customer: customer.id,
    });
    return subscriptions;
}
exports.listSubscriptions = listSubscriptions;
//# sourceMappingURL=billing.js.map