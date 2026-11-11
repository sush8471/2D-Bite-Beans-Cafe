export interface GoogleReview {
  id: string;
  author: string;
  avatarColor: string;
  initials: string;
  rating: number;
  relativeTime: string;
  text: string;
  tags: string[];
  category: 'all' | 'ambience' | 'food' | 'drinks';
  highlightDish?: string;
}

export interface ReviewSummaryData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    stars: number;
    percentage: number;
  }[];
  geminiSummary: string;
  googleMapsUrl: string;
  writeReviewUrl: string;
}

export const reviewSummary: ReviewSummaryData = {
  averageRating: 4.1,
  totalReviews: 615,
  ratingDistribution: [
    { stars: 5, percentage: 68 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 5 },
  ],
  geminiSummary:
    'People say this cafe offers delicious Korean and Japanese dishes like ramen, kimbap, and crispy chicken, along with a variety of drinks. They also highlight the unique, aesthetic 2D-themed interior and the friendly, attentive staff. Some reviews mention the service can be slow.',
  googleMapsUrl: 'https://maps.app.goo.gl/6ZeD6HPCTt3tRXLX8',
  writeReviewUrl: 'https://maps.app.goo.gl/6ZeD6HPCTt3tRXLX8',
};

export const essentialReviews: GoogleReview[] = [
  {
    id: '1',
    author: 'Shirley Sangma',
    avatarColor: '#E11D48',
    initials: 'SS',
    rating: 5,
    relativeTime: 'Google review',
    text: 'Had a wonderful experience at Bite & Beans 2D Cafe House! The ambience is so cozy, dreamy, and perfect for taking pictures. We really enjoyed the food and drinks—everything was fresh and delicious. The chicken wings were definitely our favorite, and the ramen was also very tasty. The service was friendly and attentive, which made our visit even better. Highly recommended! ❤️✨',
    tags: ['2D Dreamy Ambience', 'Chicken Wings', 'Chicken Ramen'],
    category: 'ambience',
    highlightDish: 'Crispy Wings & Ramen',
  },
  {
    id: '2',
    author: 'Newton',
    avatarColor: '#2563EB',
    initials: 'N',
    rating: 5,
    relativeTime: 'Google review',
    text: 'I finally visited this cafe after a long time, and it was totally worth it! I ordered Bibimbap and Ramen oh my god, both were so, so, so good! I also had a Peach Tea, and it honestly made me so happy because it’s really hard to find a good one. Most places don’t get the peach flavor right for me, but the moment I took a sip here, its exactly the taste I love!',
    tags: ['Bibimbap', 'Ramen', 'Peach Tea'],
    category: 'food',
    highlightDish: 'Bibimbap & Peach Tea',
  },
  {
    id: '3',
    author: 'Kankana Roy',
    avatarColor: '#059669',
    initials: 'KR',
    rating: 5,
    relativeTime: 'Google review',
    text: 'This café offers a warm and welcoming atmosphere with a beautifully designed interior. The elegant décor, cozy seating, soft lighting, and thoughtfully chosen details create the perfect place to relax. Every corner is stylish and inviting, making it a great spot to enjoy good coffee, delicious food, and quality time with friends or family.',
    tags: ['Cozy Seating', 'Warm Lighting', 'Quality Time'],
    category: 'ambience',
    highlightDish: 'Specialty Coffee',
  },
  {
    id: '4',
    author: 'Supratik Bora',
    avatarColor: '#D97706',
    initials: 'SB',
    rating: 5,
    relativeTime: 'Google review',
    text: 'The moment you enter through the door, it\'s like stepping into a different world. Seriously, the aesthetic of this place is on another level. The 2D style is extremely fascinating. The chicken wings were definitely crispy on the outside and juicy on the inside, really flavorful. The ramen was really tasty with the sunny side egg on top.',
    tags: ['2D Comic Vibe', 'Tempura Wings', 'Juicy & Crispy'],
    category: 'ambience',
    highlightDish: 'Crispy Tempura Wings',
  },
  {
    id: '5',
    author: 'Nitin Das',
    avatarColor: '#7C3AED',
    initials: 'ND',
    rating: 5,
    relativeTime: 'Google review',
    text: 'Aesthetic 2D themed cafe—great spot for hangout with friends or date with your partner. They provide good delights definitely recommended, service is good too, overall really a fine place to chill/hangout/date, and totally instagrammable spot for pictures 👍💯',
    tags: ['Instagrammable Spot', 'Date & Chill', '2D Theme'],
    category: 'ambience',
    highlightDish: '2D Cafe Experience',
  },
  {
    id: '6',
    author: 'Aparna Barman',
    avatarColor: '#DB2777',
    initials: 'AB',
    rating: 5,
    relativeTime: 'Google review',
    text: 'The ambience is peaceful and nicely maintained. Perfect for lunch or dinner with friends, family, or colleagues. We ordered strawberry matcha latte, ramen, and pink mandu. Tbh this was my first time that I tried matcha and it was fabulous 😍',
    tags: ['Strawberry Matcha', 'Pink Mandu', 'Peaceful Vibe'],
    category: 'drinks',
    highlightDish: 'Strawberry Matcha Latte',
  },
  {
    id: '7',
    author: 'Toisha Ahmed',
    avatarColor: '#0D9488',
    initials: 'TA',
    rating: 5,
    relativeTime: 'Google review',
    text: 'Bites and Bean Café is an absolute delight! The atmosphere is warm and inviting, making it a perfect spot to relax. The service was well-organized, friendly, and genuinely impressive. And the food? Truly amazing — great quality and delicious in every bite. This café is definitely a must-visit place!',
    tags: ['Friendly Service', 'Delicious Food', 'Must Visit'],
    category: 'food',
    highlightDish: 'Signature Dishes',
  },
  {
    id: '8',
    author: 'Dimpi Das',
    avatarColor: '#EA580C',
    initials: 'DD',
    rating: 5,
    relativeTime: 'Google review',
    text: 'Quaint little place tucked at the end of the road, bustling with people—and the food explains the rush! Authentic South East Asian food. Chicken Katsu tasted great, finished off with Bibimbap and Mini Bento. The Matcha Latte and By da Bae drinks were stunning.',
    tags: ['South East Asian', 'Chicken Katsu', 'By The Bay Drink'],
    category: 'food',
    highlightDish: 'Chicken Katsu & Bento',
  },
  {
    id: '9',
    author: 'Ashma Begum',
    avatarColor: '#4338CA',
    initials: 'AB',
    rating: 5,
    relativeTime: 'Google review',
    text: 'One of my favourite ramen cafes ever. Whenever I want to eat ramen I simply choose this cafe. Best ramen in Guwahati!',
    tags: ['Favorite Ramen', 'Authentic Broth', 'Comfort Food'],
    category: 'food',
    highlightDish: 'Authentic Ramen',
  },
];

