import Link from "next/link";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import Navbar from "@/app/_components/Navbar/Navbar";
import { HeroSection } from "@/heroSection/HeroSection";
import Background from "@/app/_components/Background";
import { ConfigProvider } from "antd";
import theme from "@/styles/theme";
import AboutSection from "@/app/_components/AboutSection";
import HowItWorksSection from "@/app/_components/HowitworksSection";
import ContactSection from "@/contactSection/ContactSection";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme.colors.primary,
            colorPrimaryText: theme.colors.primary,
            colorPrimaryBg: theme.colors.background,
            colorPrimaryBgHover: theme.colors.layer1,
          },
          hashed: false,
        }}
      >
        <div className="relative z-0 w-screen bg-background bg-gradient-to-b from-primary/30 to-secondary/30">
          {/* <Background /> */}
          <Navbar />
          <div className="flex flex-col gap-16">
            <HeroSection />
            <AboutSection />
            <HowItWorksSection />
            <ContactSection />
          </div>
        </div>
      </ConfigProvider>
    </HydrateClient>
  );
}
