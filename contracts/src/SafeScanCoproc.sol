// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {CallbackConsumer} from "./CallbackConsumer.sol";

contract SafeScanCoproc is CallbackConsumer {
    // Map an audit request ID to the contract address being audited
    mapping(uint32 => address) public auditRequests;
    
    // Map a contract address to its Trust Score (0-100)
    mapping(address => uint8) public trustScores;
    
    // Map a contract address to its verdict string (e.g., "SAFE", "HONEYPOT")
    mapping(address => string) public verdicts;

    event AuditRequested(uint32 requestId, address targetContract);
    event AuditCompleted(address targetContract, uint8 score, string verdict);

    constructor(address coordinator) CallbackConsumer(coordinator) {}

    /**
     * @dev User requests an AI audit for a specific smart contract
     */
    function requestAudit(address targetContract) external payable {
        // Assume sending some native testnet token as fee to the coordinator
        uint32 requestId = _requestCompute(
            1, // containerId mapped to the SafeScan Python script
            abi.encode(targetContract),
            msg.value
        );
        
        auditRequests[requestId] = targetContract;
        emit AuditRequested(requestId, targetContract);
    }

    /**
     * @dev Callback received from the Infernet Node with the AI Trust Score
     */
    function _receiveCompute(
        uint32 subscriptionId,
        uint32 interval,
        uint16 redundancy,
        address node,
        bytes calldata input,
        bytes calldata output,
        bytes calldata proof,
        bytes32 nodeKey
    ) internal override {
        address targetContract = auditRequests[subscriptionId];
        require(targetContract != address(0), "Request not found");

        // Output from the Python script is encoded as (uint8, string)
        (uint8 score, string memory verdict) = abi.decode(output, (uint8, string));
        
        trustScores[targetContract] = score;
        verdicts[targetContract] = verdict;
        
        emit AuditCompleted(targetContract, score, verdict);
    }
}
