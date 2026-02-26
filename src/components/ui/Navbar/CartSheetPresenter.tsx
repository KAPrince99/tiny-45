'use client";';
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
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import EmptyCart from "../emptyCart";
import { CartItemProps } from "@/types/types";
import { memo } from "react";

interface CartSheetPresenterProps {
  action?: React.ReactNode;
  cartItems: CartItemProps[] | undefined;
  cartIsEmpty: boolean;
  cartTotal: number;
  isLoading: boolean;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  onDeleteCart: (
    name: string,
    price: string,
    size: string | null,
    color: string,
  ) => void;
  onPlus: (item: CartItemProps) => void;
  onMinus: (id: string) => void;
  onCheckout: () => void;
}

function CartSheetPresenter({
  action,
  cartItems,
  cartIsEmpty,
  cartTotal,
  isLoading,
  isSheetOpen,
  setIsSheetOpen,
  onDeleteCart,
  onPlus,
  onMinus,
  onCheckout,
}: CartSheetPresenterProps) {
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
                        onDeleteCart(
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
                        onClick={() => onMinus(item.id)}
                      >
                        -
                      </Button>
                      <div className="h-8 w-10 flex items-center justify-center text-sm border-x">
                        {item.count}
                      </div>
                      <Button
                        className="h-8 w-8 p-0 cursor-pointer"
                        variant="ghost"
                        onClick={() => onPlus(item as unknown as CartItemProps)}
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
              onClick={onCheckout}
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
export default memo(CartSheetPresenter);
