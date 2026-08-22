import { User, City, Activity, Trip, TripStop, ItineraryItem, Expense, AdminAnalytics, BudgetSummary } from './types';

export const initialUsers: User[] = [
  {
    id: 'user-demo-01',
    name: 'Aarav Sharma',
    email: 'aarav@globetrotter.io',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    language: 'en',
    home_currency: 'USD',
    created_at: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'user-demo-02',
    name: 'Elena Rostova',
    email: 'elena@globetrotter.io',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    language: 'en',
    home_currency: 'EUR',
    created_at: '2026-02-10T11:20:00.000Z',
  },
  {
    id: 'user-demo-03',
    name: 'Kai Takahashi',
    email: 'kai@globetrotter.io',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    language: 'ja',
    home_currency: 'JPY',
    created_at: '2026-03-01T09:45:00.000Z',
  }
];

export const initialCities: City[] = [
  {
    id: 'city-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    cost_index: '$$$',
    popularity_score: 4.9,
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    description: 'The City of Light, famed for the Eiffel Tower, haute cuisine, world-class art at the Louvre, and romantic Seine strolls.',
    currency: 'EUR'
  },
  {
    id: 'city-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    cost_index: '$$',
    popularity_score: 4.9,
    image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    description: 'A hyper-modern metropolis where neon-lit skyscrapers harmoniously blend with centuries-old Shinto shrines and legendary cuisine.',
    currency: 'JPY'
  },
  {
    id: 'city-dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    cost_index: '$$$',
    popularity_score: 4.8,
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    description: 'Futuristic skyline, luxury shopping, desert dune safaris, and groundbreaking architectural wonders like the Burj Khalifa.',
    currency: 'AED'
  },
  {
    id: 'city-london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    cost_index: '$$$',
    popularity_score: 4.8,
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    description: 'Historic grandeur meets cosmopolitan vitality, from Big Ben and the Thames to West End theatres and royal parks.',
    currency: 'GBP'
  },
  {
    id: 'city-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    cost_index: '$',
    popularity_score: 4.9,
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    description: 'Tropical paradise celebrated for emerald rice terraces, sacred sea temples, lush waterfalls, and serene wellness retreats.',
    currency: 'IDR'
  },
  {
    id: 'city-new-york',
    name: 'New York City',
    country: 'United States',
    region: 'North America',
    cost_index: '$$$',
    popularity_score: 4.8,
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    description: 'The bustling Big Apple featuring Central Park, Broadway shows, Times Square, and iconic skyline architecture from Manhattan to Brooklyn.',
    currency: 'USD'
  },
  {
    id: 'city-rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    cost_index: '$$',
    popularity_score: 4.8,
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    description: 'The Eternal City with thousands of years of art and civilization, from the Colosseum and Pantheon to handmade pasta and espresso bars.',
    currency: 'EUR'
  },
  {
    id: 'city-swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    cost_index: '$$$',
    popularity_score: 4.9,
    image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    description: 'Breathtaking mountain peaks, pristine alpine lakes, scenic glacier trains, and picturesque chalet villages in the heart of Europe.',
    currency: 'CHF'
  }
];

