"use strict";

const { hash } = require("../utils/bcrypt");

const { readFile } = require("fs").promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const data = JSON.parse(await readFile("./data/admin.json", "utf-8"));
    const admin = data.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      el.password = hash(el.password);
      return el;
    });
    await queryInterface.bulkInsert("Users", admin, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
