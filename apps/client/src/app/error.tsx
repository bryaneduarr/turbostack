"use client";

import { Button } from "@workspace/ui/components/button/button.component";
import type { ErrorPageProps } from "@/types/app/error/error-page-props.interface";

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <Button type="button" variant="primary" size="medium" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
