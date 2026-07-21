# SafeScan: AI Smart Contract Auditor (Ritual Hackathon)

SafeScan is a decentralized, AI-powered smart contract auditing tool built on the **Ritual Infernet Coprocessor**. It allows retail users to instantly scan any EVM smart contract for critical vulnerabilities like Reentrancy, Honeypots (99% sell tax), and Unlimited Minting privileges before interacting with them.

## 🌟 Why SafeScan?
Retail investors lose millions to malicious smart contracts every day. Running deep static analysis and heuristic checks on-chain is computationally expensive and infeasible. 
SafeScan solves this by offloading the heavy analysis to **Ritual's off-chain Infernet Coprocessor**, which fetches the verified source code, runs heuristic checks, and pushes a Trust Score back on-chain.

## 🏗️ Architecture
- **Frontend**: A sleek, terminal-like web interface for users to enter contract addresses.
- **Smart Contract (`SafeScanCoproc.sol`)**: A `CallbackConsumer` that requests an AI audit from the Ritual Coprocessor.
- **Infernet AI Node (Python)**: An off-chain node that receives the request, fetches the code from block explorers, runs the security analysis, and returns the verdict.

## 🚀 Getting Started (For Judges & Developers)

To build and run this project locally, you will need to set up the Infernet Node and deploy the smart contracts. **You must use the Ritual Testnet and acquire faucet tokens.**

### Prerequisites
1. Docker & Docker Compose
2. [Foundry](https://getfoundry.sh/) (Forge)
3. A newly created EVM wallet (Do NOT use your main wallet, as you will need the private key).

### 1. Setup Wallet & Faucet
1. Join the [Ritual Discord](https://discord.gg/ritual).
2. Create a fresh wallet and copy its address.
3. Use the Faucet in Discord to request testnet `$RITUAL` tokens for your new wallet.

### 2. Configure the Node
1. Clone this repository:
   ```bash
   git clone https://github.com/nikvn89/safescan-ritual.git
   cd safescan-ritual
   ```
2. Copy the `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and enter your newly created wallet's `PRIVATE_KEY`.

### 3. Run the Infernet Node
Start the off-chain Ritual Coprocessor node and the SafeScan AI Python container using the provided Makefile:
```bash
make node-up
```
*(To stop the node later, run `make node-down`)*

### 4. Deploy the Smart Contract
Deploy the `SafeScanCoproc` contract to the Ritual Testnet:
```bash
make deploy
```
This will compile the contracts and broadcast the transaction using your funded testnet wallet.

## 🎨 Try the Frontend Demo
You can try the frontend UI (which runs in mock mode for faster UX demonstration) here:
👉 **[Live Demo](https://safescan-ritual.vercel.app/)**

## 📜 License
MIT License
