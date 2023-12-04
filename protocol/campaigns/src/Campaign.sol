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
    bool postThreshold;
    State public state;

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
        postThreshold = false;
    }

    function contribute(uint256 amount) public payable {
        require(openToContributions);!
        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;
    }

    function authorizeContributor(address address_) public {
        require(msg.sender == sponsor);
        authorizedContributors.add(address_);
    }

    function refund() public {
        // TODO check here whether the threshold has been crossed yet, update postThreshold if so
        require(!postThreshold);
        // TODO issue refunds if so
    }

    // TODO implement a way sponsor can refund all contributors even after threshold
    // maybe just a manual override setting
}
