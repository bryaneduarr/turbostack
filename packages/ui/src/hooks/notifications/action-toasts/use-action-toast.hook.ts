import { toast } from "@workspace/ui/services/toast/toast-manager.service";
import type { ActionToastOptions } from "@workspace/ui/types/hooks/notifications/action-toasts/action-toast-options.interface";
import { useEffect, useRef } from "react";

export function useActionToast<State>({
  pending,
  state,
  loading,
  describeResult,
}: ActionToastOptions<State>) {
  const loadingToastId = useRef<string | null>(null);

  useEffect(() => {
    if (!pending) return;
    loadingToastId.current = toast.add({ ...loading, type: "loading" });
  }, [pending, loading]);

  useEffect(() => {
    const id = loadingToastId.current;
    if (id === null) return;
    loadingToastId.current = null;
    const result = describeResult(state);
    if (result === null) toast.close(id);
    else toast.update(id, result);
  }, [state, describeResult]);

  // A successful action redirects, so the page unmounts while still loading.
  useEffect(
    () => () => {
      if (loadingToastId.current !== null) toast.close(loadingToastId.current);
    },
    [],
  );
}
