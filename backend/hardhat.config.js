require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const GANACHE_RPC_URL = "HTTP://127.0.0.1:7545";
const GANACHE_PRIVATE_KEY = "3478fc06d63bae88a072462eaa51b6c969509e390328ef97800a21fdd5875fd9";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: GANACHE_RPC_URL,
      accounts: [
        GANACHE_PRIVATE_KEY
      ],
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
    },
  },
};