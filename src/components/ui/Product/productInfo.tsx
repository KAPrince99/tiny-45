"use client";
import React, { memo } from "react";
import { Card, CardContent } from "../card";
import { Button } from "../button";
import { Loader2 } from "lucide-react";
import { AccordionInfo } from "../accordionInfo";
import { BorderBeam } from "../border-beam";
import { ClothDataProps } from "@/types/types";

interface ProductInfoProps {
  data: ClothDataProps;
  sizeOptions: string[];
  sizeError?: string | null;
  chosenSize?: string | null;
  isAddingToCart: boolean;
  selectedIndex?: number | null;
  handleSelectSize: (selectedSize: string, i: number) => void;
  handleAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function ProductInfo({
  data,
  sizeOptions,
  sizeError,
  isAddingToCart,
  selectedIndex,
  handleSelectSize,
  handleAddToCart,
}: ProductInfoProps) {
  return (
    <main>
      <Card className="relative w-full overflow-hidden overflow-y-auto h-[550px] lg:h-[900px] lg:mt-7">
        <CardContent className="space-y-10">
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-semibold md:text-lg">
              {data.name.replace(/-/g, " ").split(" ").slice(0, -1).join(" ")}
            </h1>
            <p className="font-lg text-sm">${data.price}</p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span>Size</span>
            <span className="underline cursor-pointer">Size Chart</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            {sizeOptions.map((size, index) => (
              <button
                key={index}
                onClick={() => handleSelectSize(size, index)}
                className={`text-xs border px-3 py-1 rounded transition-colors ${
                  selectedIndex === index
                    ? "bg-[#063573] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* TRIGGER BUTTON: This updates the global store to open the Header's Sheet */}
          <div className="space-y-2">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="mt-4 w-full cursor-pointer py-4 text-sm sm:py-6"
            >
              {isAddingToCart ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Add to Bag"
              )}
            </Button>
            {sizeError && (
              <p className="text-red-500 text-xs text-center">{sizeError}</p>
            )}
          </div>

          <AccordionInfo />
        </CardContent>
        <BorderBeam duration={8} size={100} />
      </Card>
    </main>
  );
}
export default memo(ProductInfo);
