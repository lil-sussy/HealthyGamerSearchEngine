"use client";

import React, { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { Button, Drawer, Menu, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Logo from "@/app/_icons/Logo2";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const router = useRouter();
  const menuItems = [
    {
      key: "search",
      label: "Search",
      className: "hover:text-primary text-text",
    },
    {
      key: "about",
      label: "About",
      className: "hover:text-primary text-text",
    },
    {
      key: "how-it-works",
      label: "How it works",
      className: "hover:text-primary text-text",
    },
    {
      key: "contact",
      label: "Contact",
      className: "hover:text-primary text-text",
    },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 w-full bg-layer1 shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Space
            className="flex cursor-pointer items-center gap-2"
            onClick={() => router.push("/")}
          >
            <Logo />
            <span className="text-xl font-bold text-text">K.AI</span>
          </Space>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Menu
              mode="horizontal"
              items={menuItems}
              className="border-0 bg-transparent"
            />
            <Button
              type="primary"
              icon={<FaDiscord />}
              onClick={() => signIn("discord")}
              className="flex items-center gap-2 bg-primary font-normal hover:bg-secondary"
            >
              Login
            </Button>
          </div>

          {/* Mobile Burger Button */}
          <Button
            type="text"
            icon={<MenuOutlined className="text-text" />}
            onClick={() => setIsBurgerOpen(true)}
            className="md:hidden"
          />

          {/* Mobile Drawer */}
          <Drawer
            placement="right"
            onClose={() => setIsBurgerOpen(false)}
            open={isBurgerOpen}
            className="bg-background"
            styles={{ body: { padding: 0 } }}
          >
            <div className="absolute bottom-0 w-full p-4">
              <Button
                block
                type="primary"
                icon={<FaDiscord />}
                onClick={() => signIn("discord")}
                className="mt-4 flex items-center gap-2 bg-primary font-normal hover:bg-secondary"
              >
                Login
              </Button>
            </div>
          </Drawer>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
