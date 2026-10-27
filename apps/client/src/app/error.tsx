"use client";

import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import { Button } from "@workspace/ui/components/button/button.component";
import { ErrorReference } from "@workspace/ui/components/feedback/error-reference/error-reference.component";
import { Page } from "@workspace/ui/components/layout/page/page.component";
import { Heading } from "@workspace/ui/components/typography/heading/heading.component";
import type { ErrorPageProps } from "@/types/app/error/error-page-props.interface";

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Page width="form" align="center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Heading level={1} size="page">
          Something went wrong
        </Heading>
        <ErrorReference
          reference={{
            code: SUPPORT_ERROR_CODE.PAGE_CRASHED,
            requestId: error.digest ?? null,
          }}
          tone="muted"
        />
        <Button type="button" variant="primary" size="medium" onClick={reset}>
          Try again
        </Button>
      </div>
    </Page>
  );
}
