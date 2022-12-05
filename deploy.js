const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // compile them in our code
  // compile them seperately
  // http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying please wait...");
  const contract = await contractFactory.deploy(); // Stop and wait for contract to deploy.
  await contract.deployTransaction.wait(1);
  //const transactionReceipt = await contract.deployTransaction.wait(1);
  //console.log("Here is the depolyment transaction (transaction response): ");
  //console.log(contract.deployTransaction);
  //console.log("Here is the transaction receipt: ");
  //console.log(transactionReceipt);
  // console.log("Let's depoly with only transaction data! ");
  // const tx = {
  //   nonce: 3,
  //   gasPrice: 20000000000,
  //   gasLimit: 6721975,
  //   to: null,
  //   value: 0,
  //   data: "0x608060405234801561001057600080fd5b506101b1806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80632e64cec1146100515780633c8df6521461006f5780634f2be91f1461008d5780636057361d146100ab575b600080fd5b6100596100c7565b6040516100669190610102565b60405180910390f35b6100776100d0565b6040516100849190610102565b60405180910390f35b6100956100d6565b6040516100a29190610102565b60405180910390f35b6100c560048036038101906100c0919061014e565b6100df565b005b60008054905090565b60005481565b60006002905090565b8060008190555050565b6000819050919050565b6100fc816100e9565b82525050565b600060208201905061011760008301846100f3565b92915050565b600080fd5b61012b816100e9565b811461013657600080fd5b50565b60008135905061014881610122565b92915050565b6000602082840312156101645761016361011d565b5b600061017284828501610139565b9150509291505056fea2646970667358221220b2eecf15c9080ef826f728a13df3539f36ca4d7f16a9d964f136b4beacaefb6b64736f6c63430008080033",
  //   chainId: 5777,
  // };
  // const sentTxResponse = await wallet.sendTransaction(tx);
  // await sentTxResponse.wait(1);
  // console.log(sentTxResponse);
  const favNum = await contract.retrieve();
  console.log(`The current favourite number is: ${favNum.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavNum = await contract.retrieve();
  console.log(`Updated favourite number: ${updatedFavNum.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
