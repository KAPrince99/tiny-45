"use client";
import { loadStripe } from "@stripe/stripe-js";

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (stripePublicKey === undefined)
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");

export const stripePromise = loadStripe(stripePublicKey!);
