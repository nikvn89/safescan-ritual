from flask import Flask, request, jsonify
import re
import requests
from eth_abi import encode

app = Flask(__name__)

ETHERSCAN_API = "https://api.etherscan.io/api"

def analyze_contract(source_code):
    score = 100
    verdict = "SAFE"
    reasons = []

    if re.search(r'function\s+(mint|_mint)\s*\(', source_code, re.IGNORECASE) and 'require(msg.sender == owner' in source_code:
        score -= 40
        reasons.append("Owner can mint unlimited tokens (Honeypot risk).")
    
    if re.search(r'mapping\s*\(\s*address\s*=>\s*bool\s*\)\s+(public\s+|private\s+)?(_isBlacklisted|isBlacklisted|blacklist)', source_code, re.IGNORECASE):
        score -= 15
        reasons.append("Blacklist function detected (Censorship risk).")
        
    if re.search(r'function\s+transferFrom\s*\([^)]*\)\s*(public|external)\s*.*{\s*require\(false', source_code, re.IGNORECASE) or 'Honeypot' in source_code:
        score -= 100
        reasons.append("Selling is disabled (Honeypot).")

    if 'call.value' in source_code and not 'ReentrancyGuard' in source_code:
        score -= 50
        reasons.append("Potential Reentrancy vulnerability detected.")

    score = max(0, score)
    if score == 100:
        verdict = "SAFE"
    elif score >= 70:
        verdict = "WARNING"
    else:
        verdict = "CRITICAL"

    return score, verdict

@app.route('/compute', methods=['POST'])
def compute():
    data = request.json
    target_address = data.get('input') # Hex string encoded address
    
    if not target_address:
        return jsonify({"error": "No target address provided"}), 400
        
    # Convert padded hex address to actual address (mock)
    if len(target_address) > 42:
        address = "0x" + target_address[-40:]
    else:
        address = target_address

    # Fetch source from Etherscan
    params = {
        "module": "contract",
        "action": "getsourcecode",
        "address": address
    }
    
    try:
        response = requests.get(ETHERSCAN_API, params=params).json()
        if response['status'] == "1" and response['result'][0]['SourceCode']:
            source = response['result'][0]['SourceCode']
            score, verdict = analyze_contract(source)
            
            # Encode output for the smart contract: (uint8, string)
            encoded_output = encode(['uint8', 'string'], [score, verdict])
            hex_output = "0x" + encoded_output.hex()
            
            return jsonify({"output": hex_output})
        else:
            return jsonify({"error": "Contract source not verified"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