export const initialActivities: Activity[] = [
  // Paris
  {
    id: 'act-paris-1',
    city_id: 'city-paris',
    city_name: 'Paris',
    title: 'Eiffel Tower Sunset Summit',
    description: 'Skip-the-line elevator access to the summit for panoramic golden hour views over Paris.',
    category: 'Sightseeing',
    cost: 38.00,
    duration_hours: 2.5,
    image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-paris-2',
    city_id: 'city-paris',
    city_name: 'Paris',
    title: 'Louvre Museum Masterpieces Tour',
    description: 'Guided audio tour covering the Mona Lisa, Winged Victory of Samothrace, and Venus de Milo.',
    category: 'Culture',
    cost: 22.00,
    duration_hours: 3.5,
    image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  },
  {
    id: 'act-paris-3',
    city_id: 'city-paris',
    city_name: 'Paris',
    title: 'Le Marais Pastry & Macaron Walk',
    description: 'Taste artisanal croissants, salted caramel eclairs, and delicate macarons in historic alleys.',
    category: 'Food',
    cost: 65.00,
    duration_hours: 2.0,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-paris-4',
    city_id: 'city-paris',
    city_name: 'Paris',
    title: 'Seine Evening Dinner Cruise',
    description: 'Gourmet 3-course French dining aboard an illuminated glass canopy boat gliding past Notre-Dame.',
    category: 'Food',
    cost: 110.00,
    duration_hours: 2.5,
    image_url: 'https://images.unsplash.com/photo-1520939817895-060bdef4df1a?auto=format&fit=crop&w=800&q=80',
    rating: 4.7
  },

  // Tokyo
  {
    id: 'act-tokyo-1',
    city_id: 'city-tokyo',
    city_name: 'Tokyo',
    title: 'Shibuya Crossing & Sky Observatory',
    description: 'Marvel at the world famous scramble crossing and take photos from 230 meters up at Shibuya Sky.',
    category: 'Sightseeing',
    cost: 18.00,
    duration_hours: 2.0,
    image_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-tokyo-2',
    city_id: 'city-tokyo',
    city_name: 'Tokyo',
    title: 'Tsukiji Outer Market Sushi Safari',
    description: 'Savor fresh fatty tuna nigiri, tamagoyaki skewers, and wagyu beef skewers from legacy stalls.',
    category: 'Food',
    cost: 55.00,
    duration_hours: 2.5,
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-tokyo-3',
    city_id: 'city-tokyo',
    city_name: 'Tokyo',
    title: 'Mount Fuji & Lake Kawaguchiko Day Trip',
    description: 'Scenic bus excursion to Fuji 5th station, Chureito Pagoda, and ropeway panoramic vistas.',
    category: 'Adventure',
    cost: 95.00,
    duration_hours: 8.0,
    image_url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  },
  {
    id: 'act-tokyo-4',
    city_id: 'city-tokyo',
    city_name: 'Tokyo',
    title: 'Asakusa Senso-ji & Kimono Experience',
    description: 'Traditional kimono dressing followed by incense ceremonies at Tokyo’s oldest Buddhist sanctuary.',
    category: 'Culture',
    cost: 45.00,
    duration_hours: 3.0,
    image_url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  },

  // Dubai
  {
    id: 'act-dubai-1',
    city_id: 'city-dubai',
    city_name: 'Dubai',
    title: 'Burj Khalifa 148th Floor Sky Lounge',
    description: 'Step onto the world’s highest outdoor observation deck with luxury dates and Arabic coffee.',
    category: 'Sightseeing',
    cost: 90.00,
    duration_hours: 2.0,
    image_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  },
  {
    id: 'act-dubai-2',
    city_id: 'city-dubai',
    city_name: 'Dubai',
    title: 'Red Dunes Desert Safari & BBQ Camp',
    description: 'Thrilling 4x4 dune bashing, sandboarding, camel rides, and Tanoura fire dance dinner under stars.',
    category: 'Adventure',
    cost: 75.00,
    duration_hours: 6.0,
    image_url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-dubai-3',
    city_id: 'city-dubai',
    city_name: 'Dubai',
    title: 'Marina Luxury Yacht Sunset Cruise',
    description: 'Sail along the spectacular Dubai Marina, Ain Dubai, and Atlantis The Palm with refreshments.',
    category: 'Sightseeing',
    cost: 60.00,
    duration_hours: 2.0,
    image_url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    rating: 4.7
  },

  // London
  {
    id: 'act-london-1',
    city_id: 'city-london',
    city_name: 'London',
    title: 'Tower of London & Crown Jewels',
    description: 'Explore 1,000 years of royal heritage, see the Cullinan diamond, and meet the Yeoman Warders.',
    category: 'Culture',
    cost: 35.00,
    duration_hours: 3.0,
    image_url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  },
  {
    id: 'act-london-2',
    city_id: 'city-london',
    city_name: 'London',
    title: 'Borough Market Artisan Tasting',
    description: 'Sample English cheddar, hot salt beef bagels, fresh oysters, and warm Portuguese custard tarts.',
    category: 'Food',
    cost: 50.00,
    duration_hours: 2.0,
    image_url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-london-3',
    city_id: 'city-london',
    city_name: 'London',
    title: 'West End Musical Theatre Night',
    description: 'Premium orchestra seating for world-renowned theatrical productions in historic Covent Garden.',
    category: 'Culture',
    cost: 85.00,
    duration_hours: 3.0,
    image_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },

  // Bali
  {
    id: 'act-bali-1',
    city_id: 'city-bali',
    city_name: 'Bali',
    title: 'Ubud Tegallalang Rice Terrace Swing',
    description: 'Fly over lush cascading emerald valleys and snap breathtaking photos among jungle palms.',
    category: 'Adventure',
    cost: 25.00,
    duration_hours: 2.0,
    image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  },
  {
    id: 'act-bali-2',
    city_id: 'city-bali',
    city_name: 'Bali',
    title: 'Mount Batur Sunrise Volcano Trek',
    description: 'Early morning trek up an active volcanic caldera with volcanic steam boiled eggs at sunrise.',
    category: 'Adventure',
    cost: 45.00,
    duration_hours: 5.5,
    image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-bali-3',
    city_id: 'city-bali',
    city_name: 'Bali',
    title: 'Uluwatu Sunset Temple & Kecak Dance',
    description: 'Dramatic clifftop temple overlooking crashing Indian Ocean waves accompanied by fire dancers.',
    category: 'Culture',
    cost: 20.00,
    duration_hours: 2.5,
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },

  // New York
  {
    id: 'act-nyc-1',
    city_id: 'city-new-york',
    city_name: 'New York City',
    title: 'Summit One Vanderbilt Immersive Deck',
    description: 'Multi-sensory mirrored observation deck overlooking the Chrysler Building and Central Park.',
    category: 'Sightseeing',
    cost: 42.00,
    duration_hours: 2.0,
    image_url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-nyc-2',
    city_id: 'city-new-york',
    city_name: 'New York City',
    title: 'Brooklyn Bridge Sunset & DUMBO Pizza',
    description: 'Walk across the iconic stone arches and enjoy authentic coal-fired New York thin-crust pizza.',
    category: 'Food',
    cost: 30.00,
    duration_hours: 2.5,
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    rating: 4.8
  },
  {
    id: 'act-nyc-3',
    city_id: 'city-new-york',
    city_name: 'New York City',
    title: 'Central Park Electric Bike Exploration',
    description: 'Cover the Bethesda Fountain, Bow Bridge, Strawberry Fields, and hidden woodland trails.',
    category: 'Adventure',
    cost: 40.00,
    duration_hours: 2.0,
    image_url: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80',
    rating: 4.7
  },

  // Rome
  {
    id: 'act-rome-1',
    city_id: 'city-rome',
    city_name: 'Rome',
    title: 'Colosseum & Roman Forum Gladiator Arena',
    description: 'Walk the underground chambers and gladiatorial arena floor with archeological insights.',
    category: 'Culture',
    cost: 34.00,
    duration_hours: 3.0,
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-rome-2',
    city_id: 'city-rome',
    city_name: 'Rome',
    title: 'Trastevere Secret Food & Wine Safari',
    description: 'Sample crispy Roman suppli, creamy cacio e pepe, artisanal porchetta, and regional Chianti.',
    category: 'Food',
    cost: 68.00,
    duration_hours: 3.5,
    image_url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },

  // Swiss Alps
  {
    id: 'act-alps-1',
    city_id: 'city-swiss-alps',
    city_name: 'Swiss Alps',
    title: 'Jungfraujoch - Top of Europe Train',
    description: 'Ride the modern Eiger Express cableway and cogwheel train to the highest railway station in Europe.',
    category: 'Adventure',
    cost: 140.00,
    duration_hours: 6.0,
    image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  },
  {
    id: 'act-alps-2',
    city_id: 'city-swiss-alps',
    city_name: 'Swiss Alps',
    title: 'Zermatt Matterhorn Glacier Paradise',
    description: 'Ascend 3,883 meters to view 38 four-thousand-meter alpine peaks and walk inside glacier palaces.',
    category: 'Adventure',
    cost: 95.00,
    duration_hours: 4.5,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9
  }
];

