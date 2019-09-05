export default {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', [
    {
      name: 'super_admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'travel_admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'travel_team_member',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'manager',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'requester',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'supplier',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {})
};
