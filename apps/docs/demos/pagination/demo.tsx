"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@strait/ui/components/pagination";
import { useState } from "react";

export default function PaginationDemo() {
  const [page, setPage] = useState(2);

  return (
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
        <PaginationItem>
          <PaginationLink
            active={page === 1}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            active={page === 2}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(2);
            }}
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            active={page === 3}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(3);
            }}
          >
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage((p) => Math.min(10, p + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
