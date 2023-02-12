import nextConnect from "next-connect";

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

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
  .post((req, res) => {})
  .put((req, res, next) => {
    try {
      const { sender, recipient, amount } = req.body;

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
