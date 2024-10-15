// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMint is ERC721URIStorage, Ownable {
    uint256 public currentTokenId = 0;
    uint256 public mintPrice = 0.01 ether;

    // Pass the deployer's address to the Ownable constructor
    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    function mintNFT(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Not enough ETH to mint NFT");

        currentTokenId++;
        uint256 newItemId = currentTokenId;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
