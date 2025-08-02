import { auth } from "@/lib/auth";
import { MeetingIdView, MeetingIDViewError, MeetingIDViewLoading } from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { meetingId } = await params; // 'meetingId' is accessed here

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in'); // Cannot find name 'redirect'
  }

   const queryClient = getQueryClient();
void queryClient.prefetchQuery(
  trpc.meetings.getOne.queryOptions({ id: meetingId }),
);


return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<MeetingIDViewLoading/>}>
      <ErrorBoundary fallback={<MeetingIDViewError/>}>
        <MeetingIdView meetingId={meetingId}/>
      </ErrorBoundary>
    </Suspense>
  </HydrationBoundary>
);

}

export default Page