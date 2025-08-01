import { ResponsiveDialog } from "@/components/responsive-dailog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";
import { MeetingGetOne } from "../../types";


interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues

}: UpdateMeetingDialogProps) => {

const router = useRouter();

  return (
    <ResponsiveDialog
      title="Edit Meeting"
      description="Edit the Meeting details"
      open={open}
      onOpenChange={onOpenChange}
    >
       <MeetingForm
       onSuccess={(id)=>{
        onOpenChange(false);
        // router.push(`/meetings/${id}`)

       }}
       onCancel={()=>onOpenChange(false)}
       initialValues={initialValues}/>
    </ResponsiveDialog>
  );
};
