# SafeScan (Powered by Ritual Coprocessor)

SafeScan is an advanced, automated smart contract auditing platform designed to democratize Web3 security. It protects retail investors and developers from malicious code, honeypots, and rug pulls by translating complex Solidity code into human-readable security warnings.

Built for the **Ritual Hackathon**, this project leverages the concept of Decentralized AI (Infernet/Coprocessor) to provide real-time, on-chain vulnerability scanning.

## 🚀 Features

* **Real-time On-Chain Fetching:** Paste any Etherscan or Dexscreener link. SafeScan will automatically extract the contract address and fetch the verified source code directly from block explorers.
* **Static Analysis Engine:** Rapidly scans verified source code for known vulnerabilities.
* **Honeypot & Tax Detection:** Identifies hidden transfer restrictions and malicious tax logic.
* **Privilege Escalation:** Flags unlimited minting functions and excessive owner controls.
* **Reentrancy Checks:** Protects against the most common vector for draining liquidity pools.
* **Terminal Interface:** A sleek, hacker-style UI designed for maximum impact during hackathon presentations.

## 🛠 Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript, TailwindCSS
* **Blockchain APIs:** Etherscan, BscScan, Arbiscan, BaseScan
* **Architecture:** Static Web App (Deployable anywhere: Vercel, Netlify, GitHub Pages)

## 📦 How to Run Locally

1. Clone this repository.
2. Open `index.html` in any modern web browser.
3. No build steps or `npm install` required! It runs completely client-side.

## 🔍 Testing Guide (Mock Data vs Real API)

### Mock Mode (No API Key needed)
If you don't enter an API Key in the Settings, the app uses a built-in mock engine for demonstration purposes:
* **Safe Token:** Paste `0x6982508145454ce325ddbe47a25d4ec3d2311933` (PEPE) to see a clean scan (with a real-world blacklist warning!).
* **Scam Token:** Paste `0xbb9bc244d798123fde783fcc1c72d3bb8c189413` (The DAO) to see critical Reentrancy and Honeypot warnings.

### Real API Mode (Live Blockchain Data)
1. Navigate to the **Settings** tab.
2. Enter your Etherscan / BscScan API Key.
3. Paste any verified contract address or Dexscreener link.
4. The scanner will pull live code from the blockchain and audit it on the fly.

## 🤝 Contributing
This is a hackathon project. Feel free to fork and expand upon the scanning logic (e.g., integrating an actual LLM backend via Ritual Infernet SDK).
