import { useRouter } from "next/navigation"; // 'useRouter' is defined but never used.
import { useQuery } from "@tanstack/react-query"; // 'useQuery' is defined but never used.
import { Dispatch, SetStateAction, useState } from "react"; // 'useState' is defined but never used.

import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty
} from "@/components/ui/command";

import { useTRPC } from "@/trpc/client"; // 'useTRPC' is defined but never used.
import { GeneratedAvatar } from "@/components/generate-avatar"
interface Props{
    open:boolean;
    setOpen:Dispatch<SetStateAction<boolean>>;
}
export const DashboardCommand=({open,setOpen}:Props)=>{
        const router = useRouter();  // 'router' is assigned a value but never used
        const [search, setSearch] = useState("");  // 'setSearch' is assigned a value but never used

        const trpc = useTRPC();

        const meetings = useQuery(
        trpc.meetings.getMany.queryOptions({
            search,
            pageSize: 100,
        })
        );

        const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            search,
            pageSize: 100,
        })
        );

   
   
    return (
        <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
            <CommandInput
            placeholder="Find a meeting or agent..."
            value={search}
            onValueChange={(value)=>setSearch(value)}
            />
            <CommandList>
                <CommandGroup heading="Meetings">
                <CommandEmpty>
                    <span className="text-muted-foreground text-sm">
                    No meetings found
                    </span>
                </CommandEmpty>

                {meetings?.data?.items.map((meeting) => (
                    <CommandItem
                    onSelect={() => {
                        router.push(`/meetings/${meeting.id}`);
                        setOpen(false);
                    }}
                    key={meeting.id}
                    >
                        <GeneratedAvatar
                        seed={meeting.name}
                        variant="botttsNeutral"
                        className="size-5"
                        />
                    {meeting.name}
                    </CommandItem>
                ))}
                </CommandGroup>

                <CommandGroup heading="Agents">
                <CommandEmpty>
                    <span className="text-muted-foreground text-sm">
                    No agnets found
                    </span>
                </CommandEmpty>

                {agents?.data?.items.map((agent) => (
                    <CommandItem
                    onSelect={() => {
                        router.push(`/agents/${agent.id}`);
                        setOpen(false);
                    }}
                    key={agent.id}
                    >
                        <GeneratedAvatar
                        seed={agent.name}
                        variant="botttsNeutral"
                        className="size-5"
                        />
                    {agent.name}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    );
};