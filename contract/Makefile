-include .env

.PHONY: all test deploy

build :; forge build

test :; forge test

start-interface :; node server/services/gameInterface.js

deploy-sepolia:
	@forge script script/DeployPlantNFTFactory.s.sol:DeployPlantNFTFactory --rpc-url $(SEPOLIA_RPC_URL) --account defaultKey --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)
	@forge script script/DeployRandomNumberGenerator.s.sol:DeployRandomNumberGenerator --rpc-url $(SEPOLIA_RPC_URL) --account defaultKey --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

deploy-anvil:
	@forge script script/DeployPlantNFTFactory.s.sol:DeployPlantNFTFactory --rpc-url $(ANVIL_RPC_URL) --account defaultKey --broadcast
	@forge script script/DeployRandomNumberGenerator.s.sol:DeployRandomNumberGenerator --rpc-url $(ANVIL_RPC_URL) --account defaultKey --broadcast
