import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import { ErrorReference } from "@workspace/ui/components/feedback/error-reference/error-reference.component";
import { Page } from "@workspace/ui/components/layout/page/page.component";
import { TextLink } from "@workspace/ui/components/link/text-link/text-link.component";
import { Heading } from "@workspace/ui/components/typography/heading/heading.component";

export default function NotFound() {
  return (
    <Page width="form" align="center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Heading level={1} size="page">
          Page not found
        </Heading>
        <ErrorReference
          reference={{
            code: SUPPORT_ERROR_CODE.PAGE_NOT_FOUND,
            requestId: null,
          }}
          tone="muted"
        />
        <TextLink href="/" tone="primary">
          Go home
        </TextLink>
      </div>
    </Page>
  );
}
