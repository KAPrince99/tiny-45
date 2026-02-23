"use client";
import React from "react";
import CartSheet from "./cartSheet";
import { Handbag, User } from "lucide-react";
import { Badge } from "./badge";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore"; // Updated import
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function RightSide() {
  // Zustand Selectors
  const setIsSheetOpen = useCartStore((state) => state.setIsSheetOpen);
  const sumOfCartItems = useCartStore((state) => state.sumOfCartItems);

  return (
    <div className="flex justify-center gap-4 items-center">
      <div>
        <CartSheet
          action={
            <div
              className="relative inline-block mt-2 cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setIsSheetOpen(true);
              }}
            >
              <Handbag size={21} className="text-gray-600" />

              {/* Only show badge if there are items */}
              {Number(sumOfCartItems) > 0 && (
                <Badge
                  className="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums absolute -top-2 -right-2 text-[10px] flex items-center justify-center"
                  variant="default"
                >
                  {sumOfCartItems}
                </Badge>
              )}
            </div>
          }
        />
      </div>
      <div className="flex items-center">
        <SignedOut>
          <Link href="/sign-in">
            <User
              size={22}
              className="text-gray-600 cursor-pointer hover:text-black transition-colors"
            />
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8",
              },
            }}
          />
        </SignedIn>
      </div>
    </div>
  );
}
