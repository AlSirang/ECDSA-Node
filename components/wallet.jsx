import { server } from "@/configs/axios.config";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance`, { params: { address } });
      setBalance(balance);
    } else {
      setBalance(0);
    }
  } // dropdown with all wallet addresses.
  // button to create new wallet

  // when wallet is created send create and generate balance

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        />
      </label>

      <div className="balance">Balance: {balance}</div>

      <div>
        <button>Generate Wallet</button>
      </div>
    </div>
  );
}

export default Wallet;
