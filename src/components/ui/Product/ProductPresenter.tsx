"use client";
import React, { memo } from "react";
import ProductImageDisplay from "./productImageDisplay";
import ProductInfo from "./productInfo";
import { ClothDataProps } from "@/types/types";
import StyledWithCard from "./StyledWithCard";
import ClothNameSkeleton from "../clothNameSkeleton";
import ErrorMessage from "../ErrorMessage";

interface ProductPresenterProps {
  data: ClothDataProps | undefined;
  sizeOptions: string[];
  sizeError?: string | null;
  chosenSize?: string | null;
  isAddingToCart: boolean;
  isLoading?: boolean;
  error?: Error | null;
  selectedIndex?: number | null;
  handleSelectSize: (selectedSize: string, i: number) => void;
  handleAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRetry: () => void;
}

function ProductPresenter({
  data,
  sizeOptions,
  sizeError,
  chosenSize,
  isAddingToCart,
  isLoading,
  error,
  selectedIndex,
  handleSelectSize,
  handleAddToCart,
  onRetry,
}: ProductPresenterProps) {
  if (isLoading) return <ClothNameSkeleton />;
  if (error || !data)
    return (
      <ErrorMessage
        message={
          error?.message ||
          "Failed to load product details. Please try again later."
        }
        onRetry={onRetry}
      />
    );
  return (
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-12">
          <section className="w-full lg:col-span-2">
            <ProductImageDisplay data={data} />
          </section>
          <ProductInfo
            data={data}
            chosenSize={chosenSize}
            sizeError={sizeError}
            sizeOptions={sizeOptions}
            selectedIndex={selectedIndex}
            isAddingToCart={isAddingToCart}
            handleSelectSize={handleSelectSize}
            handleAddToCart={handleAddToCart}
          />
        </div>
        <StyledWithCard />
      </div>
    </div>
  );
}
export default memo(ProductPresenter);
