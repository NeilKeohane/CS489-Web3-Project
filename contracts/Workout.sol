// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Workout 
{
    struct User
    {
        address id;
        // add a password using keccak?
        uint256 totalMiles;
        uint256 totalMilesFract;
        // don't know if we should be using built-in 'hours', etc.
        // will need to figure out formatting/conversions too (ie 65 seconds -> 1 min,05s)
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


    struct Reward
    {
        bool mile1;
        bool mile25;
        bool mile75;
        bool mile150;
        bool mile250;
        bool mile500;
        bool mile750;
        bool mile1000;
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
            rewards[msg.sender] = Reward(false, false, false, false, false, false, false, false, true);
        }

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
        Rollover time conversions
        if seconds >= 60, add floor value to minutes and keep modulus as seconds
        if minutes >= 60, add floor value to hours and keep modulus as minutes 
        */

        if(database[msg.sender].totalSeconds >= 60)
        {
            database[msg.sender].totalMinutes += (database[msg.sender].totalSeconds / 60);
            database[msg.sender].totalSeconds = database[msg.sender].totalSeconds % 60;
        }
        if(database[msg.sender].totalMinutes >= 60)
        {
            database[msg.sender].totalHours += (database[msg.sender].totalMinutes / 60);
            database[msg.sender].totalMinutes = database[msg.sender].totalMinutes % 60;
        }

        /*
        Rollover mile conversions
        if totalMilesFract >= 100 add floor value / 100 to totalMiles and keep modulus as self
        */
        if(database[msg.sender].totalMilesFract >= 100)
        {
            database[msg.sender].totalMiles += (database[msg.sender].totalMilesFract / 100);
            database[msg.sender].totalMilesFract = (database[msg.sender].totalMilesFract % 100);
        }

        console.log("\nWorkout successfully added!");

        if(database[msg.sender].longestRunFract < distanceRanFract)
        {
            if(database[msg.sender].longestRunMiles <= distanceRanMiles)
            {
                database[msg.sender].longestRunMiles = distanceRanMiles;
                database[msg.sender].longestRunFract = distanceRanFract;
                console.log("\nNew distance record!");
            }
        }

        /*
        Reach award levels... prob a simpler way to do this?
        */


        if(database[msg.sender].longestRunMiles > 1 && rewards[msg.sender].mile1 == false)
        {
            rewards[msg.sender].mile1 = true;
            console.log("New milestone reached! You've run your first mile!");
        }
        if(database[msg.sender].longestRunMiles > 25 && rewards[msg.sender].mile25 == false)
        {
            rewards[msg.sender].mile25 = true;
            console.log("New milestone reached! You've run your 25th mile!");
        }
        if(database[msg.sender].longestRunMiles > 75 && rewards[msg.sender].mile75 == false)
        {
            rewards[msg.sender].mile75 = true;
            console.log("New milestone reached! You've run your 75th mile!");
        }
        if(database[msg.sender].longestRunMiles > 150 && rewards[msg.sender].mile150 == false)
        {
            rewards[msg.sender].mile150 = true;
            console.log("New milestone reached! You've run your 150th mile!");
        }
        if(database[msg.sender].longestRunMiles > 250 && rewards[msg.sender].mile250 == false)
        {
            rewards[msg.sender].mile250 = true;
            console.log("New milestone reached! You've run your 250th mile!");
        }
        if(database[msg.sender].longestRunMiles > 500 && rewards[msg.sender].mile500 == false)
        {
            rewards[msg.sender].mile500 = true;
            console.log("New milestone reached! You've run your 500th mile!");
        }
        if(database[msg.sender].longestRunMiles > 750 && rewards[msg.sender].mile750 == false)
        {
            rewards[msg.sender].mile750 = true;
            console.log("New milestone reached! You've run your 750th mile!");
        }
        if(database[msg.sender].longestRunMiles > 1000 && rewards[msg.sender].mile1000 == false)
        {
            rewards[msg.sender].mile1000 = true;
            console.log("New milestone reached! You've run your 1000th mile!");
        }

    }

    function getMyRuns() public view
    {
        require(database[msg.sender].exists, "This user does not exist.");
        console.log("\nMy Runs: ");
        console.log("\tTotal Distance:    %d.%d mi.", database[msg.sender].totalMiles, database[msg.sender].totalMilesFract);
        console.log("\tTotal Time:        %d:%d:%d", database[msg.sender].totalHours, database[msg.sender].totalMinutes, database[msg.sender].totalSeconds);
        console.log("\tNumber of Runs:    %d runs", database[msg.sender].numberRuns);
        console.log("\tMy Longest Run:    %d.%d mi.", database[msg.sender].longestRunMiles, database[msg.sender].longestRunFract);
    }


}