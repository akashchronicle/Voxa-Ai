import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  CallControls,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

interface Props {
  onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
  const call = useCall();
  const { useMicrophoneState } = useCallStateHooks();
  const { isEnabled: isMicEnabled } = useMicrophoneState();
  const hasInitialized = useRef(false);

  // Prevent audio conflicts between Stream Video and voice agent
  useEffect(() => {
    if (!hasInitialized.current && call) {
      // Ensure microphone is disabled by default to prevent conflicts
      if (isMicEnabled) {
        call.microphone.disable();
      }
      hasInitialized.current = true;
    }
  }, [call, isMicEnabled]);

  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
      <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
        <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
          <Image src="/logoVox.png" width={22} height={22} alt="Logo" />
        </Link>
        <h4 className="text-base">
          {meetingName}
        </h4>
      </div>
      <SpeakerLayout />
      <div className="bg-[#101213] rounded-full px-4">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
