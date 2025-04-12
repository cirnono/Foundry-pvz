import React from "react";
import logo from "../assets/pvz-logo.png";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { FaTwitter, FaDiscord, FaGithub, FaTelegram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-header flex w-full px-6 py-6 border-t border-light-green text-sm text-text-gray">
      <div className="flex justify-center gap-30 w-full">
        {/*版权*/}
        <div className="flex gap-2">
          <div>© 2025 PvZ NFT.</div>
          <div>All rights reserved.</div>
        </div>

        <div className="border-l border-text-gray"></div>
        {/*政策*/}
        <div className="flex gap-8">
          <a href="">Privacy</a>
          <a href="">Policy</a>
          <a href="">FAQ</a>
          <a href="">Documents</a>
        </div>
        <div className="border-l border-text-gray"></div>
        {/*社交平台*/}
        <div className="flex gap-8">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaTwitter />
            <span>Twitter</span>
          </a>

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaDiscord />
            <span>Discord</span>
          </a>

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaGithub />
            <span>Github</span>
          </a>

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaTelegram />
            <span>Telegram</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
