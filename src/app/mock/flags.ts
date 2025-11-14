import { Flag } from '../types/models';

export const mockFlags: Flag[] = [
  {
    id: 'flag-1',
    reviewId: 'review-4',
    entityId: 'entity-2',
    userId: 'user-5',
    userDisplayName: 'David Brown',
    reason: 'fake',
    description: 'This review appears to be fake and not based on actual experience with Apple products. The reviewer seems to be promoting competing brands and spreading misinformation.',
    status: 'pending',
    createdAt: new Date('2023-08-06')
  },
  {
    id: 'flag-2',
    reviewId: 'review-6',
    entityId: 'entity-4',
    userId: 'user-5',
    userDisplayName: 'David Brown',
    reason: 'inappropriate',
    description: 'The review contains inappropriate language and personal attacks rather than focusing on the product itself. This violates the community guidelines.',
    status: 'resolved',
    resolvedBy: 'user-3',
    resolvedAt: new Date('2023-10-02'),
    createdAt: new Date('2023-10-01')
  },
  {
    id: 'flag-3',
    reviewId: 'review-13',
    entityId: 'entity-11',
    userId: 'user-6',
    userDisplayName: 'Lisa Davis',
    reason: 'spam',
    description: 'This review seems to be spam with repetitive content and promotional links. The reviewer appears to be promoting unrelated products and services.',
    status: 'dismissed',
    resolvedBy: 'user-3',
    resolvedAt: new Date('2023-09-25'),
    createdAt: new Date('2023-09-20')
  },
  {
    id: 'flag-4',
    reviewId: 'review-2',
    entityId: 'entity-1',
    userId: 'user-2',
    userDisplayName: 'Jane Smith',
    reason: 'other',
    description: 'This review contains factually incorrect information about Nike product availability and pricing. The reviewer claims limited availability which is not accurate.',
    status: 'pending',
    createdAt: new Date('2023-10-05')
  },
  {
    id: 'flag-5',
    reviewId: 'review-10',
    entityId: 'entity-8',
    userId: 'user-4',
    userDisplayName: 'Sarah Wilson',
    reason: 'inappropriate',
    description: 'The review contains inappropriate personal attacks on the film creators and actors rather than constructive criticism of the movie itself.',
    status: 'pending',
    createdAt: new Date('2023-10-12')
  }
];

export const getPendingFlags = (): Flag[] => {
  return mockFlags.filter(flag => flag.status === 'pending');
};

export const getFlagsByReview = (reviewId: string): Flag[] => {
  return mockFlags.filter(flag => flag.reviewId === reviewId);
};

export const getFlagsByEntity = (entityId: string): Flag[] => {
  return mockFlags.filter(flag => flag.entityId === entityId);
};

export const getFlagById = (id: string): Flag | undefined => {
  return mockFlags.find(flag => flag.id === id);
};

export const createFlag = (
  reviewId: string,
  entityId: string,
  userId: string,
  userDisplayName: string,
  reason: Flag['reason'],
  description: string
): Flag => {
  const newFlag: Flag = {
    id: `flag-${Date.now()}`,
    reviewId,
    entityId,
    userId,
    userDisplayName,
    reason,
    description,
    status: 'pending',
    createdAt: new Date()
  };
  
  mockFlags.push(newFlag);
  return newFlag;
};

export const resolveFlag = (flagId: string, resolvedBy: string): void => {
  const flag = mockFlags.find(f => f.id === flagId);
  if (flag && flag.status === 'pending') {
    flag.status = 'resolved';
    flag.resolvedBy = resolvedBy;
    flag.resolvedAt = new Date();
  }
};

export const dismissFlag = (flagId: string, resolvedBy: string): void => {
  const flag = mockFlags.find(f => f.id === flagId);
  if (flag && flag.status === 'pending') {
    flag.status = 'dismissed';
    flag.resolvedBy = resolvedBy;
    flag.resolvedAt = new Date();
  }
};