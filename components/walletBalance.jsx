import { useState } from "react";
import { server } from "@/configs/axios.config";

function WalletBalance() {
  const [balance, setBalance] = useState(0);
  async function onChange(evt) {
    const address = evt.target.value;

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance`, { params: { address } });
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Check Wallet Balance</h1>

      <label htmlFor="wallet">
        Enter Wallet Addresses
        <input
          type="text"
          name="wallet"
          id="wallet"
          autoComplete="off"
          onChange={onChange}
        />
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default WalletBalance;
