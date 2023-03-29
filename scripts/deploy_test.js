const main = async () => {
    const testFactory = await hre.ethers.getContractFactory("LoyolaCS");
    const test = await testFactory.deploy();
    await test.deployed();
    console.log("Contract deployed to:", test.address);
    const abi = test.interface.abi;
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


  