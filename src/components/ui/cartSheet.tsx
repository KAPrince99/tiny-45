"use client";

import {
  deleteCartItem,
  getCartData,
  UniqueCartItemProps,
  DeleteCartItemParams,
  setCartData,
  deleteSingleCartItem,
} from "@/app/actions/cartActions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/useCartStore";
import { CartDataProps, CartItemProps, ClothDataProps } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, ReactNode, useCallback, useEffect, useMemo } from "react";
import EmptyCart from "./emptyCart";

interface DataProps {
  action: ReactNode;
  data?: ClothDataProps;
  chosenSize?: string | null;
  sizeError?: string | null;
}

function CartSheet({ action, sizeError }: DataProps) {
  const isSheetOpen = useCartStore((state) => state.isSheetOpen);
  const setIsSheetOpen = useCartStore((state) => state.setIsSheetOpen);
  const setSumOfCartItems = useCartStore((state) => state.setSumOfCartItems);
  const setSizeError = useCartStore((state) => state.setSizeError);

  const queryClient = useQueryClient();

  const { data: cartItems } = useQuery<UniqueCartItemProps[]>({
    queryKey: ["cart"],
    queryFn: getCartData,
    staleTime: 1000 * 60 * 5,
  });

  const totalItemCount = useMemo(() => {
    return cartItems?.reduce((sum, item) => sum + (item.count || 1), 0) || 0;
  }, [cartItems]);

  useEffect(() => {
    setSumOfCartItems(totalItemCount);
  }, [totalItemCount, setSumOfCartItems]);

  const deleteMutation = useMutation({
    mutationFn: deleteCartItem,
    onMutate: async (itemToDeleteParams: DeleteCartItemParams) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      queryClient.setQueryData<UniqueCartItemProps[]>(["cart"], (old) =>
        old?.filter(
          (item) =>
            item.name !== itemToDeleteParams.name ||
            item.price !== itemToDeleteParams.price ||
            item.size !== itemToDeleteParams.size,
        ),
      );
      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["cart"], context?.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleDeleteCart = useCallback(
    (
      itemName: string,
      itemPrice: string,
      itemSize: string | null,
      itemColor: string,
    ) => {
      deleteMutation.mutate({
        name: itemName,
        price: itemPrice,
        size: itemSize,
        color: itemColor,
      });
    },
    [deleteMutation],
  );

  const { mutateAsync: addToCartMutation } = useMutation({
    mutationFn: setCartData,
    onMutate: async (newCartItem: CartItemProps) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<UniqueCartItemProps[]>([
        "cart",
      ]);
      queryClient.setQueryData<UniqueCartItemProps[]>(["cart"], (old: any) => {
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
      });
      setIsSheetOpen(true);
      return { previousCart };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const handlePlus = useCallback(
    (cartData: CartDataProps) => {
      const newCartItem: CartItemProps = {
        front_image: cartData.front_image,
        name: cartData.name,
        price: cartData.price,
        size: cartData.size,
        cloth_id: cartData.cloth_id,
        color: cartData.color,
      };
      addToCartMutation(newCartItem);
    },
    [addToCartMutation],
  );

  const { mutate: removeSingle } = useMutation({
    mutationFn: deleteSingleCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const handleMinus = useCallback(
    (id: string) => removeSingle(id),
    [removeSingle],
  );

  const cartIsEmpty = !cartItems || cartItems.length === 0;

  const cartTotal = useMemo(() => {
    return (
      cartItems?.reduce(
        (sum, item) => sum + parseFloat(item.price) * (item.count || 1),
        0,
      ) || 0
    );
  }, [cartItems]);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      {action}
      <SheetContent
        side="right"
        className="w-[355px] sm:w-[540px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          {cartIsEmpty && <EmptyCart />}
          {!cartIsEmpty && (
            <SheetDescription>
              Review your selected items before proceeding to checkout.
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {!cartIsEmpty &&
            cartItems.map((item, index) => (
              <div
                key={item.id || index}
                className="grid grid-cols-[1fr_2fr] p-2 shadow-sm"
              >
                <section className="relative aspect-square">
                  <Image
                    src={item.front_image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </section>
                <section className="space-y-4 pl-4">
                  <div className="flex justify-between items-start">
                    <p className="text-[13px] font-semibold">
                      {item.name
                        .replace(/-/g, " ")
                        .split(" ")
                        .slice(0, -1)
                        .join(" ")}
                    </p>
                    <Trash2
                      onClick={() =>
                        handleDeleteCart(
                          item.name,
                          item.price,
                          item.size,
                          item.color,
                        )
                      }
                      className="size-4 cursor-pointer text-red-600 hover:scale-110 transition-transform"
                    />
                  </div>
                  <p className="text-xs text-gray-500">size: {item.size}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex border rounded-sm">
                      <Button
                        className="h-8 w-8 p-0"
                        variant="ghost"
                        onClick={() => handleMinus(item.id)}
                      >
                        -
                      </Button>
                      <div className="h-8 w-10 flex items-center justify-center text-sm border-x">
                        {item.count}
                      </div>
                      <Button
                        className="h-8 w-8 p-0"
                        variant="ghost"
                        onClick={() =>
                          handlePlus(item as unknown as CartDataProps)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(parseFloat(item.price) * (item.count || 1)).toFixed(2)}
                    </p>
                  </div>
                </section>
              </div>
            ))}
        </div>

        {!cartIsEmpty && (
          <SheetFooter className="mt-auto flex-col space-y-2">
            <div className="flex justify-between items-center w-full mb-4">
              <p className="text-lg font-bold">Total:</p>
              <p className="text-lg font-bold">${cartTotal.toFixed(2)}</p>
            </div>
            <Link
              href="/checkOut"
              className="w-full"
              onClick={() => setIsSheetOpen(false)}
            >
              <Button className="w-full">Checkout</Button>
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default memo(CartSheet);
