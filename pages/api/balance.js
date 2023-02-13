import { recoverPublicKey } from "@/utils/cryptography-utils";
import { hexToBytes } from "ethereum-cryptography/utils";
import nextConnect from "next-connect";

const balances = {};

const router = nextConnect({
  onError: (err, req, res) => {
    res.status(err.status || 500).json({ message: err.message });
    res.end();
  },
  onNoMatch: (req, res) => {
    res.sendStatus(404);
    res.end();
  },
})
  .get((req, res) => {
    const { address } = req.query;
    const balance = balances[address] || 0;
    res.send({ balance });
  })
  .post((req, res) => {
    const { address } = req.body;
    const balance = Math.ceil(Math.random() * 100);
    balances[address] = balance;
    res.send({ balance });
  })
  .put((req, res, next) => {
    try {
      const { message, sender, signature, recoveryBit, recipient, amount } =
        req.body;

      const signatureWallet = recoverPublicKey(
        message,
        hexToBytes(signature),
        recoveryBit
      );

      if (sender !== signatureWallet)
        return res.status(400).send({
          message: "signature wallet and selected account do not match",
        });

      setInitialBalance(sender);
      setInitialBalance(recipient);

      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
    } catch (err) {
      next(err);
    }
  });

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

export default router;
