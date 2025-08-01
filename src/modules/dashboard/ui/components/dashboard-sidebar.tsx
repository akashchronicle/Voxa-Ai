"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { BotIcon, StarIcon, VideoIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // ✅ correct
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboardUserButton";


const firstSection=[
    {
        icons:SparklesIcon,
        label:"Try Demo",
        href:"/demo",
    },
    {
        icons:VideoIcon,
        label:"Meetings",
        href:"/meetings",
    },
    {
        icons:BotIcon,
        label:"Agents",
        href:"/agents",
    },
    
];



export const DashboardSidebar=()=>{
    // const pathname="/meetings";
    const pathname=usePathname();
    
    return (
        <Sidebar className="bg-white border-r border-gray-100 shadow-sm">
        <SidebarHeader className="text-foreground px-6 py-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Image src="/logoVox.png" height={48} width={48} alt="Voxa AI" className="rounded-lg" />
        <div>
          <p className="text-xl font-bold text-gray-900">Voxa AI</p>
          <p className="text-xs text-gray-500">AI Meeting Assistant</p>
        </div>
        </Link>
        </SidebarHeader>
         <div className="px-6 py-2">
        <Separator className="bg-gray-200 h-px w-full" />  
        </div> 
        <SidebarContent className="px-3 py-2">
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {firstSection.map((item)=>( 
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton 
                                asChild
                                className={cn(
                                    "h-12 px-4 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200",
                                    pathname===item.href && "bg-primary/10 border-primary/20 text-primary shadow-sm"
                                    )}
                                    
                                    isActive={pathname===item.href}>
                                <Link href={item.href} className="flex items-center gap-3 w-full">
                                <item.icons className={cn(
                                    "size-5 transition-colors",
                                    pathname===item.href ? "text-primary" : "text-gray-600"
                                )}/>
                                    <span className={cn(
                                        "text-sm font-medium tracking-tight",
                                        pathname===item.href ? "text-primary" : "text-gray-700"
                                    )}>
                                    {item.label}
                                    </span>
                                </Link>
                                </SidebarMenuButton>
                                
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            {/* <div className="px-3 py-2">
        <Separator className="bg-gray-200 h-px w-full" />  
        </div>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {secondSection.map((item)=>( 
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton 
                                asChild
                                className={cn(
                                    "h-12 px-4 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200",
                                    pathname===item.href && "bg-primary/10 border-primary/20 text-primary shadow-sm"
                                )}
                                
                                isActive={pathname===item.href}>
                            <Link href={item.href} className="flex items-center gap-3 w-full">
                            <item.icons className={cn(
                                "size-5 transition-colors",
                                pathname===item.href ? "text-primary" : "text-gray-600"
                            )}/>
                                <span className={cn(
                                    "text-sm font-medium tracking-tight",
                                    pathname===item.href ? "text-primary" : "text-gray-700"
                                )}>
                                {item.label}
                                </span>
                            </Link>
                            </SidebarMenuButton>
                            
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup> */}
        </SidebarContent> 
        <SidebarFooter className="text-foreground px-6 py-4 pb-[160px] sm:pb-4 border-t border-gray-100">
  <DashboardUserButton />
</SidebarFooter>

        
        </Sidebar>
    )
}