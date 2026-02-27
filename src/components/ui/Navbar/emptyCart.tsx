import Image from "next/image";
import React from "react";

export default function EmptyCart() {
  return (
    <div className="flex justify-center items-center mt-40">
      <div>
        <Image
          src="/icons/empty-cart.png"
          alt="empty cart"
          height={120}
          width={120}
        />
        <p className="mt-5 text-md text-gray-500">Your cart is empty</p>
      </div>
    </div>
  );
}
