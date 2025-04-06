-include .env

.PHONY: all test deploy

build :; forge build

test :; forge test

start-interface :; node engine/gameInterface.js

deploy-sepolia:
	@forge script server/script/DeployPlantNFTFactory.s.sol:DeployPlantNFTFactory --rpc-url $(SEPOLIA_RPC_URL) --account defaultKey --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)
	@forge script server/script/DeployRandomNumberGenerator.s.sol:DeployRandomNumberGenerator --rpc-url $(SEPOLIA_RPC_URL) --account defaultKey --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

deploy-anvil:
	@forge script server/script/DeployPlantNFTFactory.s.sol:DeployPlantNFTFactory --rpc-url $(ANVIL_RPC_URL) --account defaultKey --broadcast
	@forge script server/script/DeployRandomNumberGenerator.s.sol:DeployRandomNumberGenerator --rpc-url $(ANVIL_RPC_URL) --account defaultKey --broadcast
