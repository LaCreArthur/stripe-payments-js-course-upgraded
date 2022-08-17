import { useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { fecthFromAPI } from "./helper";

export function Checkout() {
  const stripe = useStripe();

  const [product, setProduct] = useState({
    price_data: {
      currency: "usd",
      unit_amount: 799,
      product_data: {
        name: "Hat",
        description: "Pug hat. A hat your pug will love",
        images: [
          "https://i.etsystatic.com/7875251/r/il/6e9931/1534275457/il_570xN.1534275457_cl37.jpg",
        ],
      },
    },
    quantity: 0,
  });

  const changeQuantity = (v) =>
    setProduct({ ...product, quantity: Math.max(0, product.quantity + v) });

  const handleClick = async (event) => {
    const body = { line_items: [product] };
    const { id: sessionId } = await fecthFromAPI("checkouts", {
      body,
    });

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h2>Stripe Checkout</h2>
      <p>
        Shopping-cart scenario. Change the quantity of the products below, then
        click checkout to open the Stripe Checkout window.
      </p>
      <div className="product">
        <h3>{product.name}</h3>
        <h4>Stripe Amount: {product.price_data.unit_amount}</h4>
        <img
          src={product.price_data.product_data.images[0]}
          width="250px"
          alt="product"
        />
      </div>

      <button
        className="btn btn-sm btn-warning"
        onClick={() => changeQuantity(-1)}
      >
        -
      </button>
      <span>{product.quantity}</span>
      <button
        className="btn btn-sm btn-success"
        onClick={() => changeQuantity(1)}
      >
        +
      </button>
      <hr />
      <button
        className="btn btn-primary"
        onClick={handleClick}
        disabled={product.quantity < 1}
      >
        Start Checkout
      </button>
    </>
  );
}

export function CheckoutFail() {
  return <h3>Checkout failed!</h3>;
}

export function CheckoutSuccess() {
  //const url = window.location.href;
  //const sessionId = new URL(url).searchParams.get("session_id");
  return <h3>Checkout was a Success!</h3>;
}
