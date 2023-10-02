"use client";

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathanme = usePathname();

  const debouncedValue = useDebounce(value);

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathanme,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathanme]);
  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible ring-slate-200"
        placeholder="Search a course"
      />
    </div>
  );
}
