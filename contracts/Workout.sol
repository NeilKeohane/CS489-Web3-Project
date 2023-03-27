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

    mapping (address => User) public database;
    mapping (address => Exercise[]) public log;

    constructor()
    {
        console.log("\nWelcome to Milestones.");
    }

    function logExercise(uint256 distanceRanMiles, uint256 distanceRanFract, uint256 hrs, uint256 mins, uint256 secs) public
    {
        // create a new user
        if(!database[msg.sender].exists)
        {
            database[msg.sender] = User(msg.sender, 0, 0, 0, 0, 0, 0, 0, true);
        }

        require(database[msg.sender].exists, "Issue with creating this user.");

        // create a new exercise
        log[msg.sender].push(Exercise(distanceRanMiles, hrs, mins, secs, true));
        database[msg.sender].totalMiles += distanceRanMiles;
        database[msg.sender].totalMilesFract += distanceRanFract;
        database[msg.sender].totalHours += hrs;
        database[msg.sender].totalMinutes += mins;
        database[msg.sender].totalSeconds += secs;

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
        
    }

    function getMyRuns() public view
    {
        require(database[msg.sender].exists, "This user does not exist.");
        console.log("\nMy Runs: ");
        console.log("\tMy Longest Run:    %d.%d mi.", database[msg.sender].longestRunMiles, database[msg.sender].longestRunFract);
        console.log("\tTotal Distance:    %d.%d mi.", database[msg.sender].totalMiles, database[msg.sender].totalMilesFract);
        console.log("\tTotal Time:        %d:%d:%d", database[msg.sender].totalHours, database[msg.sender].totalMinutes, database[msg.sender].totalSeconds);
        
    
    }


}