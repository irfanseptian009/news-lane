"use client";

import { ArticleCategory } from "@/typesCategory";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import NavBar from "../../../components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Footer from "./../../../components/Footer";

async function getData(categoryName: string) {
  const res = await fetch(
    `https://api.nytimes.com/svc/topstories/v2/${categoryName}.json?api-key=${process.env.NEXT_PUBLIC_API_KEY}`
  );

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("No articles found for this category.");
    } else {
      throw new Error("Failed to fetch data");
    }
  }

  return res.json();
}

export default function Page({ params }: { params: { categoryName: string } }) {
  const [data, setData] = useState<ArticleCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryName = params.categoryName;

  useEffect(() => {
    console.log("Fetching data for category:", categoryName);

    getData(categoryName)
      .then(setData)
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [categoryName]);

  const cardSkeleton = (
    <Card className="w-[300px] lg:w-[400px] md:w-[400px] max-w-sm rounded overflow-hidden shadow-lg block">
      <CardContent className="flex flex-col space-y-3">
        <Skeleton className="h-[225px] w-full rounded-md " />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <NavBar />{" "}
      <section className="">
        <h2 className="mt-5 -mb-8 font-serif border-b border-black mx-14  ">
          {params.categoryName.toUpperCase()} NEWS
        </h2>

        <div className="px-14 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t ">
          {isLoading ? (
            Array.from({ length: 20 }).map((_, index) => (
              <div key={index}>{cardSkeleton}</div>
            ))
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : data && data.results.length > 0 ? (
            data.results.map((result) => (
              <Link key={result.uri} href={result.url} legacyBehavior passHref>
                <Card className="max-w-sm rounded overflow-hidden shadow-xl block transition-transform duration-300 hover:scale-105">
                  {result.multimedia?.[1]?.url && (
                    <Image
                      src={result.multimedia[1].url}
                      alt={result.title}
                      width={450}
                      height={350}
                    />
                  )}
                  <CardHeader className="px-6 py-4">
                    {" "}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(result.published_date).toLocaleDateString()} -{" "}
                      {result.section}
                    </p>
                    {result.byline && (
                      <p className="text-sm text-blue-500 mt-1">{result.byline}</p>
                    )}
                    <CardTitle className="font-bold text-xl mb-2">
                      {result.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-base">
                      {result.abstract}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <div>No articles found for this category.</div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
