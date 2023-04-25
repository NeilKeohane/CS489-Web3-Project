// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "./MilestonesCoin.sol";

contract Workout 
{
    struct User
    {
        address id;
        uint16 totalMiles;
        uint16 totalMilesFract;
        uint16 totalHours;  
        uint16 totalMinutes;
        uint16 totalSeconds;
        uint16 longestRunMiles;
        uint16 longestRunFract;
        uint16 numberRuns;
        bool exists;
    }

    struct Exercise 
    {
        uint8 miles;
        uint8 timeH;
        uint8 timeM;
        uint8 timeS;
        bool exists;
    }

struct Reward {
  bool[] milestones;
  bool exists;
}

    mapping (address => User) public database;
    mapping (address => Exercise[]) public log;
    mapping (address => Reward) public rewards;
    MilestonesCoin public coin;

    constructor(MilestonesCoin _coin)
    {
        coin = _coin;
        console.log("\nWelcome to Milestones.");

        // TESTING PURPOSES:
        // Automatically initializes the sender of the contract to be in the database with the following values
        // It also sets the '75' mile milestone to true
        database[msg.sender] = User(msg.sender, 10, 11, 12, 13, 14, 15, 16, 17, true);
        rewards[msg.sender] = rewards[msg.sender] = Reward({milestones: new bool[](8),exists: true});
        rewards[msg.sender].milestones[2] = true;

    }


    // NEED TO ADD THIS TO FRONT END *****
    function logExercise(uint8 distanceRanMiles,uint8 distanceRanFract, uint8 hrs, uint8 mins, uint8 secs) public
    {
        // create a new user
        if(!database[msg.sender].exists)
        {
            database[msg.sender] = User(msg.sender, 0, 0, 0, 0, 0, 0, 0, 0, true);
            rewards[msg.sender] = Reward({milestones: new bool[](8),exists: true});
        }

        // require statements 
        require(database[msg.sender].exists, "Issue with creating this user.");
        require(distanceRanMiles >= 0, "You cannot run a negative distance.");
        require(distanceRanFract >= 0, "You cannot run a negative distance.");
        require(distanceRanFract != 0 || distanceRanMiles !=0, "You must run over 0.0 miles.");
        require(hrs >= 0, "You cannot input a negative time.");
        require(mins >= 0, "You cannot input a negative time.");
        require(secs >= 0, "You cannot input a negative time.");
        require(hrs != 0 || mins != 0 || secs != 0, "You must input a time greater than 0:00:00.");

        // create a new exercise and update User values
        log[msg.sender].push(Exercise(distanceRanMiles, hrs, mins, secs, true));
        database[msg.sender].totalMiles += distanceRanMiles;
        database[msg.sender].totalMilesFract += distanceRanFract;
        database[msg.sender].totalHours += hrs;
        database[msg.sender].totalMinutes += mins;
        database[msg.sender].totalSeconds += secs;
        database[msg.sender].numberRuns += 1;

        /*
        Rollover conversions
        */
        rollovers(msg.sender, distanceRanMiles, distanceRanFract);

        /*
        Reach award levels... prob a simpler way to do this?
        */
        updateRewards(msg.sender);

    }
    
    function rollovers(address person, uint16 distanceRanMiles, uint16 distanceRanFract) internal
    {
        /*
        Rollover time conversions
        if seconds >= 60, add floor value to minutes and keep modulus as seconds
        if minutes >= 60, add floor value to hours and keep modulus as minutes 
        */

        if(database[person].totalSeconds >= 60)
        {
            database[person].totalMinutes += (database[person].totalSeconds / 60);
            database[person].totalSeconds = database[person].totalSeconds % 60;
        }
        if(database[person].totalMinutes >= 60)
        {
            database[person].totalHours += (database[person].totalMinutes / 60);
            database[person].totalMinutes = database[person].totalMinutes % 60;
        }

        /*
        Rollover mile conversions
        if totalMilesFract >= 100 add floor value / 100 to totalMiles and keep modulus as self
        */
        if(database[person].totalMilesFract >= 100)
        {
            database[person].totalMiles += (database[person].totalMilesFract / 100);
            database[person].totalMilesFract = (database[person].totalMilesFract % 100);
        }

        console.log("\nWorkout successfully added!");

        if(database[person].longestRunFract < distanceRanFract)
        {
            if(database[person].longestRunMiles <= distanceRanMiles)
            {
                database[person].longestRunMiles = distanceRanMiles;
                database[person].longestRunFract = distanceRanFract;
                console.log("\nNew distance record!");
            }
        }
    }

function updateRewards(address person) internal {
  Reward storage reward = rewards[person];
  uint256 totalMiles = database[person].totalMiles;

  if (!reward.exists) {
    reward.milestones = new bool[](8);
    reward.exists = true;
  }

  uint16[8] memory milestones = [1, 25, 75, 150, 250, 500, 750, 1000];

  for (uint i = 0; i < milestones.length; i++) {
    uint16 milestone = milestones[i];

    if (totalMiles > milestone && !reward.milestones[i]) {
      reward.milestones[i] = true;
      coin.transfer(person, milestones[i]);
      console.log("Congrats! you reached your", milestones[i], "mile milestone!");
    }
  }
}

// NEED TO ADD DISPLAY FOR THIS AND TEST ON FRONT END
    function getMyRuns() public view returns(uint16, uint16, uint16, uint16, uint16, uint16, uint16, uint16)
    {
        address p = msg.sender;
        // require(database[msg.sender].exists, "This user does not exist.");
        // console.log("\nMy Runs: ");
        // console.log("\tTotal Distance:    %d.%d mi.", database[msg.sender].totalMiles, database[msg.sender].totalMilesFract);
        // console.log("\tTotal Time:        %d:%d:%d", database[msg.sender].totalHours, database[msg.sender].totalMinutes, database[msg.sender].totalSeconds);
        // console.log("\tNumber of Runs:    %d runs", database[msg.sender].numberRuns);
        // console.log("\tMy Longest Run:    %d.%d mi.", database[msg.sender].longestRunMiles, database[msg.sender].longestRunFract);
        return (database[p].totalMiles, database[p].totalMilesFract, database[p].totalHours, database[p].totalMinutes, database[p].totalSeconds, database[p].numberRuns,
        database[p].longestRunMiles, database[p].longestRunFract);
    }


// Works on front end
function getTotalTimeSpent() public view returns (uint16, uint16)
{
    console.log("Getting total time spent...");
    require(database[msg.sender].exists, "User does not exist");
    console.log("After printing total hours");
    return (database[msg.sender].totalHours, database[msg.sender].totalMinutes);
}



// Works on front end
function getMilesRun() public view returns (uint16)
{
    return database[msg.sender].totalMiles;
}




// TEST THIS FUNCTION ON FRONT END
function getBalance() public view returns (uint256)
{
 return coin.getBalance(msg.sender);   
}



// Workso on front end
function getRewards() public view returns (uint16[] memory){ // Add error checking if user does not exist

    require(database[msg.sender].exists, "User does not exist");
    console.log("User exists... getting rewards...");
    Reward storage reward = rewards[msg.sender];
    uint16[8] memory milestones = [1, 25, 75, 150, 250, 500, 750, 1000];
    uint16[] memory completed = new uint16[](8);
    
    uint8 count = 0;
    for(uint i = 0; i < milestones.length; i++) {
        if(reward.milestones[i]){
            completed[count] = milestones[i];
        }
        count++;
    }

    return completed;
}



}