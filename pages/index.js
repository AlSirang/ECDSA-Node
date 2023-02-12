// import { Inter } from "@next/font/google";
// const inter = Inter({ subsets: ["latin"] });
import { useState } from "react";

import Transfer from "@/components/transfer";
import Wallet from "@/components/wallet";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}
