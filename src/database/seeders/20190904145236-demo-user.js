
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
    {
      id: 5,
      firstName: 'John',
      lastName: 'Doe',
      role: 'requester',
      password: 'password',
      isVerified: true,
      lineManagerId: 7,
      email: 'ibitamuno432@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      firstName: 'John',
      lastName: 'Doe',
      role: 'manager',
      isVerified: true,
      password: 'password',
      lineManagerId: null,
      email: 'taprekuma@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),


  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
