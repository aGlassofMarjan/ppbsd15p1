'use strict';
const {readFile} = require('fs').promises
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const data = JSON.parse(await readFile('./data/post.json', 'utf-8'))
   const post = data.map(el => {
    el.createdAt = new Date()
    el.updatedAt = new Date()
    return el
   })
   await queryInterface.bulkInsert('Posts', post, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Posts', post, {
      truncate: true,
      restartIdentity: true
    })
  }

};
