import React, { useState } from "react";
import { FaDiscord, FaBars, FaTimes } from "react-icons/fa";
import { Button } from "antd";
import Logo from "../Logo2.tsx";

const NavBar = () => {
  const [error] = useState("");

  const discordClientId = "1234460436745949185"; // Replace with your Discord Client ID
  let redirect;
  if (window.location.hostname === "localhost") {
    redirect = "http://localhost:8000"; // Update according to your redirect URI
  } else {
    redirect = "https://" + window.location.hostname; // Update according to your redirect URI
  }
  redirect += "/auth/callback/discord";
  const redirectUri = encodeURIComponent(redirect); // Update according to your redirect URI

  const handleLogin = () => {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
    window.location.href = discordAuthUrl; // Redirect user to Discord login
  };

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  return (
    <div className="fixed w-full top-0 left-0 right-0 z-50 px-4">
      <div className="w-full box-border h-16 p-4 bg-white bg-opacity-30 backdrop-blur-lg flex justify-between items-center relative">
        <div className="text-2xl cursor-pointer md:hidden" onClick={toggleBurgerMenu}>
          {isBurgerOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div className="flex items-center justify-start flex-grow text-center">
          <Logo />
          <span className="hidden md:block ml-2 text-xl font-bold">HGG AI</span>
        </div>
        <div
          className={`flex items-center gap-20 ${
            isBurgerOpen
              ? "flex-col absolute top-12 left-0 right-0 bg-white bg-opacity-30 backdrop-blur-md p-4 shadow-md"
              : "hidden md:flex"
          }`}
        >
          <Button type="link" className="text-black text-lg font-normal">
            Search
          </Button>
          <Button type="link" className="text-black text-lg font-normal">
            About
          </Button>
          <Button type="link" className="text-black text-lg font-normal">
            How it works
          </Button>
          <Button type="link" className="text-black text-lg font-normal">
            Contact
          </Button>
          <Button
            type="primary"
            onClick={handleLogin}
            className="flex items-center gap-2 text-black text-lg font-normal hover:text-indigo-600 transition-colors"
          >
            <FaDiscord />
            Login
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
