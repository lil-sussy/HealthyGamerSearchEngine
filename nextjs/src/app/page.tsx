import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import Navbar from "@/app/_components/Navbar/Navbar";
export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="h-screen w-screen bg-background">
        <Navbar />
        <div>

        </div>
      </div>
    </HydrateClient>
  );
}
