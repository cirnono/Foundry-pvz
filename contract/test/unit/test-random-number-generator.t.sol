// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DeployRandomNumberGenerator} from "../../script/DeployRandomNumberGenerator.s.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {RandomNumberGenerator} from "../../src/RandomNumberGenerator.sol";
import {VRFCoordinatorV2_5Mock} from "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2_5Mock.sol";
import {LinkToken} from "../../test/mocks/LinkToken.sol";

contract testRandomNumberGenerator is Test {
    event randomNumberGenerated(uint indexed, uint256[]);

    RandomNumberGenerator public randomNumberGenerator;
    HelperConfig public helperConfig;

    address vrfCoordinatorV2_5;
    bytes32 gasLane;
    uint32 callbackGasLimit;
    uint256 subscriptionId;
    LinkToken link;

    /* network ids */
    uint256 public constant ETH_SEPOLIA_CHAIN_ID = 11155111;
    uint256 public constant ETH_MAINNET_CHAIN_ID = 1;
    uint256 public constant LOCAL_CHAIN_ID = 31337;

    address public PLAYER = makeAddr("player");
    uint256 public constant STARTING_PLAYER_BALANCE = 100 ether;
    uint256 public constant LINK_BALANCE = 100 ether;

    function setUp() public {
        DeployRandomNumberGenerator deployer = new DeployRandomNumberGenerator();
        (randomNumberGenerator, helperConfig) = deployer
            .deployRandomNumberGenerator();
        vm.deal(PLAYER, STARTING_PLAYER_BALANCE);

        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();
        vrfCoordinatorV2_5 = config.vrfCoordinatorV2_5;
        gasLane = config.gasLane;
        callbackGasLimit = config.callbackGasLimit;
        subscriptionId = config.subscriptionId;
        link = LinkToken(config.link);

        vm.startPrank(msg.sender);
        if (block.chainid == LOCAL_CHAIN_ID) {
            link.mint(msg.sender, LINK_BALANCE);
            VRFCoordinatorV2_5Mock(vrfCoordinatorV2_5).fundSubscription(
                subscriptionId,
                LINK_BALANCE
            );
        }
        link.approve(vrfCoordinatorV2_5, LINK_BALANCE);
    }

    function testRequestRandomNumber() public {
        uint32 numOfRandomNumber = 3;
        uint256[] memory randomNumbers;
        vm.expectEmit(true, false, false, true, address(randomNumberGenerator));
        emit randomNumberGenerated(1, randomNumbers);
        uint256 requestId = randomNumberGenerator.makeRandomNumberRequest(
            numOfRandomNumber
        );

        assert(requestId == 1);
        assert(randomNumbers.length == numOfRandomNumber);
    }
}
