import Link from "next/link"; // 'Link' is defined but never used.
import { VideoIcon } from "lucide-react"; // 'VideoIcon' is defined but never used.
import { Button } from "@/components/ui/button"; // 'Button' is defined but never used.
import { EmptyState } from "@/components/empty-state";
 

export const CancelledState = (
    ) => {
  return (
    <>
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting is Cancelled"
        description="This MEeting was cancelled"
      />
    </div>

    
</>
  );
};
