// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/SafeScanCoproc.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address coordinatorAddress = vm.envAddress("COORDINATOR_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        SafeScanCoproc coproc = new SafeScanCoproc(coordinatorAddress);
        console.log("SafeScanCoproc deployed at:", address(coproc));

        vm.stopBroadcast();
    }
}
