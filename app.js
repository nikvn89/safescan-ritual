const APIs = {
    eth: 'https://api.etherscan.io/api',
    bsc: 'https://api.bscscan.com/api',
    base: 'https://api.basescan.org/api',
    arb: 'https://api.arbiscan.io/api'
};

const MOCK_DATA = {
    "0x892a0bd23f77372d6ffb40026e6de3bb4ff63b22": `// [Scam Token Detected on Chain]
contract ScamToken {
    string public name = "SafePepe";
    address public owner;
    mapping(address => uint) balances;
    mapping(address => bool) public isBlacklisted;
    bool public tradingOpen = false;
    uint256 public sellTax = 99;

    constructor() { owner = msg.sender; }

    function _mint(uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint");
        balances[owner] += amount;
    }

    function transfer(address to, uint256 amount) public {
        require(msg.sender == owner, "Honeypot: Only owner can sell");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`,
    "0x6982508145454ce325ddbe47a25d4ec3d2311933": `// [PEPE Token Smart Contract]
contract PepeToken {
    string public name = "Pepe";
    string public symbol = "PEPE";
    uint8 public decimals = 18;
    uint256 public totalSupply = 420690000000000 * 10**18;
    mapping(address => uint) balances;
    
    // NOTE: PEPE actually had a blacklist function at launch to block MEV bots!
    mapping(address => bool) public isBlacklisted;
    address public owner;

    constructor() {
        owner = msg.sender;
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(!isBlacklisted[msg.sender], "Blacklisted wallet");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
}`,
    "0x1111111111111111111111111111111111111111": `// [Standard ERC20 Token - 100% Safe]
contract CleanToken {
    string public name = "SafeCoin";
    string public symbol = "SAFE";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    mapping(address => uint) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
}`,
    "0xb8c77482e45f1f44de1745f52c74426c631bdd52": `// [Binance Coin (BNB) Smart Contract - Standard ERC20]
contract BNB {
    string public name = "Binance Coin";
    string public symbol = "BNB";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    
    mapping (address => uint256) public balanceOf;

    constructor() {
        owner = msg.sender;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(balanceOf[msg.sender] >= _value);
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        return true;
    }
}`,
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": `// [Wrapped Bitcoin (WBTC) Smart Contract]
contract WBTC {
    string public name = "Wrapped BTC";
    string public symbol = "WBTC";
    uint8 public decimals = 8;
    uint256 public totalSupply;
    mapping (address => uint256) public balances;
    
    address public merchant;
    address public custodian;

    function mint(address _to, uint256 _amount) public returns (bool) {
        require(msg.sender == custodian, "Only custodian can mint WBTC based on real BTC reserves");
        totalSupply += _amount;
        balances[_to] += _amount;
        return true;
    }

    function burn(uint256 _value) public {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        totalSupply -= _value;
    }
}`,
    "0x87230146e138d3f296a9a77e497a2a83012e9bc5": `// [Squid Game Token (SQUID) - The Most Famous Rugpull]
contract SquidToken {
    string public name = "Squid Game Token";
    string public symbol = "SQUID";
    address public owner;
    mapping(address => uint256) balances;
    mapping(address => bool) public isBlacklisted;

    constructor() { owner = msg.sender; }

    // THE INFAMOUS HONEYPOT TRAP
    function transfer(address to, uint256 amount) public {
        // ONLY the dev (owner) could bypass this condition and sell
        require(msg.sender == owner || !isBlacklisted[msg.sender], "Honeypot: Trading restricted");
        require(msg.sender == owner, "Anti-dump: Sellers must be approved");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`,
    "0xbb9bc244d798123fde783fcc1c72d3bb8c189413": `// [The DAO - The 2016 Hack that split Ethereum]
contract TheDAO {
    mapping(address => uint) public balances;
    
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient funds");
        
        // CRITICAL VULNERABILITY: Reentrancy
        // Sending ETH *before* updating the balance
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // The attacker recalls withdraw() during the transfer fallback, 
        // bypassing this deduction forever!
        balances[msg.sender] -= amount;
    }
}`,
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": `// [USDC Coin - Fully Audited and Safe]
contract FiatTokenV2 {
    string public name = "USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply;
    mapping(address => uint256) balances;

    // Upgradable proxy architecture proxy implementation
    address public minter;
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "ERC20: transfer amount exceeds balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
}`,
    "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000": `// [Fake Token - Minting Scam]
contract FakeLuna {
    string public name = "Luna Classic 2.0";
    string public symbol = "LUNC2";
    address public owner;
    mapping(address => uint256) balances;

    constructor() { owner = msg.sender; }

    // CRITICAL VULNERABILITY: Unlimited Minting
    // Owner can print infinite tokens at will and dump them.
    function mint(uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint");
        balances[owner] += amount;
    }

    function transfer(address to, uint256 amount) public {
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`
};

// UI Elements
const terminal = document.getElementById('tab-terminal');
const codeContent = document.getElementById('code-content');
const codeLoading = document.getElementById('code-loading');
const auditBtn = document.getElementById('audit-btn');
const addressInput = document.getElementById('contract-address');
const apiKeyInput = document.getElementById('api-key');
const networkSelect = document.getElementById('network-select');
const codeFilename = document.getElementById('code-filename');
const metricScanned = document.getElementById('metric-scanned');
const metricThreats = document.getElementById('metric-threats');
const tabs = document.querySelectorAll('.tab-btn');
const panes = document.querySelectorAll('.tab-pane');
const navBtns = document.querySelectorAll('.nav-btn');
const pageViews = document.querySelectorAll('.page-view');

// Sidebar Navigation Logic
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Reset all nav buttons
        navBtns.forEach(b => {
            b.classList.remove('bg-ritual-green/10', 'text-ritual-green', 'border-ritual-green/20');
            b.classList.add('text-gray-500', 'border-transparent');
            b.classList.remove('border');
        });
        
        // Highlight clicked nav button
        btn.classList.add('bg-ritual-green/10', 'text-ritual-green', 'border-ritual-green/20', 'border');
        btn.classList.remove('text-gray-500', 'border-transparent');
        
        // Hide all pages
        pageViews.forEach(page => {
            page.classList.remove('z-10');
            page.classList.add('z-0', 'opacity-0', 'pointer-events-none');
        });
        
        // Show target page
        const targetId = btn.getAttribute('data-page');
        const targetPage = document.getElementById(targetId);
        targetPage.classList.remove('z-0', 'opacity-0', 'pointer-events-none');
        targetPage.classList.add('z-10');
    });
});

// Tab Navigation Logic
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => {
            t.classList.remove('tab-active', 'text-ritual-green');
            t.classList.add('text-gray-500');
        });
        // Add active class to clicked tab
        tab.classList.add('tab-active', 'text-ritual-green');
        tab.classList.remove('text-gray-500');
        
        // Hide all panes
        panes.forEach(p => p.classList.add('hidden'));
        // Show target pane
        const targetId = tab.getAttribute('data-target');
        document.getElementById(targetId).classList.remove('hidden');
    });
});

// Metric Animation Logic (Fake live data)
setInterval(() => {
    let currentScanned = parseInt(metricScanned.innerText.replace(',', ''));
    currentScanned += Math.floor(Math.random() * 3);
    metricScanned.innerText = currentScanned.toLocaleString();
    
    if (Math.random() > 0.8) {
        let currentThreats = parseFloat(metricThreats.innerText);
        currentThreats += 0.1;
        metricThreats.innerText = currentThreats.toFixed(1);
    }
}, 3000);

// Utility to append logs with typing effect
async function typeWriter(text, className = 'text-gray-300', delay = 10) {
    return new Promise(resolve => {
        const div = document.createElement('div');
        div.className = "mb-2 " + className;
        terminal.appendChild(div);
        
        let i = 0;
        function type() {
            if (i < text.length) {
                div.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
                i++;
                terminal.scrollTop = terminal.scrollHeight;
                setTimeout(type, delay);
            } else {
                resolve();
            }
        }
        type();
    });
}

function appendHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.className = 'mb-2';
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}

// Simulated AI Scanner
async function auditCode(sourceCode, currentAddress, currentNetwork) {
    await typeWriter("> Initializing Ritual Coprocessor...", 'text-blue-400 font-bold');
    await new Promise(r => setTimeout(r, 600));
    await typeWriter("> Scanning " + sourceCode.split('\n').length + " lines of Solidity code...", 'text-blue-400');
    await new Promise(r => setTimeout(r, 800));
    
    appendHTML("<hr class='border-ritual-border my-4'>");
    
    let isSafe = true;
    let score = 100;

    // Helper function to highlight specific lines in the code viewer
    function highlightMaliciousLine(regex, severity) {
        let lines = sourceCode.split('\n');
        let lineIdx = lines.findIndex(l => l.match(regex));
        if (lineIdx !== -1) {
            let lineEl = document.getElementById('line-' + lineIdx);
            if (lineEl) {
                if (severity === 'critical') {
                    lineEl.classList.add('bg-red-900/80', 'border-red-500', 'shadow-[0_0_10px_rgba(255,0,0,0.5)]', 'text-white', 'font-bold');
                } else {
                    lineEl.classList.add('bg-yellow-900/80', 'border-yellow-500', 'shadow-[0_0_10px_rgba(255,255,0,0.3)]', 'text-white', 'font-bold');
                }
                
                // Scroll the code viewer
                const scrollTarget = lineEl.offsetTop - 100; 
                codeContent.parentElement.scrollTop = scrollTarget > 0 ? scrollTarget : 0;
            }
        }
    }

    // Check 1: Minting
    await typeWriter("[1/4] Checking for Unauthorized Minting...", 'text-gray-400');
    await new Promise(r => setTimeout(r, 500));
    if (sourceCode.match(/function\s+mint|function\s+_mint/i) && sourceCode.match(/onlyOwner|require\s*\(\s*msg\.sender\s*==\s*owner/i)) {
        score -= 20;
        appendHTML("<div class='text-ritual-red pl-4 border-l-2 border-ritual-red mb-4'><span class='font-bold'>⚠️ CRITICAL: Unlimited Minting Detected</span><br><span class='text-gray-400 text-xs'>The contract contains a 'mint' function accessible by the owner. The creator can arbitrarily print infinite tokens and dump them on the market.</span></div>");
        highlightMaliciousLine(/function\s+mint|function\s+_mint/i, 'critical');
        await new Promise(r => setTimeout(r, 800));
    } else {
        await new Promise(r => setTimeout(r, 800));
        appendHTML("<div class='text-ritual-green pl-4 mb-4'>✓ No hidden mint functions found.</div>");
    }

    // Check 2: Honeypot (Cant sell)
    await typeWriter("[2/4] Checking for Honeypot & Sell Taxes...", 'text-gray-400');
    await new Promise(r => setTimeout(r, 500));
    if (sourceCode.match(/sellFee\s*=\s*[9-9][0-9]/i) || sourceCode.match(/sellTax\s*=\s*[9-9][0-9]/i) || sourceCode.match(/require\s*\(\s*msg\.sender\s*==\s*owner\s*\)/i) && sourceCode.match(/transfer/i)) {
        score -= 50;
        appendHTML("<div class='text-ritual-red pl-4 border-l-2 border-ritual-red mb-4'><span class='font-bold'>⚠️ CRITICAL: Honeypot / High Tax</span><br><span class='text-gray-400 text-xs'>The code restricts 'transfer' to the owner or sets a malicious tax. You will NOT be able to sell this token after buying, or your wallet could be drained!</span></div>");
        highlightMaliciousLine(/sellTax\s*=\s*[9-9][0-9]|require\s*\(\s*msg\.sender\s*==\s*owner\s*\)/i, 'critical');
        await new Promise(r => setTimeout(r, 800));
    } else {
        await new Promise(r => setTimeout(r, 800));
        appendHTML("<div class='text-ritual-green pl-4 mb-4'>✓ Transfer logic appears open. No honeypot restrictions.</div>");
    }
    
    // Check 3: Blacklist
    await typeWriter("[3/4] Checking for Blacklist mechanisms...", 'text-gray-400');
    await new Promise(r => setTimeout(r, 500));
    if (sourceCode.match(/mapping\s*\(\s*address\s*=>\s*bool\s*\)\s+(public\s+|private\s+)?(_isBlacklisted|isBlacklisted|blacklist)/i)) {
        score -= 15;
        appendHTML("<div class='text-yellow-500 pl-4 border-l-2 border-yellow-500 mb-4'><span class='font-bold'>⚠️ WARNING: Blacklist Mapping Detected</span><br><span class='text-gray-400 text-xs'>The owner can arbitrarily block specific wallets from trading. Common tactic used to trap MEV bots or retail buyers.</span></div>");
        highlightMaliciousLine(/mapping\s*\(\s*address\s*=>\s*bool\s*\).*isBlacklisted/i, 'warning');
        await new Promise(r => setTimeout(r, 800));
    } else {
        await new Promise(r => setTimeout(r, 800));
        appendHTML("<div class='text-ritual-green pl-4 mb-4'>✓ No blacklist mappings found.</div>");
    }

    // Check 4: Pausable
    await typeWriter("[4/4] Checking for Trading Halts (Pausability)...", 'text-gray-400');
    await new Promise(r => setTimeout(r, 500));
    if (sourceCode.match(/bool\s+(public\s+)?(tradingOpen|paused)\s*=\s*false/i) || sourceCode.match(/whenNotPaused/i)) {
        score -= 15;
        appendHTML("<div class='text-yellow-500 pl-4 border-l-2 border-yellow-500 mb-4'><span class='font-bold'>⚠️ WARNING: Trading can be paused</span><br><span class='text-gray-400 text-xs'>The owner has the ability to pause all trading at any time.</span></div>");
        highlightMaliciousLine(/tradingOpen\s*=\s*false|paused\s*=\s*false/i, 'warning');
        await new Promise(r => setTimeout(r, 800));
    } else {
        await new Promise(r => setTimeout(r, 800));
        appendHTML("<div class='text-ritual-green pl-4 mb-4'>✓ Trading cannot be paused.</div>");
    }

    // Check 5: Reentrancy (The DAO hack)
    await typeWriter("[5/5] Checking for Reentrancy Attacks...", 'text-gray-400');
    await new Promise(r => setTimeout(r, 500));
    if (sourceCode.match(/\.call\s*\{.*value.*\}|\.call\.value\s*\(/i) && sourceCode.match(/balances\[.*\]\s*-=\s*|balances\[.*\]\s*=\s*balances\[.*\]\s*-/i)) {
        score -= 40;
        appendHTML("<div class='text-ritual-red pl-4 border-l-2 border-ritual-red mb-4'><span class='font-bold'>⚠️ CRITICAL: Reentrancy Vulnerability</span><br><span class='text-gray-400 text-xs'>Contract sends ETH before updating state balances. An attacker can repeatedly recall the withdraw function to drain the entire vault.</span></div>");
        highlightMaliciousLine(/\.call\s*\{.*value.*\}|\.call\.value\s*\(/i, 'critical');
        await new Promise(r => setTimeout(r, 800));
    } else {
        await new Promise(r => setTimeout(r, 800));
        appendHTML("<div class='text-ritual-green pl-4 mb-4'>✓ No Reentrancy patterns detected.</div>");
    }

    appendHTML("<hr class='border-ritual-border my-4'>");
    
    if (score === 100) {
        await typeWriter("[RESULT] TRUST SCORE: 100/100", 'text-ritual-green font-bold text-lg glow-green');
        await typeWriter("Conclusion: Contract is CLEAN. No malicious logic found by Ritual LLM.", 'text-ritual-green');
    } else if (score >= 50) {
        await typeWriter("[RESULT] TRUST SCORE: " + score + "/100", 'text-yellow-500 font-bold text-lg');
        await typeWriter("Conclusion: Caution advised. Some centralization risks detected.", 'text-yellow-500');
    } else {
        await typeWriter("[RESULT] TRUST SCORE: " + score + "/100", 'text-ritual-red font-bold text-lg glow-red');
        await typeWriter("Conclusion: HIGHLY MALICIOUS. Do not interact with this smart contract!", 'text-ritual-red font-bold');
    }
    
    // Add to Live Audits History
    const historyTable = document.querySelector('#page-audits tbody');
    if (historyTable && currentAddress) {
        let verdictStr = "";
        let colorClass = "";
        if (score === 100) {
            verdictStr = '<div class="flex items-center gap-2 text-ritual-green"><div class="w-1.5 h-1.5 bg-ritual-green rounded-full"></div>SAFE</div>';
            colorClass = 'text-ritual-green glow-green';
        } else if (score >= 70) {
            verdictStr = '<div class="flex items-center gap-2 text-yellow-500"><div class="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>WARNING</div>';
            colorClass = 'text-yellow-500';
        } else {
            verdictStr = '<div class="flex items-center gap-2 text-ritual-red"><div class="w-1.5 h-1.5 bg-ritual-red rounded-full animate-pulse"></div>CRITICAL RISK</div>';
            colorClass = 'text-ritual-red';
        }
        
        let netColor = currentNetwork === 'eth' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : 
                       (currentNetwork === 'bsc' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : 
                       (currentNetwork === 'base' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'));
        
        let shortAddr = currentAddress.substring(0,8) + '...' + currentAddress.substring(38);
        
        let tr = document.createElement('tr');
        tr.className = 'border-b border-ritual-border/50 hover:bg-[#111315] transition-colors group bg-[#0a0c0e]/50';
        tr.innerHTML = `
            <td class="py-4 px-6 text-gray-500 font-bold">Just now</td>
            <td class="py-4 px-6"><span class="${netColor} border px-2 py-0.5 rounded text-[9px] uppercase">${currentNetwork || 'ETH'}</span></td>
            <td class="py-4 px-6 font-bold group-hover:text-white cursor-pointer" onclick="document.getElementById('contract-address').value='${currentAddress}'; document.getElementById('audit-btn').click();">${shortAddr}</td>
            <td class="py-4 px-6"><span class="${colorClass} font-bold">${score}/100</span></td>
            <td class="py-4 px-6">${verdictStr}</td>
        `;
        
        historyTable.prepend(tr);
    }
}

// Fetch Logic
auditBtn.addEventListener('click', async () => {
    let address = addressInput.value.trim();
    const network = networkSelect.value;
    const apiKey = apiKeyInput.value.trim();
    
    // Extract address if the user pastes a URL (e.g. Etherscan link or Dexscreener link)
    const addressMatch = address.match(/0x[a-fA-F0-9]{40}/);
    if (addressMatch) {
        address = addressMatch[0];
        addressInput.value = address; // Update the input field visually to just the address
    }
    
    if (!address.startsWith('0x') || address.length !== 42) {
        alert("Please enter a valid EVM contract address (or paste an Etherscan/Dexscreener link containing the address).");
        return;
    }

    // Force Dashboard Page active
    navBtns[0].click();
    
    // Force Terminal Tab active
    tabs[0].click();
    terminal.innerHTML = '';
    
    await typeWriter("> Connecting to Ritual Infernet Node...", 'text-gray-400');
    await typeWriter("> Fetching Source Code for " + address + "...", 'text-gray-400');
    
    codeLoading.classList.remove('hidden');
    codeContent.textContent = '/* Fetching from on-chain indexer... */';
    
    let source = "";
    let contractName = "target_contract";

    // 1. Check Mock Data Cache first
    if (MOCK_DATA[address]) {
        await new Promise(r => setTimeout(r, 1200)); 
        source = MOCK_DATA[address];
        if (address === "0x6982508145454ce325ddbe47a25d4ec3d2311933") contractName = "PepeToken";
        else if (address === "0x1111111111111111111111111111111111111111") contractName = "CleanToken";
        else if (address === "0xb8c77482e45f1f44de1745f52c74426c631bdd52") contractName = "BNB";
        else if (address === "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599") contractName = "WBTC";
        else if (address === "0x87230146e138d3f296a9a77e497a2a83012e9bc5") contractName = "SquidGameToken";
        else if (address === "0xbb9bc244d798123fde783fcc1c72d3bb8c189413") contractName = "TheDAO";
        else contractName = "ScamToken";
    } else {
        // 2. Fetch from Real API
        try {
            const apiUrl = APIs[network];
            const url = apiKey ? apiUrl + "?module=contract&action=getsourcecode&address=" + address + "&apikey=" + apiKey : apiUrl + "?module=contract&action=getsourcecode&address=" + address;
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.status === "1" && data.result[0].SourceCode !== "") {
                source = data.result[0].SourceCode;
                contractName = data.result[0].ContractName || "contract";
                
                if (source.startsWith('{{')) {
                    source = source.substring(1, source.length - 1);
                    const parsed = JSON.parse(source);
                    const sources = parsed.sources || parsed;
                    const firstKey = Object.keys(sources)[0];
                    source = sources[firstKey].content;
                } else if (source.startsWith('{')) {
                    const parsed = JSON.parse(source);
                    const sources = parsed.sources || parsed;
                    const firstKey = Object.keys(sources)[0];
                    source = typeof sources[firstKey] === 'string' ? sources[firstKey] : sources[firstKey].content;
                }
            } else if (data.status === "0" && data.message === "NOTOK") {
                codeLoading.classList.add('hidden');
                codeContent.textContent = '// API Error: ' + data.result;
                await typeWriter("[ERROR] API Error: " + data.result, 'text-ritual-red font-bold text-lg');
                await typeWriter("> Please enter your API Key to scan real contracts.", 'text-yellow-500');
                return;
            } else {
                codeLoading.classList.add('hidden');
                codeContent.textContent = '// Contract is unverified or does not exist.';
                await typeWriter("[ERROR] Contract Source Code is UNVERIFIED.", 'text-ritual-red glow-red font-bold text-lg');
                return;
            }
        } catch (e) {
            codeLoading.classList.add('hidden');
            codeContent.textContent = '// Connection failed.';
            await typeWriter("[ERROR] Failed to connect to API. Network error.", 'text-ritual-red');
            return;
        }
    }

    // Success path
    codeLoading.classList.add('hidden');
    codeFilename.textContent = contractName + ".sol";
    codeContent.textContent = source;
    delete codeContent.dataset.highlighted;
    hljs.highlightElement(codeContent);
    
    // Wrap each line in a div with an ID so we can highlight them robustly later
    let htmlLines = codeContent.innerHTML.split('\n');
    let wrappedLines = htmlLines.map((line, idx) => `<div id="line-${idx}" class="px-2 transition-all duration-300 border-l-4 border-transparent">${line || ' '}</div>`);
    codeContent.innerHTML = wrappedLines.join('');
    
    await typeWriter("> Source code retrieved successfully.", 'text-ritual-green glow-green');
    await auditCode(source, address, network);
});

// Mock or Real Wallet Connection
async function connectWallet(btn) {
    if (btn.innerText.includes("0x")) return; // Already connected
    
    let originalHTML = btn.innerHTML;
    btn.innerHTML = `<svg class="w-4 h-4 animate-spin text-ritual-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Connecting...`;
    
    try {
        if (typeof window.ethereum !== 'undefined') {
            // Real MetaMask Connection
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            const shortAddr = account.substring(0, 5) + '...' + account.substring(account.length - 4);
            btn.innerHTML = `<div class="w-2 h-2 bg-ritual-green rounded-full shadow-[0_0_8px_lime]"></div> <span class="text-white font-bold">${shortAddr}</span>`;
            btn.classList.add('bg-[#1a1c1e]', 'border-ritual-green/50');
        } else {
            // Mock connection if no wallet installed
            await new Promise(r => setTimeout(r, 1500)); // Fake delay
            btn.innerHTML = `<div class="w-2 h-2 bg-ritual-green rounded-full shadow-[0_0_8px_lime]"></div> <span class="text-white font-bold">0x4F9...A1b2</span>`;
            btn.classList.add('bg-[#1a1c1e]', 'border-ritual-green/50');
        }
    } catch (e) {
        btn.innerHTML = originalHTML; // Revert if user rejects
    }
}
