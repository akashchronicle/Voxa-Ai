import Link from "next/link"; // 'Link' is defined but never used.
import { LogInIcon } from "lucide-react"; // 'LogInIcon' is defined but never used.

import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk"; // Many imports are defined but never used.

import {authClient} from "@/lib/auth-client"; // 'authClient' is defined but never used.
import { Button } from "@/components/ui/button"; // 'Button' is defined but never used.
import { generateAvatarUri } from "@/lib/avatar"; // 'generateAvatarUri' is defined but never used.
import "@stream-io/video-react-sdk/dist/css/styles.css"



export const CallEnded = () => {
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
 <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">You have ended the call</h6>
            <p className="text-sm">Summary will appear in few minutes</p>
          </div>
          
         
          <Button asChild>
            <Link href="/meetings">Back to meetings</Link>
          </Button>

        </div>
      </div>
    </div>
  );
};
