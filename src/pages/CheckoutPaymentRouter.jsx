import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

const PaymentCheckout = lazy(() => import("./PaymentCheckout"));
const ManualPaymentCheckout = lazy(() => import("./ManualPaymentCheckout"));

function CheckoutPaymentRouter() {
  const { pay_type } = useParams();

  return (
    <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
      {pay_type === "manual-pay" ? (
        <ManualPaymentCheckout />
      ) : (
        <PaymentCheckout />
      )}
    </Suspense>
  );
}

export default CheckoutPaymentRouter;
