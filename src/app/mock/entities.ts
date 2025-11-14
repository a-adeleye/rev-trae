import { Entity } from '../types/models';

export const mockEntities: Entity[] = [
  // Brands
  {
    id: 'entity-1',
    name: 'Nike',
    description: 'Global sportswear and athletic footwear company known for innovation and performance.',
    category: 'brand',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    website: 'https://www.nike.com',
    averageRating: 4.2,
    totalReviews: 1250,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 'entity-2',
    name: 'Apple',
    description: 'Technology company designing and manufacturing consumer electronics and software.',
    category: 'brand',
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=300&fit=crop',
    website: 'https://www.apple.com',
    averageRating: 4.5,
    totalReviews: 2100,
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02')
  },
  {
    id: 'entity-3',
    name: 'Starbucks',
    description: 'Global coffee company and coffeehouse chain with premium coffee experience.',
    category: 'brand',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    website: 'https://www.starbucks.com',
    averageRating: 3.8,
    totalReviews: 890,
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03')
  },

  // Products
  {
    id: 'entity-4',
    name: 'iPhone 15 Pro',
    description: 'Latest flagship smartphone with advanced camera system and titanium design.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    website: 'https://www.apple.com/iphone-15-pro',
    averageRating: 4.6,
    totalReviews: 1800,
    createdAt: new Date('2023-01-04'),
    updatedAt: new Date('2023-01-04')
  },
  {
    id: 'entity-5',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with premium sound quality.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    website: 'https://electronics.sony.com',
    averageRating: 4.4,
    totalReviews: 650,
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05')
  },
  {
    id: 'entity-6',
    name: 'MacBook Air M2',
    description: 'Ultra-thin laptop with M2 chip, delivering incredible performance and battery life.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    website: 'https://www.apple.com/macbook-air',
    averageRating: 4.7,
    totalReviews: 1200,
    createdAt: new Date('2023-01-06'),
    updatedAt: new Date('2023-01-06')
  },

  // Movies
  {
    id: 'entity-7',
    name: 'Oppenheimer',
    description: 'Epic biographical thriller about J. Robert Oppenheimer and the development of the atomic bomb.',
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=300&fit=crop',
    website: 'https://www.oppenheimermovie.com',
    averageRating: 4.3,
    totalReviews: 950,
    createdAt: new Date('2023-01-07'),
    updatedAt: new Date('2023-01-07')
  },
  {
    id: 'entity-8',
    name: 'Barbie',
    description: 'Fantasy comedy film following Barbie and Ken on a journey of self-discovery.',
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    website: 'https://www.barbie-themovie.com',
    averageRating: 4.1,
    totalReviews: 1100,
    createdAt: new Date('2023-01-08'),
    updatedAt: new Date('2023-01-08')
  },
  {
    id: 'entity-9',
    name: 'Dune: Part Two',
    description: 'Science fiction epic continuing Paul Atreides journey as he unites with Chani and the Fremen.',
    category: 'movie',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
    website: 'https://www.dunemovie.com',
    averageRating: 4.5,
    totalReviews: 750,
    createdAt: new Date('2023-01-09'),
    updatedAt: new Date('2023-01-09')
  },

  // Music
  {
    id: 'entity-10',
    name: 'Midnights',
    description: 'Taylor Swift tenth studio album featuring synth-pop and dream pop sounds.',
    category: 'music',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    website: 'https://www.taylorswift.com',
    averageRating: 4.4,
    totalReviews: 1800,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10')
  },
  {
    id: 'entity-11',
    name: 'Harry House',
    description: 'Harry Styles third studio album blending pop, rock, and synth elements.',
    category: 'music',
    imageUrl: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=400&h=300&fit=crop',
    website: 'https://www.hstyles.co.uk',
    averageRating: 4.2,
    totalReviews: 950,
    createdAt: new Date('2023-01-11'),
    updatedAt: new Date('2023-01-11')
  },
  {
    id: 'entity-12',
    name: 'Renaissance',
    description: 'Beyoncé seventh studio album celebrating Black queer culture and dance music.',
    category: 'music',
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop',
    website: 'https://www.beyonce.com',
    averageRating: 4.6,
    totalReviews: 1300,
    createdAt: new Date('2023-01-12'),
    updatedAt: new Date('2023-01-12')
  }
];

export const getEntityById = (id: string): Entity | undefined => {
  return mockEntities.find(entity => entity.id === id);
};

export const getEntitiesByCategory = (category: Entity['category']): Entity[] => {
  return mockEntities.filter(entity => entity.category === category);
};

export const searchEntities = (query: string, category?: string): Entity[] => {
  let results = mockEntities;
  
  if (category && category !== 'all') {
    results = results.filter(entity => entity.category === category);
  }
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(entity => 
      entity.name.toLowerCase().includes(lowerQuery) ||
      entity.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  return results;
};

export const getTopRatedEntities = (limit: number = 6): Entity[] => {
  return [...mockEntities]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit);
};

export const getMostReviewedEntities = (limit: number = 6): Entity[] => {
  return [...mockEntities]
    .sort((a, b) => b.totalReviews - a.totalReviews)
    .slice(0, limit);
};