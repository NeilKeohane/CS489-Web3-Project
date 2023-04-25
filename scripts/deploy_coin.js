const main = async () => {
    const coinFactory = await hre.ethers.getContractFactory("MilestonesCoin");
    const coin = await coinFactory.deploy();
    await coin.deployed();
    console.log("MilestonesCoin contract deployed to:", coin.address);
    const abi = coin.interface.abi;
    console.log(abi)
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


  