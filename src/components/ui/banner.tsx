import Image from "next/image";
import { Manrope } from "next/font/google";
import React from "react";
import { TypewriterEffectSmooth } from "./typewriter-effect";
import { roboto } from "@/app/layout";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function Banner() {
  const words = [
    {
      text: "Experience",
    },
    {
      text: "The",
    },
    {
      text: "Journey",
    },
    {
      text: "King",
      className: "text-white",
    },
  ];
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0">
        <Image
          src="/545/545_banner.webp"
          alt="Person next to a classic car with luggage"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      <div className="absolute  top-50 inset-0 flex items-center  justify-center p-4 ">
        <TypewriterEffectSmooth className={roboto.className} words={words} />
      </div>
    </div>
  );
}
