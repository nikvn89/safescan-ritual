// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CallbackConsumer} from "infernet-sdk/consumer/Callback.sol";

/**
 * @title RitualAuditor
 * @dev On-chain router that requests AI security audits from Ritual Infernet Nodes
 */
contract RitualAuditor is CallbackConsumer {
    // Structure to hold the AI's trust score and analysis
    struct AuditResult {
        uint256 score;
        bool isVerified;
        string flags;
        uint256 timestamp;
    }

    // Mapping from Target Contract Address to its Audit Result
    mapping(address => AuditResult) public auditResults;

    // Events
    event AuditRequested(address indexed target, uint32 subscriptionId);
    event AuditCompleted(address indexed target, uint256 score, string flags);

    /**
     * @param _coordinator Address of the Ritual Infernet Coordinator contract
     */
    constructor(address _coordinator) CallbackConsumer(_coordinator) {}

    /**
     * @notice Requests a security audit for a specific smart contract address
     * @param target The address of the contract to audit
     */
    function requestAudit(address target) external {
        // Prepare the payload (the address we want the AI node to analyze)
        bytes memory payload = abi.encode(target);

        // Request off-chain compute from a Ritual Infernet Node
        // Container ID "ritual-sec-v2.1" specifies the Docker container running the LLM
        uint32 subId = _requestCompute(
            "ritual-sec-v2.1",
            payload,
            1, // redundant confirmations
            msg.sender,
            1, // gas limit
            0  // payment
        );

        emit AuditRequested(target, subId);
    }

    /**
     * @notice Callback function called by the Ritual Coordinator when the AI Node finishes computation
     * @param _subscriptionId The ID of the compute request
     * @param _interval The interval at which it was run
     * @param _inputs The original inputs provided to the node
     * @param _output The AI's analysis result (Trust Score and Flags)
     */
    function _receiveCompute(
        uint32 _subscriptionId,
        uint32 _interval,
        uint16 _inputs,
        uint32 _gasLimit,
        address _caller,
        bytes memory _input,
        bytes memory _output,
        bytes memory _proof
    ) internal override {
        // Decode the target address from the original input
        address target = abi.decode(_input, (address));
        
        // Decode the AI result from the output
        (uint256 score, string memory flags) = abi.decode(_output, (uint256, string));

        // Save the result permanently on-chain
        auditResults[target] = AuditResult({
            score: score,
            isVerified: true,
            flags: flags,
            timestamp: block.timestamp
        });

        emit AuditCompleted(target, score, flags);
    }

    /**
     * @notice Fetches the latest audit score for a contract
     */
    function getTrustScore(address target) external view returns (uint256) {
        require(auditResults[target].isVerified, "Contract not audited yet");
        return auditResults[target].score;
    }
}
