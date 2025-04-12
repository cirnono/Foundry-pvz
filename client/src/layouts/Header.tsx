import React from "react";
import logo from "../assets/pvz-logo.png";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="bg-header flex justify-between items-center shadow-md fixed px-6 top-0 w-full z-50 border-b border-light-green h-16 sm: h-14">
      {/*LOGO + project name*/}
      <div className="h-full items-center gap-2">
        <img src={logo} alt="Logo" className="h-full object-contain" />
      </div>

      {/*Main Nav*/}
      <div>
        <nav className="flex gap-50 text-2xl text-white">
          <a href="/" className="">
            Home
          </a>
          <a href="/" className="">
            Game
          </a>
          <a href="/" className="">
            NFT
          </a>
          <a href="/" className="">
            Market
          </a>
          <a href="/" className="">
            Ranking
          </a>
        </nav>
      </div>

      {/*Wallet*/}
      <div className="flex items-center">
        <ConnectButton />
      </div>
    </header>
  );
}
