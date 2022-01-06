const {v4: uuid} = require("uuid");
const {ValidationError} = require("../utils/errors");
const {pool} = require("../utils/db");

class GiftRecord {
  constructor(obj) {
    if (!obj.name || obj.name.length < 3 || obj.name.length > 55) {
      throw new ValidationError('Nazwa prezentu musi mieć od 3 do 55 znaków.');
    }
    if (!obj.stock || obj.stock < 1 || obj.stock.length > 999999) {
      throw new ValidationError('Liczba szt.prezentu powinna się mieścić w przedziale 1 - 999999.');
    }
    this.id = obj.id;
    this.name = obj.name;
    this.stock = obj.stock;
  }

  static async listAll() {
    const [results] = await (pool.execute("SELECT * FROM `gifts`"));
    return results.map(result => new GiftRecord(result));
  }

  static async getOne(id) {
    const [result] = await pool.execute("SELECT * FROM `gifts` WHERE `id` = :id", {
      id,
    });
    return result.length === 0 ? null : new GiftRecord(result[0]);
  }

  async countGivenGifts() {
    const [[{count}]] = await pool.execute("SELECT COUNT(*) AS `count` FROM `children` WHERE `giftId` = :id", {
      id: this.id,
    });
    return count;
  }

  async insert() {
    this.id = this.id ?? uuid();
    await pool.execute("INSERT INTO `gifts` VALUES(:id, :name, :stock)", {
      id: this.id,
      name: this.name,
      stock: this.stock
    });
    return this.id;
  }
}

module.exports = {
  GiftRecord
};