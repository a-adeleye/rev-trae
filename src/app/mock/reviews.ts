import { Review } from '../types/models';

export const mockReviews: Review[] = [
  // Nike reviews
  {
    id: 'review-1',
    entityId: 'entity-1',
    userId: 'user-1',
    userDisplayName: 'John Doe',
    rating: 5,
    title: 'Excellent Quality and Comfort',
    content: 'Nike consistently delivers high-quality athletic wear. Their shoes are incredibly comfortable and durable. I have been using Nike products for years and they never disappoint. The innovation in their designs keeps getting better.',
    pros: ['Comfortable fit', 'Durable materials', 'Stylish design', 'Great performance'],
    cons: ['Premium pricing', 'Limited availability for some models'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 45,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: 'review-2',
    entityId: 'entity-1',
    userId: 'user-4',
    userDisplayName: 'Sarah Wilson',
    rating: 4,
    title: 'Good but Pricey',
    content: 'Great quality products but quite expensive. The designs are trendy and the materials feel premium. Customer service could be better. Overall satisfied with my purchases.',
    pros: ['High quality materials', 'Trendy designs', 'Wide variety'],
    cons: ['Expensive', 'Customer service needs improvement'],
    wouldRecommend: true,
    verified: false,
    helpfulCount: 23,
    createdAt: new Date('2023-07-20'),
    updatedAt: new Date('2023-07-20')
  },

  // Apple reviews
  {
    id: 'review-3',
    entityId: 'entity-2',
    userId: 'user-4',
    userDisplayName: 'Sarah Wilson',
    rating: 5,
    title: 'Innovative and Reliable',
    content: 'Apple products are simply the best in terms of build quality and user experience. The ecosystem is seamless and everything works together perfectly. Yes, they are expensive, but you get what you pay for.',
    pros: ['Premium build quality', 'Excellent user experience', 'Seamless ecosystem', 'Regular updates'],
    cons: ['High price point', 'Limited customization options'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 67,
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10')
  },
  {
    id: 'review-4',
    entityId: 'entity-2',
    userId: 'user-6',
    userDisplayName: 'Lisa Davis',
    rating: 3,
    title: 'Good Products, Overpriced',
    content: 'While Apple products are well-designed and functional, the pricing is simply too high for what you get. There are comparable alternatives at much lower prices. The brand premium is excessive.',
    pros: ['Clean design', 'User-friendly interface', 'Good build quality'],
    cons: ['Overpriced', 'Limited compatibility', 'Expensive repairs'],
    wouldRecommend: false,
    verified: false,
    helpfulCount: 34,
    createdAt: new Date('2023-08-05'),
    updatedAt: new Date('2023-08-05')
  },

  // iPhone 15 Pro reviews
  {
    id: 'review-5',
    entityId: 'entity-4',
    userId: 'user-1',
    userDisplayName: 'John Doe',
    rating: 5,
    title: 'Best iPhone Yet',
    content: 'The iPhone 15 Pro is absolutely incredible. The camera system is phenomenal, especially the new zoom capabilities. The titanium design feels premium and the performance is blazing fast. Worth every penny.',
    pros: ['Amazing camera system', 'Titanium design', 'Fast performance', 'Great battery life'],
    cons: ['Very expensive', 'No charger included'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 89,
    createdAt: new Date('2023-09-20'),
    updatedAt: new Date('2023-09-20')
  },
  {
    id: 'review-6',
    entityId: 'entity-4',
    userId: 'user-5',
    userDisplayName: 'David Brown',
    rating: 4,
    title: 'Great Phone with Minor Issues',
    content: 'Excellent phone overall. The camera is outstanding and the build quality is top-notch. However, it gets quite warm during intensive tasks and the price is steep. Still a solid upgrade.',
    pros: ['Outstanding camera', 'Premium build', 'Smooth performance'],
    cons: ['Gets warm under load', 'Expensive', 'Minor software bugs'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 56,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01')
  },

  // Sony headphones reviews
  {
    id: 'review-7',
    entityId: 'entity-5',
    userId: 'user-6',
    userDisplayName: 'Lisa Davis',
    rating: 5,
    title: 'Best Noise Canceling Headphones',
    content: 'These are hands down the best noise canceling headphones I have ever used. The sound quality is exceptional and the comfort is unmatched for long listening sessions. Battery life is impressive too.',
    pros: ['Excellent noise canceling', 'Superior sound quality', 'Very comfortable', 'Long battery life'],
    cons: ['Expensive', 'Case is quite large'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 72,
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2023-07-15')
  },

  // MacBook Air M2 reviews
  {
    id: 'review-8',
    entityId: 'entity-6',
    userId: 'user-4',
    userDisplayName: 'Sarah Wilson',
    rating: 5,
    title: 'Perfect Laptop for Most Users',
    content: 'The M2 MacBook Air is the perfect laptop for most people. It is incredibly fast, silent, and has amazing battery life. The design is sleek and portable. Great for work, creativity, and entertainment.',
    pros: ['Incredible performance', 'All-day battery life', 'Silent operation', 'Beautiful design'],
    cons: ['Limited ports', 'Expensive upgrades'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 91,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-01')
  },

  // Oppenheimer reviews
  {
    id: 'review-9',
    entityId: 'entity-7',
    userId: 'user-1',
    userDisplayName: 'John Doe',
    rating: 5,
    title: 'Cinematic Masterpiece',
    content: 'Christopher Nolan has created another masterpiece. The storytelling is gripping, the performances are outstanding, and the technical aspects are flawless. A must-watch film that makes you think deeply.',
    pros: ['Brilliant storytelling', 'Outstanding performances', 'Beautiful cinematography', 'Thought-provoking'],
    cons: ['Long runtime', 'Complex narrative structure'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 108,
    createdAt: new Date('2023-07-25'),
    updatedAt: new Date('2023-07-25')
  },

  // Barbie reviews
  {
    id: 'review-10',
    entityId: 'entity-8',
    userId: 'user-6',
    userDisplayName: 'Lisa Davis',
    rating: 4,
    title: 'Fun and Thoughtful',
    content: 'Much more than just a fun movie. It has depth, humor, and important messages about identity and society. Greta Gerwig did an amazing job balancing entertainment with substance.',
    pros: ['Great humor', 'Important messages', 'Beautiful visuals', 'Strong performances'],
    cons: ['Pacing issues in middle', 'Some jokes fall flat'],
    wouldRecommend: true,
    verified: false,
    helpfulCount: 67,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2023-08-10')
  },

  // Dune reviews
  {
    id: 'review-11',
    entityId: 'entity-9',
    userId: 'user-4',
    userDisplayName: 'Sarah Wilson',
    rating: 5,
    title: 'Epic Sci-Fi at Its Best',
    content: 'Denis Villeneuve has delivered an epic continuation to the Dune saga. The scale is massive, the visuals are stunning, and the story is compelling. A perfect blend of action, politics, and philosophy.',
    pros: ['Stunning visuals', 'Epic scale', 'Strong performances', 'Compelling story'],
    cons: ['Requires viewing of Part One', 'Complex for newcomers'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 84,
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2023-09-05')
  },

  // Taylor Swift album reviews
  {
    id: 'review-12',
    entityId: 'entity-10',
    userId: 'user-6',
    userDisplayName: 'Lisa Davis',
    rating: 5,
    title: 'Another Brilliant Album',
    content: 'Taylor Swift continues to evolve and surprise with Midnights. The songwriting is exceptional and the production is polished. Each track tells a story and the album flows beautifully.',
    pros: ['Exceptional songwriting', 'Cohesive album flow', 'Strong production', 'Emotional depth'],
    cons: ['Some tracks feel similar', 'Could use more variety in tempo'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 76,
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15')
  },

  // Harry Styles album reviews
  {
    id: 'review-13',
    entityId: 'entity-11',
    userId: 'user-1',
    userDisplayName: 'John Doe',
    rating: 4,
    title: 'Solid Pop Album',
    content: 'Harry House is a solid pop album with some great tracks. The production is slick and Harry vocals are strong. While not every track is a hit, the overall experience is enjoyable.',
    pros: ['Strong vocals', 'Polished production', 'Some standout tracks'],
    cons: ['Inconsistent track quality', 'Safe musical choices'],
    wouldRecommend: true,
    verified: false,
    helpfulCount: 52,
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2023-06-20')
  },

  // Beyoncé album reviews
  {
    id: 'review-14',
    entityId: 'entity-12',
    userId: 'user-4',
    userDisplayName: 'Sarah Wilson',
    rating: 5,
    title: 'Masterpiece of Dance and Culture',
    content: 'Renaissance is a masterpiece that celebrates dance music and Black queer culture. Beyoncé has created something truly special that honors the past while pushing boundaries. Every track is meticulously crafted.',
    pros: ['Cultural significance', 'Impeccable production', 'Dance floor ready', 'Artistic vision'],
    cons: ['May not appeal to all audiences', 'Complex for casual listeners'],
    wouldRecommend: true,
    verified: true,
    helpfulCount: 93,
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2023-04-12')
  }
];

export const getReviewsByEntity = (entityId: string): Review[] => {
  return mockReviews.filter(review => review.entityId === entityId);
};

export const getReviewsByUser = (userId: string): Review[] => {
  return mockReviews.filter(review => review.userId === userId);
};

export const getReviewById = (id: string): Review | undefined => {
  return mockReviews.find(review => review.id === id);
};

export const getRecentReviews = (limit: number = 10): Review[] => {
  return [...mockReviews]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

export const incrementHelpfulCount = (reviewId: string): void => {
  const review = mockReviews.find(r => r.id === reviewId);
  if (review) {
    review.helpfulCount += 1;
  }
};