module.exports = {
  Sunflower: {
    attributes: {
      hp: { min: 50, max: 100 },
      produceRate: { min: 1, max: 5 }, // 随机 1-5 回合产出阳光
      sunlightAmount: { min: 50, max: 150 }, // 随机 50-150 阳光
    },
    message: `This smiling flower powers your journey!\n`,
  },
  Peashooter: {
    attributes: {
      hp: { min: 100, max: 150 },
      attack: { min: 10, max: 40 }, // 随机 10-40 伤害
    },
    message: `This guy can't hold back anymore!\n`,
  },
  Wallnut: {
    attributes: {
      hp: { min: 200, max: 250 },
      defense: { min: 10, max: 20 }, // 随机 10-50% 伤害减免
    },
    message: `He barely talks, enermies barely pass...\n`,
  },
};
