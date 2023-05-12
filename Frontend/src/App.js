import MainRouter from "./MainRouter";
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SocketProvider } from "./helper/socketContext";


function App() {
  const initialOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_ID,
    currency: "USD",

    "data-namespace": "paypal_sdk",

  };
  return (
    <BrowserRouter>
      <SocketProvider>
        <div className="flex flex-col min-h-screen w-full mx-auto">
          <PayPalScriptProvider
            options={initialOptions}
          >
            <MainRouter />
          </PayPalScriptProvider>
        </div>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
