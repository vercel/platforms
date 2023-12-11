// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Campaign} from "../src/Campaign.sol";

contract CampaignTest is Test {
    Campaign public campaign;
    address payable public sponsor;
    address payable[2] contributors;
    uint256 public threshold;
    string public name;

    function setUp() public {
        sponsor = payable(vm.addr(1));
        threshold = 1 ether;
        name = "Glorious Transhumanist Utopia";

        campaign = new Campaign(
            sponsor,
            threshold,
            name
        );

        for (uint i=0; i<contributors.length; i++) {
            address payable contributor = payable(vm.addr(i + 2));
            contributors[i] = contributor;
            vm.deal(contributor, 0.5 ether);
            vm.startPrank(sponsor);
            campaign.authorizeContributor(contributor);
            vm.stopPrank();
        }
    }

    function testContribute() public {
        vm.startPrank(contributors[0]);
        campaign.contribute{ value: 0.5 ether }();
        vm.stopPrank();

        vm.startPrank(contributors[1]);
        campaign.contribute{ value: 0.5 ether }();
        vm.stopPrank();

        assertEq(address(campaign).balance, 1 ether);
        assertEq(contributors[0].balance, 0 ether);
        assertEq(contributors[1].balance, 0 ether);
    }

    function testRefund() public {
        vm.startPrank(contributors[0]);
        campaign.contribute{ value: 0.4 ether }();
        vm.stopPrank();

        vm.startPrank(contributors[1]);
        campaign.contribute{ value: 0.4 ether }();
        vm.stopPrank();

        // Contributor 0 withdraws half their contribution
        vm.startPrank(contributors[0]);
        campaign.refund(0.2 ether);
        vm.stopPrank();

        // Contributor 1 withdraws their full contribution
        vm.startPrank(contributors[1]);
        campaign.refund(0.4 ether);
        vm.stopPrank();
    }

    function testDontRefund() public {
        vm.startPrank(contributors[0]);
        campaign.contribute{ value: 0.5 ether }();
        vm.stopPrank();

        vm.startPrank(contributors[1]);
        campaign.contribute{ value: 0.3 ether }();
        vm.expectRevert("Refund amount is more than contribution");
        campaign.refund(0.4 ether);

        // Reach the threshold
        campaign.contribute{ value: 0.2 ether }();
        vm.stopPrank();

        vm.startPrank(contributors[0]);
        vm.expectRevert("The campaign has reached its threshold, so refunds are no longer possible");
        campaign.refund(0.5 ether);
    }

    function testWithdraw() public {
        vm.startPrank(contributors[0]);
        campaign.contribute{ value: 0.5 ether }();

        vm.startPrank(sponsor);
        vm.expectRevert("As the organizer, you can only withdraw once the contribution threshold is met");
        campaign.withdraw(0.1 ether);

        vm.startPrank(contributors[1]);
        campaign.contribute{ value: 0.5 ether }();

        vm.startPrank(sponsor);
        campaign.withdraw(0.8 ether);
        campaign.withdraw(0.2 ether);

        vm.expectRevert("More funds requested than available");
        campaign.withdraw(0.1 ether);
        vm.stopPrank();
    }
}