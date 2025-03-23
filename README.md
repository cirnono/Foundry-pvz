# PvZNFT

Users can mint NFTs, which represent different types of plants with different attibutes. Users can then use the NFTs they own to participate in games and fight with Zombies.

## Quick Start:

```shell
foundryup
foundry build
```

## TODOs

0. Account manager, user is asked to login (or sign up if it is for the first time). Then minted NFTs, username, password, and wallet connection can be stored
1. Implement game-logic.js, which starts the game, allow players to play with their own NFTs and verify the the provided NFTs
2. Implement scripts that auto record contract address, player's address and the token ids they own.
3. Write tests
4. Front-end
5. NFT trading

## Take-aways:

1. function returns of solidiy is in the form of storing address, need to .toString() to convert to actual value
