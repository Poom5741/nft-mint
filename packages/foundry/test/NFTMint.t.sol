// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";  // Foundry's standard test utilities
import "../contracts/NFTMint.sol";  // Adjust the path if necessary

contract NFTMintTest is Test {
    NFTMint public nftMint;  // The contract we are testing

    address public owner = address(0x123); // Mock owner address
    address public user1 = address(0x456); // Mock user1 address

    uint256 public mintPrice = 0.01 ether; // Define mint price

    // Define the custom error used by the Ownable contract
    error OwnableUnauthorizedAccount(address account);

    // Setup function runs before each test
    function setUp() public {
        // Deploy the NFT contract with the owner
        vm.prank(owner);  // Use prank to simulate owner as the sender
        nftMint = new NFTMint();
    }

    // Test that the contract was deployed correctly
    function testInitialDeployment() public view {
        // Verify the owner of the contract
        assertEq(nftMint.owner(), owner);

        // Check that the initial currentTokenId is 0
        assertEq(nftMint.currentTokenId(), 0);
    }

    // Test minting an NFT
    function testMintNFT() public {
        // Simulate user1 minting an NFT
        vm.deal(user1, 1 ether);  // Give user1 some ether to cover gas and minting
        vm.prank(user1);  // User1 mints the NFT
        nftMint.mintNFT{value: mintPrice}("ipfs://exampleMetadata1");

        // Check that currentTokenId is incremented
        assertEq(nftMint.currentTokenId(), 1);

        // Check that the token owner is user1
        assertEq(nftMint.ownerOf(1), user1);

        // Check that the token URI is correct
        assertEq(nftMint.tokenURI(1), "ipfs://exampleMetadata1");
    }

    // Test that minting requires sufficient ETH
    function testMintNFTFailsWithInsufficientFunds() public {
        // Try minting with insufficient funds (0.005 ETH)
        vm.deal(user1, 1 ether);  // Give user1 some ether
        vm.prank(user1);  // User1 tries to mint

        vm.expectRevert("Not enough ETH to mint NFT");  // Expect the revert error
        nftMint.mintNFT{value: 0.005 ether}("ipfs://exampleMetadata1");  // Not enough ETH
    }

    // Test that only the owner can withdraw funds
    function testOnlyOwnerCanWithdraw() public {
        // First, simulate user1 minting an NFT so that contract has some ETH balance
        vm.deal(user1, 1 ether);  // Give user1 some ether to cover gas and minting
        vm.prank(user1);  // User1 mints the NFT
        nftMint.mintNFT{value: mintPrice}("ipfs://exampleMetadata1");

        // Check that contract balance has increased
        assertEq(address(nftMint).balance, mintPrice);

        // Try withdrawing as user1 (should fail)
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, user1));  // Expect the custom error
        nftMint.withdraw();

        // Withdraw as owner (should succeed)
        uint256 ownerInitialBalance = owner.balance;
        vm.prank(owner);  // Owner withdraws
        nftMint.withdraw();

        // Check that the owner's balance increased
        assertEq(owner.balance, ownerInitialBalance + mintPrice);
    }
}
