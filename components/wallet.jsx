import { useEffect, useRef, useState } from "react";
import { server } from "@/configs/axios.config";
import {
  decryptText,
  encrypText,
  generateRandomPublicPrivateKey,
  getPublicKey,
} from "@/utils/cryptography-utils";

function Wallet({ address, setWalletInfo, balance, setBalance }) {
  const [wallets, setWallets] = useState([]);

  async function onChange(evt) {
    const privateKey = evt.target.value;
    if (privateKey === "Select a Wallet") return;
    const address = getPublicKey(decryptText(privateKey));

    setWalletInfo({
      privateKey,
      address,
    });
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

  const loadWallets = () => {
    const allKeys = localStorage.getItem("wallets");
    if (allKeys) setWallets(JSON.parse(allKeys));
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const onWalletCreate = async (publicKey) => {
    try {
      const {
        data: { balance },
      } = await server.post(`balance`, {
        address: publicKey,
      });

      return balance;
    } catch (err) {
      return 0;
    }
  };

  const onCreateKey = () => {
    const { privateKey, publicKey } = generateRandomPublicPrivateKey();
    const encryptedPrivateKey = encrypText(privateKey);

    const payload = [
      {
        privateKey: encryptedPrivateKey,
        publicKey,
      },
    ];

    const storedWallets = localStorage.getItem("wallets");
    if (storedWallets && storedWallets.length) {
      const _storedWallets = JSON.parse(storedWallets);
      const keys = [...payload, ..._storedWallets];
      localStorage.setItem("wallets", JSON.stringify(keys));
    } else localStorage.setItem("wallets", JSON.stringify(payload));

    try {
      onWalletCreate(publicKey)
        .then(() => {
          loadWallets();
        })
        .catch((err) => {});
    } catch (err) {}
  };

  const copyButtonRef = useRef(null);
  const setTimeoutId = useRef(null);
  const onCopy = () => {
    navigator.clipboard.writeText(address).then(
      function () {
        copyButtonRef.current.style.display = "inline-block";
        clearTimeout(setTimeoutId.current);

        setTimeoutId.current = setTimeout(() => {
          copyButtonRef.current.style.display = "none";
        }, 1000);
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <p>Total Wallets {wallets.length}</p>

      <label>
        Wallet Addresses
        <select onChange={onChange} defaultValue="Select a Wallet">
          <option>Select a Wallet</option>
          {wallets.map(({ publicKey, privateKey }) => (
            <option key={publicKey} value={privateKey}>
              {publicKey}
            </option>
          ))}
        </select>
      </label>

      <div className="balance">Balance: {balance}</div>

      <div className="container-button buttons-container-flex">
        <button className="button-gen-wallet" onClick={onCreateKey}>
          Generate Wallet
        </button>

        <button className="button-gen-outline" onClick={onCopy}>
          Copy Address&nbsp;
          <span ref={copyButtonRef} style={{ display: "none" }}>
            &#x2705;
          </span>
        </button>
      </div>
    </div>
  );
}

export default Wallet;
