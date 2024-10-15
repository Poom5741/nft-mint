// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../contracts/NFTMint.sol";

contract DeployNFTMint is Script {
    function run() external {
        vm.startBroadcast();

        NFTMint nftMint = new NFTMint();
        console.log("NFTMint deployed at:", address(nftMint));

        vm.stopBroadcast();
    }
}
