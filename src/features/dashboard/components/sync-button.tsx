"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { syncCurrentUserStats } from "@/actions/leetcode.actions";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [justSynced, setJustSynced] = useState(false);

  const handleSync = () => {
    startTransition(async () => {
      const result = await syncCurrentUserStats();
      if (result.success) {
        toast.success("Stats synced from LeetCode");
        setJustSynced(true);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSync} disabled={isPending}>
      <RefreshCw className={isPending ? "animate-spin" : ""} />
      {isPending ? "Syncing…" : justSynced ? "Synced" : "Sync now"}
    </Button>
  );
}
