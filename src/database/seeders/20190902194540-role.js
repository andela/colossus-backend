export default {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', [
    { name: 'Super Administrator' },
    { name: 'Travel Administrator' },
    { name: 'Travel Team Member' },
    { name: 'Manager' },
    { name: 'Requester' },
    { name: 'Supplier' }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {})
};
