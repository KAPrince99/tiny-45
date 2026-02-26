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
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/useCartStore";
import { CartDataProps, CartItemProps, ClothDataProps } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import EmptyCart from "../emptyCart";
import { useRouter } from "next/navigation";

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
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      {action && <SheetTrigger asChild>{action}</SheetTrigger>}
      <SheetContent
        side="right"
        className="w-[355px] sm:w-[540px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          {cartIsEmpty ? (
            <EmptyCart />
          ) : (
            <SheetDescription>Review your items.</SheetDescription>
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
                      {item.name.replace(/-/g, " ")}
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
                      className="size-4 cursor-pointer text-red-600 hover:scale-110"
                    />
                  </div>
                  <p className="text-xs text-gray-500">size: {item.size}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex border rounded-sm">
                      <Button
                        className="h-8 w-8 p-0 cursor-pointer"
                        variant="ghost"
                        onClick={() => handleMinus(item.id)}
                      >
                        -
                      </Button>
                      <div className="h-8 w-10 flex items-center justify-center text-sm border-x">
                        {item.count}
                      </div>
                      <Button
                        className="h-8 w-8 p-0 cursor-pointer"
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
              <p className="text-lg font-bold">
                Total: ${cartTotal.toFixed(2)}
              </p>
            </div>

            <Button
              className="w-full cursor-pointer h-12"
              disabled={isLoading}
              onClick={handleCheckout}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default memo(CartSheet);
