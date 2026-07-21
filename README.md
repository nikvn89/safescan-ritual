# SafeScan (Powered by Ritual Coprocessor)

SafeScan is an advanced, automated smart contract auditing platform designed to democratize Web3 security. It protects retail investors and developers from malicious code, honeypots, and rug pulls by translating complex Solidity code into human-readable security warnings.

Built for the **Ritual Hackathon**, this project leverages the concept of Decentralized AI (Infernet/Coprocessor) to provide real-time, on-chain vulnerability scanning.

## 🚀 Features

* **Real-time On-Chain Fetching:** Paste any Etherscan or Dexscreener link. SafeScan will automatically extract the contract address and fetch the verified source code directly from block explorers.
* **Static Analysis Engine:** Rapidly scans verified source code for known vulnerabilities.
* **Honeypot & Tax Detection:** Identifies hidden transfer restrictions and malicious tax logic.
* **Terminal Interface:** A sleek, hacker-style UI designed for maximum impact during hackathon presentations.
* **Ritual Coprocessor Integration:** Utilizes an off-chain Python node to perform heavy ML/heuristic analysis, returning the audit score back to the on-chain smart contract.

## 🏗 System Architecture

This repository contains the full stack required for the SafeScan ecosystem:

1. **Frontend (`index.html`, `app.js`):** A static web application that serves as the user-facing terminal.
2. **On-Chain Contract (`contracts/RitualAuditor.sol`):** The Smart Contract that requests audits and stores the resulting security scores on-chain. Built for Hardhat.
3. **Off-Chain Node (`node/audit_service.py`):** The Python Coprocessor service that listens for on-chain audit requests, performs the analysis, and submits the results back to the blockchain.

## 🛠 Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript, TailwindCSS
* **Smart Contracts:** Solidity, Hardhat, Ethers.js
* **Backend Node:** Python 3, Web3.py
* **Blockchain APIs:** Etherscan, BscScan, Arbiscan, BaseScan

## 📦 How to Run Locally

### 1. Frontend UI
* Open `index.html` in any modern web browser.
* No build steps or `npm install` required! It runs completely client-side.

### 2. Smart Contract (Hardhat)
* Run `npm install` to install Hardhat and dependencies.
* Run `npx hardhat compile` to build the `RitualAuditor.sol` contract.

### 3. Coprocessor Node
* Navigate to the `node/` directory.
* Run `pip install web3` (requires Python 3.8+).
* Run `python audit_service.py` to start listening for events.

## 🤝 Contributing
This is a hackathon project built for the **Ritual Hackathon**. Feel free to fork and expand upon the scanning logic (e.g., integrating an actual LLM backend via Ritual Infernet SDK).
