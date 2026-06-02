"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@strait/ui/components/pagination";
import { useState } from "react";

const TOTAL_PAGES = 7;

export default function PaginationControlled() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-sm">
        Page {page} of {TOTAL_PAGES}
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
            />
          </PaginationItem>
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                active={p === page}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.min(TOTAL_PAGES, p + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
