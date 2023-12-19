const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0434d2f70234139f780f2b40f79a79f76346778adf0aef7a96d1e98ae819a3067e7f72eae10befa27eb3797a42d2e3a0abe5c830be6a4c1b1bb2f13000d8f0e70d": 100,
  "04fcc52d923f686fb5298e1d94acaa2cd20deb01d35e19d0d5bada5762ded990af8d143263640164978834df5fd4e8179673803199a5fc327eea1eb0adc559ab5c": 50,
  "04b8a54642ec30088a575bd943bc2380b65f3f192fd7272424a4b1cc7ab51b18bc7a2fc23c7daf6087d9aea193d3d1aeff9ad6cd157ac339ee067ead525f8692da": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
