import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { fecthFromAPI } from "./helper";

function Payments() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(0);
  const [paymentIntent, setPaymmentIntent] = useState();

  const createPaymentIntent = async (event) => {
    const validAmount = Math.min(Math.max(amount, 50), 9999999);
    setAmount(validAmount);

    const pi = await fecthFromAPI("payments", {
      body: { amount: validAmount },
    });

    setPaymmentIntent(pi);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent: updatedPaymentIntent, error } =
      await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: { card: cardElement },
      });

    if (error) {
      console.error(error);
      error.payment_intent && setPaymmentIntent(error.payment_intent);
    } else {
      setPaymmentIntent(updatedPaymentIntent);
    }
  };

  return (
    <>
      <h2>Payments</h2>
      <p>One-time payment scenario.</p>
      <div className="well">
        <PaymentIntentData data={paymentIntent} />
      </div>

      <div className="well">
        <h3>Step 1: Create a Payment Intent</h3>
        <p>
          Change the amount of the payment in the form, then request a Payment
          Intent to create context for one-time payment. Min 50, Max 9999999
        </p>

        <div className="form-inline">
          <input
            className="form-control mx-auto"
            style={{ width: "170px" }}
            type="number"
            value={amount}
            disabled={paymentIntent}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="btn btn-success"
            disabled={amount <= 0}
            onClick={createPaymentIntent}
            hidden={paymentIntent}
          >
            Ready to Pay ${(amount / 100).toFixed(2)}
          </button>
        </div>
      </div>
      <hr />
      <form
        className="well"
        onSubmit={handleSubmit}
        hidden={!paymentIntent || paymentIntent.status === "succeeded"}
      >
        <h3>Step 2: Submit a Payment Method</h3>
        <p>Collect credit card details, then submit the payment.</p>
        <p>
          Normal Card: <code>4242424242424242</code>
        </p>
        <p>
          3D Secure Card: <code>4000002500003155</code>
        </p>

        <hr />
        <CardElement />
        <button className="btn btn-success" type="submit">
          Pay
        </button>
      </form>
    </>
  );
}

function PaymentIntentData(props) {
  if (props.data) {
    const { id, amount, status, client_secret } = props.data;
    return (
      <>
        <h3>
          Payment Intent{" "}
          <span
            className={
              "badge " +
              (status === "succeeded" ? "text-bg-success" : "text-bg-secondary")
            }
          >
            {status}
          </span>
        </h3>
        <pre>
          ID: {id} <br />
          Client Secret: {client_secret} <br />
          Amount: {amount} <br />
          Status:{status}
          <br />
        </pre>
      </>
    );
  } else {
    return <p>Payment Intent Not Created Yet</p>;
  }
}

export default Payments;
