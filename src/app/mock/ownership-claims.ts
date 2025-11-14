import { OwnershipClaim } from '../types/models';

export const mockOwnershipClaims: OwnershipClaim[] = [
  {
    id: 'claim-1',
    entityId: 'entity-3',
    entityName: 'Starbucks',
    userId: 'user-1',
    userDisplayName: 'John Doe',
    userEmail: 'john@example.com',
    status: 'pending',
    proof: 'I am the regional manager for Starbucks in the Pacific Northwest region. I can provide official documentation from our corporate office and my employee ID. I have been with the company for 8 years and manage 15 locations.',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01')
  },
  {
    id: 'claim-2',
    entityId: 'entity-7',
    entityName: 'Oppenheimer',
    userId: 'user-4',
    userDisplayName: 'Sarah Wilson',
    userEmail: 'sarah@example.com',
    status: 'pending',
    proof: 'I work for Universal Pictures in the marketing department for the Oppenheimer film. I have access to official marketing materials, behind-the-scenes content, and can coordinate with the film director and producers for responses to reviews.',
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2023-10-05')
  },
  {
    id: 'claim-3',
    entityId: 'entity-10',
    entityName: 'Midnights',
    userId: 'user-6',
    userDisplayName: 'Lisa Davis',
    userEmail: 'lisa@example.com',
    status: 'approved',
    proof: 'I represent Taylor Swift official team and manage her online presence and fan interactions. I have been authorized to respond to fan reviews and provide official updates about her music. I can provide verification through her management company.',
    reviewedBy: 'user-3',
    reviewedAt: new Date('2023-10-10'),
    createdAt: new Date('2023-10-08'),
    updatedAt: new Date('2023-10-10')
  },
  {
    id: 'claim-4',
    entityId: 'entity-11',
    entityName: 'Harry House',
    userId: 'user-1',
    userDisplayName: 'John Doe',
    userEmail: 'john@example.com',
    status: 'rejected',
    proof: 'I am a big fan of Harry Styles and follow all his social media accounts. I believe I should be able to represent his music on this platform as I know everything about his work and can respond to reviews appropriately.',
    reviewedBy: 'user-3',
    reviewedAt: new Date('2023-10-12'),
    rejectionReason: 'Insufficient proof of official affiliation. Fan knowledge alone does not constitute ownership or official representation rights.',
    createdAt: new Date('2023-10-11'),
    updatedAt: new Date('2023-10-12')
  },
  {
    id: 'claim-5',
    entityId: 'entity-8',
    entityName: 'Barbie',
    userId: 'user-4',
    userDisplayName: 'Sarah Wilson',
    userEmail: 'sarah@example.com',
    status: 'pending',
    proof: 'I work for Warner Bros. Pictures and was part of the Barbie film production team. I have official credentials, access to production materials, and direct communication channels with the film creators and marketing team.',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-15')
  }
];

export const getPendingClaims = (): OwnershipClaim[] => {
  return mockOwnershipClaims.filter(claim => claim.status === 'pending');
};

export const getClaimsByUser = (userId: string): OwnershipClaim[] => {
  return mockOwnershipClaims.filter(claim => claim.userId === userId);
};

export const getClaimById = (id: string): OwnershipClaim | undefined => {
  return mockOwnershipClaims.find(claim => claim.id === id);
};

export const createOwnershipClaim = (
  entityId: string,
  entityName: string,
  userId: string,
  userDisplayName: string,
  userEmail: string,
  proof: string
): OwnershipClaim => {
  const newClaim: OwnershipClaim = {
    id: `claim-${Date.now()}`,
    entityId,
    entityName,
    userId,
    userDisplayName,
    userEmail,
    status: 'pending',
    proof,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockOwnershipClaims.push(newClaim);
  return newClaim;
};

export const approveClaim = (claimId: string, reviewedBy: string): void => {
  const claim = mockOwnershipClaims.find(c => c.id === claimId);
  if (claim && claim.status === 'pending') {
    claim.status = 'approved';
    claim.reviewedBy = reviewedBy;
    claim.reviewedAt = new Date();
    claim.updatedAt = new Date();
  }
};

export const rejectClaim = (claimId: string, reviewedBy: string, rejectionReason: string): void => {
  const claim = mockOwnershipClaims.find(c => c.id === claimId);
  if (claim && claim.status === 'pending') {
    claim.status = 'rejected';
    claim.reviewedBy = reviewedBy;
    claim.reviewedAt = new Date();
    claim.rejectionReason = rejectionReason;
    claim.updatedAt = new Date();
  }
};