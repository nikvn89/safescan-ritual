// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

abstract contract CallbackConsumer {
    address public coordinator;

    constructor(address _coordinator) {
        coordinator = _coordinator;
    }

    function _requestCompute(
        uint32 containerId,
        bytes memory input,
        uint256 fee
    ) internal returns (uint32) {
        // Mock request compute logic
        return 1;
    }

    function _receiveCompute(
        uint32 subscriptionId,
        uint32 interval,
        uint16 redundancy,
        address node,
        bytes calldata input,
        bytes calldata output,
        bytes calldata proof,
        bytes32 nodeKey
    ) internal virtual;
}
