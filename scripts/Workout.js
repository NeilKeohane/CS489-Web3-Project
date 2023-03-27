const main = async () => {
    const [owner, user] = await hre.ethers.getSigners();
    const workoutContractFactory = await hre.ethers.getContractFactory("Workout");
    const workoutContract = await workoutContractFactory.deploy();
    await workoutContract.deployed();
  
    console.log("Contract deployed to:", workoutContract.address);
    console.log("Contract deployed by:", owner.address);
  
    
    let myRun = await workoutContract.connect(user).logExercise(2, 0, 18, 30);
    await myRun.wait();
    

    let allMyRuns = await workoutContract.connect(user).getMyRuns();
    // await allMyRuns.wait();



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