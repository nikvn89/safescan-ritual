.PHONY: node-up node-down deploy

# Start the Infernet Node and SafeScan AI Container
node-up:
	cd node && docker-compose up -d

# Stop the containers
node-down:
	cd node && docker-compose down

# Deploy the Smart Contract to Ritual Testnet
deploy:
	cd contracts && forge script script/Deploy.s.sol:DeployScript --rpc-url $(RPC_URL) --broadcast -vvvv
