export default {
  up: (queryInterface) => queryInterface.bulkInsert('Permissions', [
    {
      role: 'super_admin',
      resource: 'role',
      create: true,
      read: true,
      update: true,
      delete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'super_admin',
      resource: 'accommodation',
      create: true,
      read: true,
      update: true,
      delete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'super_admin',
      resource: 'trip',
      create: true,
      read: true,
      update: true,
      delete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'super_admin',
      resource: 'request',
      create: true,
      read: true,
      update: true,
      delete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'super_admin',
      resource: 'user',
      create: true,
      read: true,
      update: true,
      delete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'manager',
      resource: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'manager',
      resource: 'accommodation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'manager',
      resource: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'manager',
      resource: 'trip',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'manager',
      resource: 'request',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'requester',
      resource: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'requester',
      resource: 'accommodation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'requester',
      resource: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'requester',
      resource: 'trip',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'requester',
      resource: 'request',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'supplier',
      resource: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'supplier',
      resource: 'accommodation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'supplier',
      resource: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'supplier',
      resource: 'trip',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'supplier',
      resource: 'request',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_admin',
      resource: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_admin',
      resource: 'accommodation',
      create: true,
      read: true,
      update: true,
      delete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_admin',
      resource: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_admin',
      resource: 'trip',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_admin',
      resource: 'request',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_team_member',
      resource: 'role',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_team_member',
      resource: 'accommodation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_team_member',
      resource: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_team_member',
      resource: 'trip',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'travel_team_member',
      resource: 'request',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Permissions', null, {})
};
