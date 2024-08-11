"use client";

import { ArticlePopular } from "../types";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import NavBar from "../components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Footer from "./../components/Footer";

async function getData() {
  const res = await fetch(
    `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${process.env.NEXT_PUBLIC_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Home() {
  const [data, setData] = useState<ArticlePopular | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);
  console.log(data);

  const cardSkeleton = (
    <Card className="w-[400px] ">
      <CardContent className="flex flex-col space-y-3">
        <Skeleton className="h-[225px] w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <NavBar />
      <div className="px-14 py-14 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <div key={index}>{cardSkeleton}</div>
            ))
          : data?.results.map((result) => (
              <Link key={result.id} href={result.url} legacyBehavior passHref>
                <a className="max-w-sm rounded overflow-hidden shadow-lg block">
                  {result.multimedia && result.multimedia.length > 0 && (
                    <Image
                      src={result.multimedia[1].url}
                      alt={result.title}
                      width={450}
                      height={350}
                    />
                  )}
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{result.title}</div>
                    <p className="text-gray-700 text-base">{result.abstract}</p>
                  </div>
                </a>
              </Link>
            ))}
      </div>
      <Footer />
    </>
  );
}
