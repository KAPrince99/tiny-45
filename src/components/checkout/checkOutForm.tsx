import React, { memo, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BorderBeam } from "../ui/border-beam";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import convertToSubCurrency from "../../../utils/convertToSubCurrency";
import { Loader2 } from "lucide-react";

function CheckOutForm({ cartTotal }: { cartTotal: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubCurrency(cartTotal) }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [cartTotal]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!stripe || !elements) return;
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${baseUrl}/payment-success?amount=${cartTotal}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <Card className="relative w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl">Checkout</CardTitle>
        <CardDescription>
          Choose your Preferred Payment method and Enter your credentials to
          access for easy shipment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!clientSecret || !stripe || !elements ? (
          <>
            <main className="flex items-center justify-center  ">
              <div
                className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-125rem] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              >
                <span className="absolute! -m-px! w-px! overflow-hidden! whitespace-nowrap! border-0! p-0! [clip:rect(0,0,0,0)]!">
                  Loading...
                </span>
              </div>
            </main>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white  rounded-md ">
            {clientSecret && <PaymentElement />}
            {errorMessage && <div>{errorMessage}</div>}
            <Button
              disabled={!stripe || loading}
              className=" w-full p-5 mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                `Pay $${cartTotal}`
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <BorderBeam duration={8} size={100} />
    </Card>
  );
}
export default memo(CheckOutForm);
