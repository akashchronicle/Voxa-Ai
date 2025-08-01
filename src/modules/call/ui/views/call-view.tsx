"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

interface Props {
  meetingId: string;
}

export const CallView = ({
  meetingId,
}: Props) => {
  const trpc = useTRPC();
  const { data: meeting } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
  
  // Default agent instructions if agent data is not available
  const defaultInstructions = `You are a helpful AI assistant for meetings. You should:
- Listen carefully to what people are saying
- Provide concise, relevant responses
- Help with meeting facilitation and note-taking
- Ask clarifying questions when needed
- Be professional and supportive

Keep your responses under 2 sentences and focus on being helpful.`;

  // Fetch agent data if agentId exists, otherwise use default
  let agentInstructions = defaultInstructions;
  
  if (meeting.agentId) {
    const { data: agent } = useSuspenseQuery(
      trpc.agents.getOne.queryOptions({ id: meeting.agentId })
    );
    agentInstructions = agent?.instructions || defaultInstructions;
  }
   
  if (meeting.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="Meeting has ended"
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  return (
    <CallProvider 
      meetingId={meetingId}
      meetingName={meeting.name}
      agentInstructions={agentInstructions}
    />
  );
};