export const initialTrips: Trip[] = [
  {
    id: 'trip-grand-europe',
    user_id: 'user-demo-01',
    name: 'Grand European Odyssey',
    description: 'A dream multi-city journey sweeping from romantic Parisian boulevards to the ancient monuments of Rome and snow-capped Swiss Alps.',
    start_date: '2026-09-10',
    end_date: '2026-09-24',
    total_budget: 4800.00,
    cover_image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    is_public: true,
    share_token: 'euro-odyssey-2026',
    created_at: '2026-08-01T10:00:00.000Z',
    stops: [
      {
        id: 'stop-euro-1',
        trip_id: 'trip-grand-europe',
        city_id: 'city-paris',
        city: initialCities.find(c => c.id === 'city-paris'),
        arrival_date: '2026-09-10',
        departure_date: '2026-09-15',
        stop_order: 1,
        items: [
          {
            id: 'item-101',
            trip_stop_id: 'stop-euro-1',
            activity_id: 'act-paris-1',
            activity: initialActivities.find(a => a.id === 'act-paris-1'),
            custom_title: 'Eiffel Tower Sunset Summit',
            day_number: 1,
            start_time: '18:00:00',
            duration_hours: 2.5,
            cost: 38.00,
            notes: 'Booked priority elevator tickets for summit access at golden hour.'
          },
          {
            id: 'item-102',
            trip_stop_id: 'stop-euro-1',
            activity_id: 'act-paris-3',
            activity: initialActivities.find(a => a.id === 'act-paris-3'),
            custom_title: 'Le Marais Pastry & Macaron Walk',
            day_number: 2,
            start_time: '10:00:00',
            duration_hours: 2.0,
            cost: 65.00,
            notes: 'Meet food guide outside Saint-Paul metro station.'
          },
          {
            id: 'item-103',
            trip_stop_id: 'stop-euro-1',
            activity_id: 'act-paris-2',
            activity: initialActivities.find(a => a.id === 'act-paris-2'),
            custom_title: 'Louvre Museum Masterpieces Tour',
            day_number: 3,
            start_time: '13:30:00',
            duration_hours: 3.5,
            cost: 22.00,
            notes: 'Bring headphones for mobile audio synchronization.'
          }
        ]
      },
      {
        id: 'stop-euro-2',
        trip_id: 'trip-grand-europe',
        city_id: 'city-swiss-alps',
        city: initialCities.find(c => c.id === 'city-swiss-alps'),
        arrival_date: '2026-09-15',
        departure_date: '2026-09-19',
        stop_order: 2,
        items: [
          {
            id: 'item-104',
            trip_stop_id: 'stop-euro-2',
            activity_id: 'act-alps-1',
            activity: initialActivities.find(a => a.id === 'act-alps-1'),
            custom_title: 'Jungfraujoch - Top of Europe Train',
            day_number: 1,
            start_time: '09:00:00',
            duration_hours: 6.0,
            cost: 140.00,
            notes: 'Depart Grindelwald Terminal on the Eiger Express 3S gondola.'
          }
        ]
      },
      {
        id: 'stop-euro-3',
        trip_id: 'trip-grand-europe',
        city_id: 'city-rome',
        city: initialCities.find(c => c.id === 'city-rome'),
        arrival_date: '2026-09-19',
        departure_date: '2026-09-24',
        stop_order: 3,
        items: [
          {
            id: 'item-105',
            trip_stop_id: 'stop-euro-3',
            activity_id: 'act-rome-1',
            activity: initialActivities.find(a => a.id === 'act-rome-1'),
            custom_title: 'Colosseum & Roman Forum Gladiator Arena',
            day_number: 1,
            start_time: '09:30:00',
            duration_hours: 3.0,
            cost: 34.00,
            notes: 'Enter via the dedicated Gladiator Gate onto the arena floor.'
          },
          {
            id: 'item-106',
            trip_stop_id: 'stop-euro-3',
            activity_id: 'act-rome-2',
            activity: initialActivities.find(a => a.id === 'act-rome-2'),
            custom_title: 'Trastevere Secret Food & Wine Safari',
            day_number: 2,
            start_time: '18:30:00',
            duration_hours: 3.5,
            cost: 68.00,
            notes: 'Evening wine tasting and handmade pasta course.'
          }
        ]
      }
    ],
    expenses: [
      { id: 'exp-01', trip_id: 'trip-grand-europe', category: 'Transport', amount: 620.00, expense_date: '2026-08-15', description: 'Flight tickets: NYC to Paris Charles de Gaulle' },
      { id: 'exp-02', trip_id: 'trip-grand-europe', category: 'Stay', amount: 750.00, expense_date: '2026-08-20', description: 'Hotel Saint-Germain 4 nights booking (Paris)' },
      { id: 'exp-03', trip_id: 'trip-grand-europe', category: 'Transport', amount: 180.00, expense_date: '2026-08-25', description: 'TGV Lyria High-Speed Train: Paris to Interlaken' },
      { id: 'exp-04', trip_id: 'trip-grand-europe', category: 'Stay', amount: 680.00, expense_date: '2026-08-25', description: 'Alpine Swiss Chalet in Grindelwald 4 nights' },
      { id: 'exp-05', trip_id: 'trip-grand-europe', category: 'Activities', amount: 367.00, expense_date: '2026-09-10', description: 'Advance booking for Eiffel Tower, Louvre, & Top of Europe' },
      { id: 'exp-06', trip_id: 'trip-grand-europe', category: 'Meals', amount: 240.00, expense_date: '2026-09-12', description: 'Fine dining dinner on Seine River and Parisian bistros' },
      { id: 'exp-07', trip_id: 'trip-grand-europe', category: 'Stay', amount: 520.00, expense_date: '2026-08-28', description: 'Boutique Hotel in Trastevere Rome (5 nights)' },
      { id: 'exp-08', trip_id: 'trip-grand-europe', category: 'Other', amount: 115.00, expense_date: '2026-09-11', description: 'International eSIM, metro passes, and museum storage lockers' }
    ]
  },
  {
    id: 'trip-tokyo-bali',
    user_id: 'user-demo-01',
    name: 'Tokyo Lights & Bali Serenity',
    description: 'Contrasting the electrifying neon futurism of Tokyo with tranquil tropical wellness, waterfalls, and rice terraces in Bali.',
    start_date: '2026-11-05',
    end_date: '2026-11-18',
    total_budget: 3500.00,
    cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    is_public: true,
    share_token: 'tokyo-bali-blend',
    created_at: '2026-08-10T14:30:00.000Z',
    stops: [
      {
        id: 'stop-tb-1',
        trip_id: 'trip-tokyo-bali',
        city_id: 'city-tokyo',
        city: initialCities.find(c => c.id === 'city-tokyo'),
        arrival_date: '2026-11-05',
        departure_date: '2026-11-11',
        stop_order: 1,
        items: [
          {
            id: 'item-201',
            trip_stop_id: 'stop-tb-1',
            activity_id: 'act-tokyo-1',
            activity: initialActivities.find(a => a.id === 'act-tokyo-1'),
            custom_title: 'Shibuya Crossing & Sky Observatory',
            day_number: 1,
            start_time: '17:30:00',
            duration_hours: 2.0,
            cost: 18.00,
            notes: 'Catch twilight transformation over Tokyo skyline.'
          },
          {
            id: 'item-202',
            trip_stop_id: 'stop-tb-1',
            activity_id: 'act-tokyo-3',
            activity: initialActivities.find(a => a.id === 'act-tokyo-3'),
            custom_title: 'Mount Fuji & Lake Kawaguchiko Day Trip',
            day_number: 3,
            start_time: '08:00:00',
            duration_hours: 8.0,
            cost: 95.00,
            notes: 'Meeting spot: Shinjuku West Exit.'
          }
        ]
      },
      {
        id: 'stop-tb-2',
        trip_id: 'trip-tokyo-bali',
        city_id: 'city-bali',
        city: initialCities.find(c => c.id === 'city-bali'),
        arrival_date: '2026-11-11',
        departure_date: '2026-11-18',
        stop_order: 2,
        items: [
          {
            id: 'item-203',
            trip_stop_id: 'stop-tb-2',
            activity_id: 'act-bali-2',
            activity: initialActivities.find(a => a.id === 'act-bali-2'),
            custom_title: 'Mount Batur Sunrise Volcano Trek',
            day_number: 2,
            start_time: '03:00:00',
            duration_hours: 5.5,
            cost: 45.00,
            notes: 'Hotel pickup 2:30 AM, bring warm layers.'
          },
          {
            id: 'item-204',
            trip_stop_id: 'stop-tb-2',
            activity_id: 'act-bali-1',
            activity: initialActivities.find(a => a.id === 'act-bali-1'),
            custom_title: 'Ubud Tegallalang Rice Terrace Swing',
            day_number: 4,
            start_time: '10:00:00',
            duration_hours: 2.0,
            cost: 25.00,
            notes: 'Rent red flowing dress for iconic jungle swing photo.'
          }
        ]
      }
    ],
    expenses: [
      { id: 'exp-tb-1', trip_id: 'trip-tokyo-bali', category: 'Transport', amount: 840.00, expense_date: '2026-08-12', description: 'Multi-city flights: Haneda & Denpasar' },
      { id: 'exp-tb-2', trip_id: 'trip-tokyo-bali', category: 'Stay', amount: 620.00, expense_date: '2026-08-14', description: 'Shinjuku Prince Hotel (6 nights)' },
      { id: 'exp-tb-3', trip_id: 'trip-tokyo-bali', category: 'Stay', amount: 480.00, expense_date: '2026-08-14', description: 'Ubud Private Pool Jungle Villa (7 nights)' },
      { id: 'exp-tb-4', trip_id: 'trip-tokyo-bali', category: 'Activities', amount: 183.00, expense_date: '2026-08-15', description: 'Fuji Excursion & Batur Sunrise Tour' }
    ]
  },
  {
    id: 'trip-dubai-london',
    user_id: 'user-demo-01',
    name: 'Dubai Oasis & Royal London',
    description: 'Modern architectural wonders and desert safaris in UAE followed by historic royalty, tea, and theater in London.',
    start_date: '2026-12-20',
    end_date: '2027-01-02',
    total_budget: 4200.00,
    cover_image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    is_public: false,
    share_token: 'dubai-london-getaway',
    created_at: '2026-08-15T18:15:00.000Z',
    stops: [
      {
        id: 'stop-dl-1',
        trip_id: 'trip-dubai-london',
        city_id: 'city-dubai',
        city: initialCities.find(c => c.id === 'city-dubai'),
        arrival_date: '2026-12-20',
        departure_date: '2026-12-26',
        stop_order: 1,
        items: []
      },
      {
        id: 'stop-dl-2',
        trip_id: 'trip-dubai-london',
        city_id: 'city-london',
        city: initialCities.find(c => c.id === 'city-london'),
        arrival_date: '2026-12-26',
        departure_date: '2027-01-02',
        stop_order: 2,
        items: []
      }
    ],
    expenses: [
      { id: 'exp-dl-1', trip_id: 'trip-dubai-london', category: 'Transport', amount: 950.00, expense_date: '2026-08-18', description: 'Emirates & BA flight bookings' },
      { id: 'exp-dl-2', trip_id: 'trip-dubai-london', category: 'Stay', amount: 820.00, expense_date: '2026-08-19', description: 'Dubai Downtown Hotel 6 nights' }
    ]
  }
];

