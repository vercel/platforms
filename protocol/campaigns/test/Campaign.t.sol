// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Campaign} from "../src/Campaign.sol";

contract CampaignTest is Test {
    Campaign public campaign;
    address payable public sponsor;
    address payable[2] contributors;

    function setUp() public {
        sponsor = payable(vm.addr(1));
        threshold = 1;
        name = "Glorious Transhumanist Utopia";

        campaign = new Campaign(
            sponsor,
            threshold,
            name
        );

        for (uint i=2; i<contributors.length; i++) {
            const contributor = payable(vm.addr(i));
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
}