"use client";
import { Elements } from "@stripe/react-stripe-js";
import React, { memo } from "react";
import CheckOutForm from "./checkOutForm";
import { stripePromise } from "@/app/lib/stripe";
import convertToSubCurrency from "../../../utils/convertToSubCurrency";
import { Loader2 } from "lucide-react";

function CheckOurPresenter({
  cartTotal,
  isLoading,
}: {
  cartTotal: number;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white mt-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-8">
          <section className="lg:col-span-1">
            <div className="bg-white ">
              <Elements
                stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: convertToSubCurrency(cartTotal),
                  currency: "usd",
                }}
              >
                <CheckOutForm cartTotal={cartTotal} />
              </Elements>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
export default memo(CheckOurPresenter);
