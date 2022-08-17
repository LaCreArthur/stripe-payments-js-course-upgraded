import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Checkout, CheckoutFail, CheckoutSuccess } from "./Checkout";
import Payments from "./Payments";
import Customers from "./Customers";
import Subscriptions from "./Subscriptions";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul className="navbar-nav">
            <li>
              <Link to="/">
                <span aria-label="emoji" role="img">
                  🏡
                </span>{" "}
                Home
              </Link>
            </li>
            <li>
              <Link to="/checkout">
                <span aria-label="emoji" role="img">
                  🛒
                </span>{" "}
                Checkout
              </Link>
            </li>
            <li>
              <Link to="/payments">
                <span aria-label="emoji" role="img">
                  💸
                </span>{" "}
                Payements
              </Link>
            </li>
            <li>
              <Link to="/customers">
                <span aria-label="emoji" role="img">
                  😃
                </span>{" "}
                Customers
              </Link>
            </li>
            <li>
              <Link to="/subscriptions">
                <span aria-label="emoji" role="img">
                  🔁
                </span>{" "}
                Subscriptions
              </Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/checkout" element={<Checkout />} />
            {/*
            <Route path="/customers">
              <Customers />
            </Route>
            <Route path="/subscriptions">
              <Subscriptions />
            </Route> 
            */}
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/success" element={<CheckoutSuccess />} />
            <Route path="/failed" element={<CheckoutFail />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <>
      <h2>Stripe React + Node.js</h2>
    </>
  );
}

export default App;
