"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useState } from "react";
import {
  fetchClothData,
  setCartData,
  UniqueCartItemProps,
} from "../actions/cartActions";
import { useCartStore } from "@/store/useCartStore";
import { CartItemProps, ClothDataProps } from "@/types/types";
import ClothNameSkeleton from "@/components/ui/clothNameSkeleton";
import ProductPresenter from "@/components/ui/Product/ProductPresenter";

function ClothName({ clothName }: { clothName: string }) {
  const decodedClothName = decodeURIComponent(clothName);
  const [chosenSize, setChosenSize] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const setIsSheetOpen = useCartStore((state) => state.setIsSheetOpen);
  const sizeError = useCartStore((state) => state.sizeError);
  const setSizeError = useCartStore((state) => state.setSizeError);

  const queryClient = useQueryClient();
  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  const handleSelectSize = useCallback((selectedSize: string, i: number) => {
    setChosenSize(selectedSize);
    setSelectedIndex(i);
  }, []);

  const { data, isLoading, error } = useQuery<ClothDataProps>({
    queryKey: ["clothData", decodedClothName],
    queryFn: () => fetchClothData(decodedClothName),
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: addToCartMutation, isPending: isAddingToCart } =
    useMutation({
      mutationFn: setCartData,
      onMutate: async (newCartItem: CartItemProps) => {
        await queryClient.cancelQueries({ queryKey: ["cart"] });
        const previousCart = queryClient.getQueryData<UniqueCartItemProps[]>([
          "cart",
        ]);

        queryClient.setQueryData<UniqueCartItemProps[]>(
          ["cart"],
          (old: any) => {
            if (!old) return [{ ...newCartItem, count: 1 }];
            const existingItemIndex = old.findIndex(
              (item: any) =>
                item.name === newCartItem.name &&
                item.size === newCartItem.size &&
                item.price === newCartItem.price,
            );

            if (existingItemIndex > -1) {
              const updatedCart = [...old];
              updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                count: (updatedCart[existingItemIndex].count || 1) + 1,
              };
              return updatedCart;
            }
            return [...old, { ...newCartItem, count: 1 }];
          },
        );

        setSizeError(null);
        setIsSheetOpen(true);
        return { previousCart };
      },
      onError: (err, variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(["cart"], context.previousCart);
          setIsSheetOpen(false);
          alert("Failed to add item to cart.");
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.setQueryData(["cart"], (old: any) => old);
      },
    });

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!data) return;

      if (!chosenSize) {
        setSizeError("Please select a size before adding to cart.");
        return;
      }

      const newCartItem: CartItemProps = {
        front_image: data.front_image,
        name: data.name,
        price: data.price,
        size: chosenSize,
        cloth_id: data.id,
        color: data.color,
      };

      setSelectedIndex(null);
      setChosenSize(null);
      await addToCartMutation(newCartItem);
    },
    [data, chosenSize, addToCartMutation, setSizeError],
  );

  useEffect(() => {
    if (chosenSize) setSizeError(null);
  }, [chosenSize, setSizeError]);

  if (isLoading) return <ClothNameSkeleton />;
  if (error || !data)
    return (
      <p className="text-red-500 text-center py-20">Error Loading Cloth</p>
    );

  return (
    <ProductPresenter
      data={data}
      chosenSize={chosenSize}
      sizeError={sizeError}
      sizeOptions={sizeOptions}
      selectedIndex={selectedIndex}
      isAddingToCart={isAddingToCart}
      handleSelectSize={handleSelectSize}
      handleAddToCart={handleAddToCart}
    />
  );
}

export default memo(ClothName);
