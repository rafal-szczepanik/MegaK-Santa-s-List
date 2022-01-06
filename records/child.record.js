const {pool} = require("../utils/db");
const {ValidationError} = require("../utils/errors");
const {v4: uuid} = require("uuid");

class ChildRecord {
  constructor(obj) {
    if (!obj.name || obj.name.length < 3 || obj.name.length > 25) {
      throw new ValidationError('Imię musi mieć od 3 do 25 znaków.');
    }
    this.id = obj.id;
    this.name = obj.name;
    this.giftId = obj.giftId;
  }

  static async listAll() {
    const [results] = await pool.execute("SELECT * FROM `children` ORDER BY `name` ASC");
    return results.map(result => new ChildRecord(result));
  }

  static async getOne(id) {
    const [result] = await pool.execute("SELECT * FROM `children` WHERE `id` = :id", {
      id,
    });
    return result.length === 0 ? null : new ChildRecord(result[0]);
  }

  async insert() {
    this.id = this.id ?? uuid();

    await pool.execute("INSERT INTO `children`(`id`,`name`) VALUES(:id, :name)", {
      id: this.id,
      name: this.name,
    });
    return this.id;
  }

  async update() {
    await pool.execute("UPDATE `children` SET `id` = :id,`name`= :name , `giftId` = :giftId WHERE `id` = :id", {
      id: this.id,
      name: this.name,
      giftId: this.giftId
    });
  }
}

module.exports = {
  ChildRecord
};