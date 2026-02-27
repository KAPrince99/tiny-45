import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function ClothNameSkeleton() {
  return (
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3  gap-1 lg:gap-12">
          {/* 🖼️ Product Images */}
          <section className=" w-full lg:col-span-2 ">
            <Carousel className="w-full mx-auto">
              <CarouselContent>
                {[1, 2, 3, 4].map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="shadow-none border-none">
                        <CardContent className="relative aspect-square p-0 flex items-center justify-center">
                          <Skeleton className="h-full w-full rounded-xl" />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
          <>
            <Card className="relative w-full overflow-hidden overflow-y-auto h-[550px] lg:h-[900px] lg:mt-7">
              <CardContent className="space-y-10 p-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-12" />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-16" />
                </div>

                <div className="flex justify-between items-center mt-2 space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-6 w-10 rounded" />
                  ))}
                </div>

                <Skeleton className="h-12 w-full rounded-md mt-6" />

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-1/3 mb-2" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        </div>
        <>
          <main className="container mx-auto px-4 py-8">
            <div className="text-md md:text-lg font-bold mb-2 text-left ml-4">
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-square rounded-lg" />

                  <Skeleton className="h-4 w-3/4" />

                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </main>
        </>
      </div>
    </div>
  );
}
