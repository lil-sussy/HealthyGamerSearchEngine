import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import Navbar from "@/app/_components/Navbar/Navbar";
import { HeroSection } from "@/heroSection/HeroSection";
import Background from "@/app/_components/Background";
import { ConfigProvider } from "antd";
import theme from "@/styles/theme";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <ConfigProvider theme={{
        token: {
          colorPrimary: theme.colors.primary,
          colorPrimaryText: theme.colors.primary,
          colorPrimaryBg: theme.colors.background,
          colorPrimaryBgHover: theme.colors.layer1,
        }
      }}>
        <div className="h-screen w-screen bg-background bg-gradient-to-b from-primary/30 to-secondary/30 relative z-0">
          <Background />
          <Navbar />
          <div>
            <HeroSection />
          </div>
        </div>
      </ConfigProvider>
    </HydrateClient>
  );
}
