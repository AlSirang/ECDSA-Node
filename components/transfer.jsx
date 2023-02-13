import { useState } from "react";
import { server } from "@/configs/axios.config";
import { decryptText, signMessage } from "@/utils/cryptography-utils";
import { toHex } from "ethereum-cryptography/utils";

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const privateKeyDecrypted = decryptText(privateKey);
      const message = `Transfer ${sendAmount} to ${recipient}`;
      const [signature, recoveryBit] = await signMessage(
        message,
        privateKeyDecrypted
      );
      const {
        data: { balance },
      } = await server.put("/balance", {
        amount: parseInt(sendAmount),
        recipient,
        message,
        signature: toHex(signature),
        recoveryBit,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
          type="number"
          min="0"
        />
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
