const {ValidationError} = require("../utils/error");
const {Router} = require("express");
const {GiftRecord} = require("../record/gift.record");
const {ChildRecord} = require('../record/child.record');

const childRouter = Router();

childRouter
  .get('/', async (req, res) => {
    const allChildren = await ChildRecord.getAll();
    const allGifts = await GiftRecord.getAll();

    res.render('child/list', {
      allChildren,
      allGifts,
    });
  })
  .post('/', async (req, res) => {
    const newChild = new ChildRecord(req.body);
    console.log(newChild);
    await newChild.insert();

    res.redirect('/child',);
  })
  .patch('/gift/:childId', async (req, res) => {
    const childId = req.params.childId;
    const child = await ChildRecord.getOne(childId);
    const gift = req.body.giftId === "" ? null : await GiftRecord.getOne(req.body.giftId);

    if (gift) {
      if (gift.stock <=await gift.countUsedGifts()) {
        throw new ValidationError("Wykorzystano wszystkie prezenty tego typu z magazyny.");
      }
    }
    child.giftId = !gift ? null : gift.id;
    await child.update();

    res.redirect('/child',);
  });
module.exports = {
  childRouter,
};