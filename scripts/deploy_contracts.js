const { ethers } = require("hardhat");
const main = async () => {

    // Deploy coin contract
    const coinFactory = await hre.ethers.getContractFactory("MilestonesCoin");
    const coin = await coinFactory.deploy();
    await coin.deployed();
    console.log("MilestonesCoin contract deployed to:", coin.address);
    const CoinABI = coin.interface.abi;
    console.log("Coin Contract ABI: " + CoinABI);
  

    // Deploy main contract
    const mainContract = await hre.ethers.getContractFactory("Workout");
    const contract = await mainContract.deploy(coin.address); 
    await contract.deployed();
    console.log("Workout contract deployed to:", contract.address);
    const abi = contract.interface.abi;
    console.log("Workout Contract ABI: " + abi);
  };
  

  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();


  