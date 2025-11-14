import { EntityOwner } from '../types/models';

export const mockEntityOwners: EntityOwner[] = [
  {
    id: 'owner-1',
    entityId: 'entity-1',
    userId: 'user-2',
    userDisplayName: 'Jane Smith',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'owner-2',
    entityId: 'entity-2',
    userId: 'user-5',
    userDisplayName: 'David Brown',
    createdAt: new Date('2023-01-20')
  },
  {
    id: 'owner-3',
    entityId: 'entity-4',
    userId: 'user-5',
    userDisplayName: 'David Brown',
    createdAt: new Date('2023-02-01')
  },
  {
    id: 'owner-4',
    entityId: 'entity-5',
    userId: 'user-5',
    userDisplayName: 'David Brown',
    createdAt: new Date('2023-02-05')
  },
  {
    id: 'owner-5',
    entityId: 'entity-6',
    userId: 'user-5',
    userDisplayName: 'David Brown',
    createdAt: new Date('2023-02-10')
  }
];

export const getEntityOwners = (entityId: string): EntityOwner[] => {
  return mockEntityOwners.filter(owner => owner.entityId === entityId);
};

export const getOwnerEntities = (userId: string): EntityOwner[] => {
  return mockEntityOwners.filter(owner => owner.userId === userId);
};

export const isEntityOwner = (entityId: string, userId: string): boolean => {
  return mockEntityOwners.some(owner => owner.entityId === entityId && owner.userId === userId);
};

export const addEntityOwner = (entityId: string, userId: string, userDisplayName: string): EntityOwner => {
  const newOwner: EntityOwner = {
    id: `owner-${Date.now()}`,
    entityId,
    userId,
    userDisplayName,
    createdAt: new Date()
  };
  
  mockEntityOwners.push(newOwner);
  return newOwner;
};