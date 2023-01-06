// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error NotOwner();

contract FundMe {

    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    address public /* immutable */ i_owner;
    uint256 public constant MINIMUM_ETH = 1 ether;

    modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert NotOwner();
        _;
    }
    
    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        // Check for minimum donation
        require(msg.value >= MINIMUM_ETH, "You need to spend more ETH!");
        // Record donation
        addressToAmountFunded[msg.sender] += msg.value;
        // Record funder
        funders.push(msg.sender);
    }
    
    function withdraw() public onlyOwner {
        // Reset funders array
        address[] memory fundersMemory = funders;
        for (uint256 funderIndex=0; funderIndex < fundersMemory.length; funderIndex++){
            address funder = fundersMemory[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        // Withdraw balance
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }

}
