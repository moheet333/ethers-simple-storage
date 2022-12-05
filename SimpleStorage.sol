// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract SimpleStorage {
    uint256 public favNum;

    function store(uint256 _favNum) public {
        favNum = _favNum;
    }

    function retrieve() public view returns (uint256) {
        return favNum;
    }

    function add() public pure returns (uint256) {
        return (1 + 1);
    }
}
