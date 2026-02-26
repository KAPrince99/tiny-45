"use client";

import {
  deleteCartItem,
  getCartData,
  UniqueCartItemProps,
  DeleteCartItemParams,
  setCartData,
  deleteSingleCartItem,
} from "@/app/actions/cartActions";

import { useCartStore } from "@/store/useCartStore";
import { CartDataProps, CartItemProps, ClothDataProps } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import CartSheetPresenter from "./CartSheetPresenter";

interface DataProps {
  action?: ReactNode;
  data?: ClothDataProps;
  chosenSize?: string | null;
  sizeError?: string | null;
}

function CartSheet({ action }: DataProps) {
  const router = useRouter();
  const isSheetOpen = useCartStore((state) => state.isSheetOpen);
  const setIsSheetOpen = useCartStore((state) => state.setIsSheetOpen);
  const setSumOfCartItems = useCartStore((state) => state.setSumOfCartItems);
  const [isLoading, setIsLoading] = useState(false);

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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
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
      return {};
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

  const handleCheckout = useCallback(() => {
    setIsLoading(true);
    setIsSheetOpen(false);

    router.push("/checkOut");
    setIsLoading(false);
  }, [router, setIsSheetOpen]);

  return (
    <CartSheetPresenter
      isSheetOpen={isSheetOpen}
      setIsSheetOpen={setIsSheetOpen}
      action={action}
      cartIsEmpty={cartIsEmpty}
      cartItems={cartItems}
      onDeleteCart={handleDeleteCart}
      onPlus={handlePlus}
      onMinus={handleMinus}
      cartTotal={cartTotal}
      isLoading={isLoading}
      onCheckout={handleCheckout}
    />
  );
}

export default memo(CartSheet);
