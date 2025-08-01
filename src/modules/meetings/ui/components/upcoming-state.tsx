import Link from "next/link"; // 'Link' is defined but never used.
import { VideoIcon, BanIcon } from "lucide-react"; // 'VideoIcon' is defined but never used.
import { Button } from "@/components/ui/button"; // 'Button' is defined but never used.
import { EmptyState } from "@/components/empty-state";
interface Props{
    meetingId:string;
    onCancelMeeting:()=>void;
    isCancelling:boolean;
}
export const UpcomingState = ({
    meetingId,
    onCancelMeeting,
    isCancelling,
}:Props) => {
  return (
    <>
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Not started yet"
        description="Once you start this meeting, a summary will appear here"
      />
    </div>

        <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
    <Button
        variant="secondary"
        className="w-full lg:w-auto"
        onClick={onCancelMeeting}
        disabled={isCancelling}
    >
        <BanIcon />
        Cancel meeting
    </Button>

    <Button disabled={isCancelling} asChild className="w-full lg:w-auto">
        <Link href={`/call/${meetingId}`}>
        <VideoIcon />
        Start meeting
        </Link>
    </Button>
    </div>
</>
  );
};
