"use client";

import type { SupportReference } from "@workspace/schemas/support/errors/codes/support-reference.interface";
import { Button } from "@workspace/ui/components/button/button.component";
import { Text } from "@workspace/ui/components/typography/text/text.component";
import type { ErrorReferenceProps } from "@workspace/ui/types/components/feedback/error-reference-props.interface";
import { useEffect, useState } from "react";

const COPY_CONFIRMATION_MS = 2000;

const copyLabels = {
  idle: "Copy",
  copied: "Copied",
  failed: "Copy failed",
} as const;

function formatErrorReference({ code, requestId }: SupportReference): string {
  const codeText = `Error code ${code}`;
  return requestId === null ? codeText : `${codeText} · ID ${requestId}`;
}

export function ErrorReference({ reference, tone }: ErrorReferenceProps) {
  const [copyState, setCopyState] = useState<keyof typeof copyLabels>("idle");
  const referenceText = formatErrorReference(reference);

  useEffect(() => {
    if (copyState === "idle") return undefined;

    const resetTimer = window.setTimeout(
      () => setCopyState("idle"),
      COPY_CONFIRMATION_MS,
    );
    return () => window.clearTimeout(resetTimer);
  }, [copyState]);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(referenceText);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Text as="p" size="caption" tone={tone} weight="regular">
        {referenceText}
      </Text>
      <Button
        type="button"
        variant="ghost"
        size="small"
        onClick={copyReference}
      >
        {copyLabels[copyState]}
      </Button>
    </div>
  );
}
