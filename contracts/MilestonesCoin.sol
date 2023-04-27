// SPDX-License-Identifier: MIT
import "hardhat/console.sol";
pragma solidity ^0.8.19;

contract MilestonesCoin {
    string public name = "Milestones Coin";
    string public symbol = "RUN";
    uint8 public decimals = 0;
    uint256 public totalSupply = 1000000 * 10;

    mapping (address => uint256) public balanceOf;

    constructor() {
        balanceOf[address(this)] = totalSupply;
    }

    function transfer(address _to, uint256 _value) external returns (bool success) {
        require(balanceOf[address(this)] >= _value, "Cannot transfer coin: Insufficient balance");
        balanceOf[address(this)] -= _value;
        balanceOf[_to] += _value;
        return true;
    }

    function getBalance(address _userAddress) public view returns (uint256) {
        return balanceOf[_userAddress];
    }
}








