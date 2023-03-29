require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
    chainId: 1337
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    goerli: {
      url: "https://eth-mainnet.g.alchemy.com/v2/SS0cHVgewZxkTbqeptcBizJ07YUMdYFf",
      accounts: ["a4265a4b23766be526b6b9bd89645a418e1f6e6499309fe0f6aa37838d5cacbd"]
    }
  }
};
