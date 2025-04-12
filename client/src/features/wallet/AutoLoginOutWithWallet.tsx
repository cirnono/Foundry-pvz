import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";

export default function AutoLoginOutWithWallet() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loggedIn, setLoggedIn] = useState(false);

  //Auto Login
  useEffect(() => {
    if (!isConnected || loggedIn) return;
    login();
  }, [isConnected]);

  //Auto Logout
  useEffect(() => {
    if (!isConnected && loggedIn) {
      logout();
    }
  }, [isConnected]);

  const login = async () => {
    console.log("111");
    const res = await fetch("/api/nonce");
    const { nonce } = await res.json();

    const message =
      "Login to Foundry-pvz at ${Date.now()} with nonce: ${nonce}";
    const signature = await signMessageAsync({ message });

    const verify = await fetch("/api.login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, nonce, signature }),
    });

    const result = await verify.json();
    if (result.success) {
      setLoggedIn(true);
      console.log("已登录: ${address}");
    } else alert("登录失败。");
  };

  const logout = async () => {
    setLoggedIn(false);
  };

  return { address, isConnected, loggedIn };
}
