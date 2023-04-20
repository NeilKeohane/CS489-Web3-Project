// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Workout 
{
    struct User
    {
        address id;
        uint256 totalMiles;
        uint256 totalMilesFract;
        uint256 totalHours;  
        uint256 totalMinutes;
        uint256 totalSeconds;
        uint256 longestRunMiles;
        uint256 longestRunFract;
        uint256 numberRuns;
        bool exists;
    }

    struct Exercise 
    {
        uint256 miles;
        uint256 timeH;
        uint256 timeM;
        uint256 timeS;
        bool exists;
    }

struct Reward {
  bool[] milestones;
  bool exists;
}

    mapping (address => User) public database;
    mapping (address => Exercise[]) public log;
    mapping (address => Reward) public rewards;

    constructor()
    {
        console.log("\nWelcome to Milestones.");
    }

    /*
    How much can a function handle...?
    */
    function logExercise(uint256 distanceRanMiles, uint256 distanceRanFract, uint256 hrs, uint256 mins, uint256 secs) public
    {
        // create a new user
        if(!database[msg.sender].exists)
        {
            database[msg.sender] = User(msg.sender, 0, 0, 0, 0, 0, 0, 0, 0, true);
            rewards[msg.sender] = rewards[msg.sender] = Reward({milestones: new bool[](8),exists: true});
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
    
    function rollovers(address person, uint256 distanceRanMiles, uint256 distanceRanFract) public
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

function updateRewards(address person) public {
  Reward storage reward = rewards[person];
  uint256 longestRunMiles = database[person].longestRunMiles;

  if (!reward.exists) {
    reward.milestones = new bool[](8);
    reward.exists = true;
  }

  uint16[8] memory milestones = [1, 25, 75, 150, 250, 500, 750, 1000];

  for (uint i = 0; i < milestones.length; i++) {
    uint16 milestone = milestones[i];

    if (longestRunMiles > milestone && !reward.milestones[i]) {
      reward.milestones[i] = true;
      console.log("Congrats! you reached your", milestones[i], "mile milestone!");
    }
  }
}

    function getMyRuns() public view returns(uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
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
}