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
interface Props {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={{
        name: data?.user.name ?? "",
        image: data?.user.image ?? generateAvatarUri({
          seed: data?.user.name ?? "",
          variant: "initials",
        }),
      } as StreamVideoParticipant
    }
    />
  );
};

const AllowBrowserPermissions = () => {
  return (
    <p className="text-sm">
      Please grant your browser a permission to access your camera and microphone.
    </p>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  // 'onJoin' is defined but never used.
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission:hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission:hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
 <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p className="text-sm">Set up your call before joining</p>
          </div>
          <div className="text-sm italic text-red-600 justify-center">
  <p className="animate-pulse">OpenAI credits are unavailable — avatar agent won’t respond.</p>
  <p className="animate-pulse">Azure voice agents will reply for demo purposes.</p>
    <p className="animate-pulse">Full responses resume, once OpenAI credits are restored.</p>
</div>

          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? DisabledVideoPreview
                : AllowBrowserPermissions
            }
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
            </div>

            <div className="flex gap-x-2 justify-between w-full">
            <Button asChild variant="ghost">
                <Link href="/meetings">
                Cancel
                </Link>
            </Button>

            <Button onClick={onJoin}>
                <LogInIcon />
                Join Call
            </Button>
            </div>
            



        </div>
        
      </div>
    </div>
  );
};
