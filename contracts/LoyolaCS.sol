// SPDX-License-Identifier: UNLICENSED
import "hardhat/console.sol";
pragma solidity ^0.8.19;

contract LoyolaCS {
        struct User
    {
        address id;
        bool exists;
    }

    mapping (address => User) public database;
   constructor() {
    console.log("constructed");
   }

   function getMilesRun() public view returns (uint8) {
        console.log("Func run");
        return 100;
    }

    function createNew(address id) public {
        console.log("Creating new user");
        address userAddress = id; // convert id to an address
        require(!database[userAddress].exists, "User already exists.");
        console.log(userAddress);
        database[userAddress] = User(userAddress, true);
        console.log("Successfully created new user");
    }
}
