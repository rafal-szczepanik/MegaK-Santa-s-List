const {v4: uuid} = require('uuid');
const {ValidationError} = require("../utils/error");
const {pool} = require('../utils/db');

class GiftRecord {
  constructor(obj) {
    if (!obj.name || obj.name.length < 3 || obj.name.length > 55) {
      throw new ValidationError("Nazwa prezentu musi mieć między 3 a 55 znaków.");
    }
    if (!obj.stock || obj.stock < 1 || obj.stock > 999999) {
      throw new ValidationError("Ilość dodanego prezentu musi się mieścić między 1 a 999999 sztuk.");
    }

    this.id = obj.id;
    this.name = obj.name;
    this.stock = obj.stock;
  }

  static async getAll() {
    const [results] = await pool.execute("SELECT * FROM `gifts`");
    return results.map(result => new GiftRecord(result));
  }

  static async getOne(id) {
    const [result] = await pool.execute("SELECT * FROM `gifts` WHERE `id` = :id", {
      id,
    });
    return new GiftRecord(result[0]);
  }

  async insert() {
    if (!this.id) {
      this.id = uuid();
    }
    await pool.execute("INSERT INTO `gifts` VALUES(:id, :name, :stock)", {
      id: this.id,
      name: this.name,
      stock: this.stock,
    });
  }

  async countUsedGifts() {
    const [[{stock}]] = await pool.execute("SELECT COUNT(*) As `stock` FROM `children` WHERE `giftId`= :id", {
      id: this.id,
    });
    return stock;
  }
}

module.exports = {
  GiftRecord,
};