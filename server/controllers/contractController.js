const contractService = require("../services/manageNFT");

// 获取合约的当前值
exports.mint = async (req, res, next) => {
  const { recipient, sender } = req.body;
  try {
    const tx = await contractService.mintNFT(sender);
    res.status(200).json({ message: "NFT 铸造成功", tx });
  } catch (error) {
    next(error);
  }
};

// 设置合约的值
exports.trade = async (req, res, next) => {
  const { recipient, tokenID, sender } = req.body;
  try {
    const tx = await contractService.tradeNFT(recipient, tokenID, sender);
    res.status(200).json({ message: "NFT 交易成功", tx });
  } catch (error) {
    next(error);
  }
};
