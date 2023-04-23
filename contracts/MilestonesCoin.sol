// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract MilestonesCoin {
    string public name = "Milestones Coin";
    string public symbol = "RUN";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10 ** decimals;

    mapping (address => uint256) public balanceOf;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        return true;
    }

}