const {Router} = require("express");
const {GiftRecord} = require("../record/gift.record");

const giftRouter = Router();

giftRouter
  .get('/', async (req, res) => {
    const allGifts = await GiftRecord.getAll();


    res.render('gift/list', {
      allGifts,
    });
  })
  .post('/', async (req, res) => {
    const data = {
      ...req.body,
      stock: Number(req.body.stock)
    };
    const newGift = new GiftRecord(data);
    await newGift.insert();

    res.redirect('/gift',);
  });

module.exports = {
  giftRouter,
};