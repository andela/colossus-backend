export default {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@barefootnomad.com',
      password: '$2a$10$TW9WwKBH.tTajGis/ryeaOT6.X3fLfhwpvZMnGYSa/B8Iw.fy/a4i',
      isVerified: true,
      role: 'super_admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
