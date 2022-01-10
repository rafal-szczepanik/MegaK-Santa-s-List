const {v4: uuid} = require('uuid');
const {ValidationError} = require("../utils/error");
const {pool} = require('../utils/db');

class ChildRecord {
  constructor(obj) {
    if (!obj.name || obj.name.length < 3 || obj.name.length > 25) {
      throw new ValidationError("Imię musi mieć między 3 a 25 znaków.");
    }
    // if (!obj.number || obj.number < 1 || obj.number > 999999) {
    //   throw new ValidationError("Numer nie może być mniejszy niz 1 oraz większy niż 999999.");
    // }

    this.id = obj.id;
    this.number = obj.number;
    this.name = obj.name;
    this.giftId = obj.giftId;
  }

  static async getAll() {
    const [results] = await pool.execute("SELECT * FROM `children` ORDER BY `number` ASC");
    return results.map(result => new ChildRecord(result));
  }

  static async getOne(id) {
    const [result] = await pool.execute("SELECT * FROM `children` WHERE `id` = :id", {
      id,
    });
    return new ChildRecord(result[0]);
  }

  async insert() {
    if (!this.id) {
      this.id = uuid();
    }

    console.log(this.number);
    await pool.execute("INSERT INTO `children`(`id`,`number`,`name`) VALUES(:id, :number, :name)", {
      id: this.id,
      number: this.number + 1,
      name: this.name,
    });
  }

  async update() {
    await pool.execute("UPDATE `children` SET `id` = :id, `name` = :name,`giftId` = :giftId WHERE `id` = :id", {
      id: this.id,
      name: this.name,
      giftId: this.giftId,
    });
  }
}

module.exports = {
  ChildRecord,
};