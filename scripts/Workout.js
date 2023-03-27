const main = async () => {
  const [owner, user] = await hre.ethers.getSigners();
  const workoutContractFactory = await hre.ethers.getContractFactory("Workout");
  const workoutContract = await workoutContractFactory.deploy();
  await workoutContract.deployed();

  // console.log("Contract deployed to:", workoutContract.address);
  // console.log("Contract deployed by:", owner.address);

  // logExercise parameters = (uint256 distanceRanMiles, uint256 distanceRanFract, uint256 hrs, uint256 mins, uint256 secs)

  let myRun = await workoutContract.connect(user).logExercise(2, 15, 0, 18, 30);
  await myRun.wait();

  let allMyRuns = await workoutContract.connect(user).getMyRuns();
  // await allMyRuns.wait();

  let myRun2 = await workoutContract.connect(user).logExercise(3, 55, 0, 35, 21);
  await myRun.wait();

  let allMyRuns2 = await workoutContract.connect(user).getMyRuns();

  /*
  figure out time representation... 
  */

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