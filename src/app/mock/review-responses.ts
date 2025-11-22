import { ReviewResponse } from '../types/models';

export const mockReviewResponses: ReviewResponse[] = [
  // Nike responding to reviews
  {
    id: 'response-1',
    reviewId: 'review-1',
    ownerId: 'user-2',
    ownerDisplayName: 'Jane Smith',
    body: 'Thank you so much for your wonderful review, John! We are thrilled to hear that you love our products and have been a loyal customer. Your feedback about our innovation means a lot to us. We will continue to strive for excellence in both design and performance.',
    status: 'published',
    createdAt: new Date('2023-06-16'),
    updatedAt: new Date('2023-06-16')
  },
  {
    id: 'response-2',
    reviewId: 'review-2',
    ownerId: 'user-2',
    ownerDisplayName: 'Jane Smith',
    body: 'Hi Sarah, thank you for taking the time to share your feedback. We appreciate your honest assessment of our products. We are constantly working to improve our customer service experience and your comments have been shared with our team. We hope to exceed your expectations in the future.',
    status: 'published',
    createdAt: new Date('2023-07-21'),
    updatedAt: new Date('2023-07-21')
  },

  // Apple responding to reviews
  {
    id: 'response-3',
    reviewId: 'review-3',
    ownerId: 'user-5',
    ownerDisplayName: 'David Brown',
    body: 'Sarah, we are incredibly grateful for your kind words! It is wonderful to hear that you appreciate the seamless ecosystem and build quality of our products. Your satisfaction is our top priority, and we are committed to continuing to deliver innovative technology that enhances your daily life.',
    status: 'published',
    createdAt: new Date('2023-05-11'),
    updatedAt: new Date('2023-05-11')
  },
  {
    id: 'response-4',
    reviewId: 'review-4',
    ownerId: 'user-5',
    ownerDisplayName: 'David Brown',
    body: 'Lisa, thank you for sharing your perspective. We understand that our products represent a significant investment, and we respect that they may not be the right fit for everyone. We focus on delivering premium quality and integrated experiences that we believe justify the value proposition.',
    status: 'published',
    createdAt: new Date('2023-08-06'),
    updatedAt: new Date('2023-08-06')
  },

  // Sony responding to headphone review
  {
    id: 'response-5',
    reviewId: 'review-7',
    ownerId: 'user-5',
    ownerDisplayName: 'David Brown',
    body: 'Lisa, we are absolutely delighted to hear that you are enjoying your WH-1000XM5 headphones! Your praise for the noise canceling and sound quality means the world to us. We designed these headphones with comfort and performance in mind, and it is fantastic to know they are meeting your expectations.',
    status: 'published',
    createdAt: new Date('2023-07-16'),
    updatedAt: new Date('2023-07-16')
  },

  // Apple responding to MacBook review
  {
    id: 'response-6',
    reviewId: 'review-8',
    ownerId: 'user-5',
    ownerDisplayName: 'David Brown',
    body: 'Sarah, your glowing review of the MacBook Air with M2 has made our day! We are thrilled that you are experiencing the incredible performance and battery life that the M2 chip delivers. Your feedback reinforces our commitment to creating products that empower creativity and productivity.',
    status: 'published',
    createdAt: new Date('2023-06-02'),
    updatedAt: new Date('2023-06-02')
  }
];

export const getResponseByReviewId = (reviewId: string): ReviewResponse | undefined => {
  return mockReviewResponses.find(response => response.reviewId === reviewId);
};

export const getResponsesByOwner = (ownerId: string): ReviewResponse[] => {
  return mockReviewResponses.filter(response => response.ownerId === ownerId);
};

export const createReviewResponse = (
  reviewId: string,
  ownerId: string,
  ownerDisplayName: string,
  body: string
): ReviewResponse => {
  const newResponse: ReviewResponse = {
    id: `response-${Date.now()}`,
    reviewId,
    ownerId,
    ownerDisplayName,
    body,
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockReviewResponses.push(newResponse);
  return newResponse;
};
