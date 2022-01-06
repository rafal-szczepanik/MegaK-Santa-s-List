const {GiftRecord} = require("../records/gift.record");
const {Router} = require('express');

const giftRouter = Router();

giftRouter
  .get('/', async (req, res) => {

    const giftsList = await GiftRecord.listAll();

    res.render('gift/list', {
      giftsList
    });
  })

  .post('/', async (req, res) => {
    const data = {
      ...req.body,
      stock: Number(req.body.stock)
    };
    console.log(data);
    const newGift = new GiftRecord(data);
    await newGift.insert();

    res.redirect('/gift');
  });

module.exports = {
  giftRouter
};