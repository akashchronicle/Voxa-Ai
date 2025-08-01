import { auth } from "@/lib/auth";
import { DemoView } from "@/modules/demo/ui/views/demo-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DemoPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <DemoView />;
};

export default DemoPage; 