// Global in-memory mutable state singleton
class Store {
  users: User[] = [...initialUsers];
  cities: City[] = [...initialCities];
  activities: Activity[] = [...initialActivities];
  trips: Trip[] = JSON.parse(JSON.stringify(initialTrips));

  getTripBudgetSummary(tripId: string): BudgetSummary | null {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) return null;

    const expenses = trip.expenses || [];
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalBudget = Number(trip.total_budget);
    const remaining = totalBudget - totalSpent;
    const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Calculate duration in days
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const dailyAverage = totalSpent / days;

    const categories: ('Transport' | 'Stay' | 'Activities' | 'Meals' | 'Other')[] = [
      'Transport', 'Stay', 'Activities', 'Meals', 'Other'
    ];

    const byCategory = categories.map(cat => {
      const catExpenses = expenses.filter(e => e.category === cat);
      const amount = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      return {
        category: cat,
        amount,
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0
      };
    });

    return {
      trip_id: trip.id,
      total_budget: totalBudget,
      total_spent: totalSpent,
      remaining_budget: remaining,
      percent_spent: percentSpent,
      daily_average_spent: dailyAverage,
      is_over_budget: remaining < 0,
      by_category: byCategory,
      expenses: expenses
    };
  }

  getAdminAnalytics(): AdminAnalytics {
    const totalUsers = this.users.length + 1420; // scaled for rich presentation
    const totalTrips = this.trips.length + 3890;
    const totalExpenses = this.trips.reduce((acc, t) => acc + (t.expenses?.length || 0), 0) + 12450;
    const activeItineraries = this.trips.length + 1840;

    const catSums: Record<string, number> = {
      Transport: 145200,
      Stay: 210400,
      Activities: 89500,
      Meals: 92300,
      Other: 34100
    };

    // Add current trip expenses to category stats
    this.trips.forEach(t => {
      t.expenses?.forEach(e => {
        catSums[e.category] = (catSums[e.category] || 0) + Number(e.amount);
      });
    });

    return {
      metrics: {
        total_users: totalUsers,
        total_trips: totalTrips,
        total_expenses_logged: totalExpenses,
        active_itineraries: activeItineraries,
        avg_trip_budget: 4250,
        avg_stops_per_trip: 3.2
      },
      trips_over_time: [
        { month: 'Mar', trips_created: 280, active_travelers: 420 },
        { month: 'Apr', trips_created: 390, active_travelers: 610 },
        { month: 'May', trips_created: 580, active_travelers: 890 },
        { month: 'Jun', trips_created: 840, active_travelers: 1320 },
        { month: 'Jul', trips_created: 1120, active_travelers: 1780 },
        { month: 'Aug', trips_created: 980, active_travelers: 1540 }
      ],
      top_destinations: [
        { city_name: 'Paris', country: 'France', visit_count: 842, popularity_score: 4.9 },
        { city_name: 'Tokyo', country: 'Japan', visit_count: 795, popularity_score: 4.9 },
        { city_name: 'Bali', country: 'Indonesia', visit_count: 680, popularity_score: 4.9 },
        { city_name: 'Swiss Alps', country: 'Switzerland', visit_count: 612, popularity_score: 4.9 },
        { city_name: 'Rome', country: 'Italy', visit_count: 584, popularity_score: 4.8 },
        { city_name: 'London', country: 'United Kingdom', visit_count: 530, popularity_score: 4.8 },
        { city_name: 'Dubai', country: 'UAE', visit_count: 490, popularity_score: 4.8 },
        { city_name: 'New York City', country: 'USA', visit_count: 460, popularity_score: 4.8 }
      ],
      spending_by_category: [
        { category: 'Stay', total_amount: catSums.Stay },
        { category: 'Transport', total_amount: catSums.Transport },
        { category: 'Meals', total_amount: catSums.Meals },
        { category: 'Activities', total_amount: catSums.Activities },
        { category: 'Other', total_amount: catSums.Other }
      ],
      user_demographics: [
        { country: 'United States', users_count: 540 },
        { country: 'United Kingdom', users_count: 320 },
        { country: 'Germany', users_count: 240 },
        { country: 'India', users_count: 190 },
        { country: 'Australia', users_count: 130 }
      ]
    };
  }
}

// Global singleton instance across API routes in Next.js dev server
const globalStore = (globalThis as any).__GLOBETROTTER_STORE__ || new Store();
if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).__GLOBETROTTER_STORE__ = globalStore;
}

export const mockStore: Store = globalStore;
