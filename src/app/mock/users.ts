import { User } from '../types/models';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    displayName: 'John Doe',
    email: 'john@example.com',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'regular',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'user-2',
    displayName: 'Jane Smith',
    email: 'jane@example.com',
    photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
    role: 'owner',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20')
  },
  {
    id: 'user-3',
    displayName: 'Mike Johnson',
    email: 'mike@example.com',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10')
  },
  {
    id: 'user-4',
    displayName: 'Sarah Wilson',
    email: 'sarah@example.com',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'regular',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-05')
  },
  {
    id: 'user-5',
    displayName: 'David Brown',
    email: 'david@example.com',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'owner',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2023-05-12')
  },
  {
    id: 'user-6',
    displayName: 'Lisa Davis',
    email: 'lisa@example.com',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: 'regular',
    createdAt: new Date('2023-06-18'),
    updatedAt: new Date('2023-06-18')
  }
];

export const getCurrentUser = (): User | null => {
  // For Phase 1, return a mock current user or null
  // This will be replaced with actual authentication in Phase 2
  return mockUsers[0]; // Default to John Doe for testing
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: User['role']): User[] => {
  return mockUsers.filter(user => user.role === role);
};