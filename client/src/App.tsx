import React from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Header from "./layouts/Header";
import "./styles/index.css";

import AutoLoginOutWithWallet from "./features/wallet/AutoLoginOutWithWallet";
import MainLayout from "./layouts/MainLayout";

function App() {
  const [count, setCount] = useState(0);
  const { address, isConnected, loggedIn } = AutoLoginOutWithWallet();

  return (
    <MainLayout>
      <div className="space-y-6  bg-main">
        <p className="text-lg bg-main">欢迎来到 Web3 世界 👋</p>
        <p>这里是内容区域，可以随便滚动。</p>
        <div className="h-[1000px] bg-main">🧪 模拟长内容</div>
      </div>
    </MainLayout>
  );
}

export default App;
