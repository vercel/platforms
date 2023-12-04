// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Campaign {
    uint256 public threshold;
    address public sponsor;
    string public name;

    mapping(address => uint256) private contributions;
    uint256 private totalContributions;
    bool openToContributions;

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private authorizedContributors;

    constructor(
        address payable _sponsor,
        uint256 _threshold,
        string memory _name
    ) {
        sponsor = _sponsor;
        threshold = _threshold;
        name = _name;
        totalContributions = 0;
        openToContributions = true;
    }

    function contribute() public payable {
        require(
            openToContributions,
            "The campaign isn't accepting contributions right now"
        );
        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;
    }

    function authorizeContributor(address address_) public {
        require(
            msg.sender == sponsor,
            "Only the campaign sponsor can authorize contributors"
        );
        authorizedContributors.add(address_);
    }

    function refund(uint256 amount) public {
        require(
            totalContributions < threshold,
            "The campaign has reached its threshold, so refunds are no longer possible"
        );
        uint256 contribution = contributions[msg.sender];
        require(
            amount <= contribution,
            "Refund amount is more than contribution"
        );
        contributions[msg.sender] = contribution - amount;
        payable(msg.sender).transfer(amount);
    }

    // TODO implement a way sponsor can refund all contributors even after threshold
    // maybe just a manual override setting
}
