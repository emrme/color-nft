const opensea = require("opensea-js");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;

const HDWalletProvider = require("truffle-hdwallet-provider");
const MnemonicWalletSubprovider = require("@0x/subproviders")
  .MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const web3 = require("web3");
const Web3ProviderEngine = require("web3-provider-engine");
const MNEMONIC = process.env.MNEMONIC;
const INFURA_KEY = process.env.INFURA_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

const NUM_FIXED_PRICE_AUCTIONS = 10; // totalsuppy
const FIXED_PRICE = 0.23; //eth

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address"
      }
    ],
    name: "mintTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

if (!MNEMONIC || !INFURA_KEY || !NETWORK || !OWNER_ADDRESS) {
  console.error(
    "Please set a mnemonic, infura key, owner, network, and contract address."
  );
  return;
}
const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
  mnemonic: MNEMONIC,
  baseDerivationPath: BASE_DERIVATION_PATH
});
const infuraRpcSubprovider = new RPCSubprovider({
  rpcUrl: "https://" + NETWORK + ".infura.io/" + INFURA_KEY
});

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(mnemonicWalletSubprovider);
providerEngine.addProvider(infuraRpcSubprovider);
providerEngine.start();

const web3Instance = new web3(providerEngine);

const seaport = new OpenSeaPort(
  providerEngine,
  {
    networkName: Network.Rinkeby
  },
  arg => console.log(arg)
);

async function main() {
  if (NFT_CONTRACT_ADDRESS) {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );
    var totalSpl = nftContract.methods.totalSupply();
    console.log("Creating fixed price auctions...");

    for (var i = 1; i < totalSpl; i++) {
      const sellOrder = await seaport.createSellOrder({
        tokenId: i,
        tokenAddress: NFT_CONTRACT_ADDRESS,
        accountAddress: OWNER_ADDRESS,
        startAmount: FIXED_PRICE
      });
      console.log(sellOrder);
    }
  }
}

main();
