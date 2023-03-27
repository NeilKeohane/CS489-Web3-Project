// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Workout 
{

    struct User
    {
        address id;
        uint256 totalMiles;
        uint256 totalHours;
        uint256 totalMinutes;
        uint256 totalSeconds;
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
        console.log("Welcome to our workout platform.\n");
    }

    function logExercise(uint256 distanceRan, uint256 hrs, uint256 mins, uint256 secs) public
    {
        // create a new user
        if(!database[msg.sender].exists)
        {
            database[msg.sender] = User(msg.sender, 0, 0, 0, 0, true);
        }

        require(database[msg.sender].exists, "Issue with creating this user.");

        // create a new exercise
        log[msg.sender].push(Exercise(distanceRan, hrs, mins, secs, true));
        database[msg.sender].totalMiles += distanceRan;
        database[msg.sender].totalHours += hrs;
        database[msg.sender].totalMinutes += mins;
        database[msg.sender].totalSeconds += secs;
    }

    function getMyRuns() public view
    {
        require(database[msg.sender].exists, "This user does not exist.");
        console.log("My Runs: ");
        console.log("\tTotal Miles: %s", database[msg.sender].totalMiles);
        console.log("\tTotal Time:  %s:%s:%s", database[msg.sender].totalHours, database[msg.sender].totalMinutes, database[msg.sender].totalSeconds);
        
        // database[msg.sender].totalHours, 
        //database[msg.sender].totalMinutes, database[msg.sender].totalSeconds);
        //console.log("Hello"); \n\t%s\n\t%s\n\t%s\n
    }


}