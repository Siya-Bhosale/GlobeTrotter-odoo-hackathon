-- ============================================================================
-- GlobeTrotter - Initial Seed Data Script (MySQL 8.0+)
-- Seed script for Top Destinations, Curated Activities, Users, Trips & Expenses
-- ============================================================================

USE `globetrotter`;

-- 1. SEED USERS
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `avatar_url`, `language`, `home_currency`, `created_at`)
VALUES
('user-demo-01', 'Aarav Sharma', 'aarav@globetrotter.io', '$2a$12$e7k.J9YfJ07pE9m/0Wd.IuP1E5n/K7YhT1rG2q0q9eYv2Zk0p.i7e', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'en', 'USD', NOW()),
('user-demo-02', 'Elena Rostova', 'elena@globetrotter.io', '$2a$12$e7k.J9YfJ07pE9m/0Wd.IuP1E5n/K7YhT1rG2q0q9eYv2Zk0p.i7e', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 'en', 'EUR', NOW()),
('user-demo-03', 'Kai Takahashi', 'kai@globetrotter.io', '$2a$12$e7k.J9YfJ07pE9m/0Wd.IuP1E5n/K7YhT1rG2q0q9eYv2Zk0p.i7e', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', 'ja', 'JPY', NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. SEED CITIES (8 Global Destinations)
INSERT INTO `cities` (`id`, `name`, `country`, `region`, `cost_index`, `popularity_score`, `image_url`, `description`, `currency`)
VALUES
('city-paris', 'Paris', 'France', 'Europe', '$$$', 4.9, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', 'The City of Light, famed for the Eiffel Tower, haute cuisine, world-class art at the Louvre, and romantic Seine strolls.', 'EUR'),
('city-tokyo', 'Tokyo', 'Japan', 'Asia', '$$', 4.9, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', 'A hyper-modern metropolis where neon-lit skyscrapers harmoniously blend with centuries-old Shinto shrines.', 'JPY'),
('city-dubai', 'Dubai', 'United Arab Emirates', 'Middle East', '$$$', 4.8, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', 'Futuristic skyline, luxury shopping, desert dune safaris, and groundbreaking architectural wonders like the Burj Khalifa.', 'AED'),
('city-london', 'London', 'United Kingdom', 'Europe', '$$$', 4.8, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', 'Historic grandeur meets cosmopolitan vitality, from Big Ben and the Thames to West End theatres and royal parks.', 'GBP'),
('city-bali', 'Bali', 'Indonesia', 'Southeast Asia', '$', 4.9, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', 'Tropical paradise celebrated for emerald rice terraces, sacred sea temples, lush waterfalls, and serene wellness retreats.', 'IDR'),
('city-new-york', 'New York City', 'United States', 'North America', '$$$', 4.8, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', 'The bustling Big Apple featuring Central Park, Broadway shows, Times Square, and iconic architecture from Manhattan to Brooklyn.', 'USD'),
('city-rome', 'Rome', 'Italy', 'Europe', '$$', 4.8, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', 'The Eternal City with thousands of years of art and civilization, from the Colosseum and Pantheon to handmade pasta and gelato.', 'EUR'),
('city-swiss-alps', 'Swiss Alps', 'Switzerland', 'Europe', '$$$', 4.9, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80', 'Breathtaking mountain peaks, pristine alpine lakes, scenic glacier trains, and picturesque chalet villages in the heart of Europe.', 'CHF')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. SEED ACTIVITIES CATALOG
INSERT INTO `activities_catalog` (`id`, `city_id`, `title`, `description`, `category`, `cost`, `duration_hours`, `image_url`, `rating`)
VALUES
-- Paris
('act-paris-1', 'city-paris', 'Eiffel Tower Sunset Summit', 'Skip-the-line elevator access to the summit for panoramic golden hour views over Paris.', 'Sightseeing', 38.00, 2.5, 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80', 4.9),
('act-paris-2', 'city-paris', 'Louvre Museum Masterpieces Tour', 'Guided audio tour covering the Mona Lisa, Winged Victory of Samothrace, and Venus de Milo.', 'Culture', 22.00, 3.5, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', 4.8),
('act-paris-3', 'city-paris', 'Le Marais Pastry & Macaron Walk', 'Taste artisanal croissants, salted caramel eclairs, and delicate macarons in historic alleys.', 'Food', 65.00, 2.0, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 4.9),
('act-paris-4', 'city-paris', 'Seine Evening Dinner Cruise', 'Gourmet 3-course French dining aboard an illuminated glass canopy boat gliding past Notre-Dame.', 'Food', 110.00, 2.5, 'https://images.unsplash.com/photo-1520939817895-060bdef4df1a?auto=format&fit=crop&w=800&q=80', 4.7),

-- Tokyo
('act-tokyo-1', 'city-tokyo', 'Shibuya Crossing & Sky Observatory', 'Marvel at the world famous scramble crossing and take photos from 230 meters up at Shibuya Sky.', 'Sightseeing', 18.00, 2.0, 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80', 4.9),
('act-tokyo-2', 'city-tokyo', 'Tsukiji Outer Market Sushi Safari', 'Savor fresh fatty tuna nigiri, tamagoyaki skewers, and wagyu beef skewers from legacy stalls.', 'Food', 55.00, 2.5, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80', 4.9),
('act-tokyo-3', 'city-tokyo', 'Mount Fuji & Lake Kawaguchiko Day Trip', 'Scenic bus excursion to Fuji 5th station, Chureito Pagoda, and ropeway panoramic vistas.', 'Adventure', 95.00, 8.0, 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80', 4.8),
('act-tokyo-4', 'city-tokyo', 'Asakusa Senso-ji & Kimono Experience', 'Traditional kimono dressing followed by incense ceremonies at Tokyo’s oldest Buddhist sanctuary.', 'Culture', 45.00, 3.0, 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80', 4.8),

-- Dubai
('act-dubai-1', 'city-dubai', 'Burj Khalifa 148th Floor Sky Lounge', 'Step onto the world’s highest outdoor observation deck with luxury dates and Arabic coffee.', 'Sightseeing', 90.00, 2.0, 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80', 4.8),
('act-dubai-2', 'city-dubai', 'Red Dunes Desert Safari & BBQ Camp', 'Thrilling 4x4 dune bashing, sandboarding, camel rides, and Tanoura fire dance dinner under stars.', 'Adventure', 75.00, 6.0, 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80', 4.9),
('act-dubai-3', 'city-dubai', 'Marina Luxury Yacht Sunset Cruise', 'Sail along the spectacular Dubai Marina, Ain Dubai, and Atlantis The Palm with refreshments.', 'Sightseeing', 60.00, 2.0, 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80', 4.7),

-- London
('act-london-1', 'city-london', 'Tower of London & Crown Jewels', 'Explore 1,000 years of royal heritage, see the Cullinan diamond, and meet the Yeoman Warders.', 'Culture', 35.00, 3.0, 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=800&q=80', 4.8),
('act-london-2', 'city-london', 'Borough Market Artisan Tasting', 'Sample English cheddar, hot salt beef bagels, fresh oysters, and warm Portuguese custard tarts.', 'Food', 50.00, 2.0, 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80', 4.9),
('act-london-3', 'city-london', 'West End Musical Theatre Night', 'Premium orchestra seating for world-renowned theatrical productions in historic Covent Garden.', 'Culture', 85.00, 3.0, 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80', 4.9),

-- Bali
('act-bali-1', 'city-bali', 'Ubud Tegallalang Rice Terrace Swing', 'Fly over lush cascading emerald valleys and snap breathtaking photos among jungle palms.', 'Adventure', 25.00, 2.0, 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80', 4.8),
('act-bali-2', 'city-bali', 'Mount Batur Sunrise Volcano Trek', 'Early morning trek up an active volcanic caldera with volcanic steam boiled eggs at sunrise.', 'Adventure', 45.00, 5.5, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', 4.9),
('act-bali-3', 'city-bali', 'Uluwatu Sunset Temple & Kecak Dance', 'Dramatic clifftop temple overlooking crashing Indian Ocean waves accompanied by fire dancers.', 'Culture', 20.00, 2.5, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', 4.9),

-- New York
('act-nyc-1', 'city-new-york', 'Summit One Vanderbilt Immersive Deck', 'Multi-sensory mirrored observation deck overlooking the Chrysler Building and Central Park.', 'Sightseeing', 42.00, 2.0, 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80', 4.9),
('act-nyc-2', 'city-new-york', 'Brooklyn Bridge Sunset & DUMBO Pizza', 'Walk across the iconic stone arches and enjoy authentic coal-fired New York thin-crust pizza.', 'Food', 30.00, 2.5, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', 4.8),
('act-nyc-3', 'city-new-york', 'Central Park Electric Bike Exploration', 'Cover the Bethesda Fountain, Bow Bridge, Strawberry Fields, and hidden woodland trails.', 'Adventure', 40.00, 2.0, 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=80', 4.7),

-- Rome
('act-rome-1', 'city-rome', 'Colosseum & Roman Forum Gladiator Arena', 'Walk the underground chambers and gladiatorial arena floor with archeological insights.', 'Culture', 34.00, 3.0, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', 4.9),
('act-rome-2', 'city-rome', 'Trastevere Secret Food & Wine Safari', 'Sample crispy Roman suppli, creamy cacio e pepe, artisanal porchetta, and regional Chianti.', 'Food', 68.00, 3.5, 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80', 4.9),

-- Swiss Alps
('act-alps-1', 'city-alps', 'Jungfraujoch - Top of Europe Train', 'Ride the modern Eiger Express cableway and cogwheel train to the highest railway station in Europe.', 'Adventure', 140.00, 6.0, 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80', 4.9),
('act-alps-2', 'city-alps', 'Zermatt Matterhorn Glacier Paradise', 'Ascend 3,883 meters to view 38 four-thousand-meter alpine peaks and walk inside glacier palaces.', 'Adventure', 95.00, 4.5, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 4.9)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 4. SEED SAMPLE TRIPS
INSERT INTO `trips` (`id`, `user_id`, `name`, `description`, `start_date`, `end_date`, `total_budget`, `cover_image_url`, `is_public`, `share_token`, `created_at`)
VALUES
('trip-grand-europe', 'user-demo-01', 'Grand European Odyssey', 'A dream multi-city journey sweeping from romantic Parisian boulevards to the ancient monuments of Rome and snow-capped Swiss Alps.', '2026-09-10', '2026-09-24', 4800.00, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', TRUE, 'euro-odyssey-2026', NOW()),
('trip-tokyo-bali', 'user-demo-01', 'Tokyo Lights & Bali Serenity', 'Contrasting the electrifying neon futurism of Tokyo with tranquil tropical wellness, waterfalls, and rice terraces in Bali.', '2026-11-05', '2026-11-18', 3500.00, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', TRUE, 'tokyo-bali-blend', NOW()),
('trip-dubai-london', 'user-demo-01', 'Dubai Oasis & Royal London', 'Modern architectural wonders and desert safaris in UAE followed by historic royalty, tea, and theater in London.', '2026-12-20', '2027-01-02', 4200.00, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', FALSE, 'dubai-london-getaway', NOW())
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 5. SEED TRIP STOPS FOR GRAND EUROPEAN ODYSSEY
INSERT INTO `trip_stops` (`id`, `trip_id`, `city_id`, `arrival_date`, `departure_date`, `stop_order`)
VALUES
('stop-euro-1', 'trip-grand-europe', 'city-paris', '2026-09-10', '2026-09-15', 1),
('stop-euro-2', 'trip-grand-europe', 'city-swiss-alps', '2026-09-15', '2026-09-19', 2),
('stop-euro-3', 'trip-grand-europe', 'city-rome', '2026-09-19', '2026-09-24', 3)
ON DUPLICATE KEY UPDATE `stop_order`=VALUES(`stop_order`);

-- 6. SEED ITINERARY ITEMS
INSERT INTO `itinerary_items` (`id`, `trip_stop_id`, `activity_id`, `custom_title`, `day_number`, `start_time`, `duration_hours`, `cost`, `notes`)
VALUES
('item-101', 'stop-euro-1', 'act-paris-1', 'Eiffel Tower Sunset Summit', 1, '18:00:00', 2.5, 38.00, 'Booked priority elevator tickets for summit access at golden hour.'),
('item-102', 'stop-euro-1', 'act-paris-3', 'Le Marais Pastry & Macaron Walk', 2, '10:00:00', 2.0, 65.00, 'Meet food guide outside Saint-Paul metro station.'),
('item-103', 'stop-euro-1', 'act-paris-2', 'Louvre Museum Masterpieces Tour', 3, '13:30:00', 3.5, 22.00, 'Bring headphones for mobile audio synchronization.'),
('item-104', 'stop-euro-2', 'act-alps-1', 'Jungfraujoch - Top of Europe Train', 1, '09:00:00', 6.0, 140.00, 'Depart Grindelwald Terminal on the Eiger Express 3S gondola.'),
('item-105', 'stop-euro-3', 'act-rome-1', 'Colosseum & Roman Forum Gladiator Arena', 1, '09:30:00', 3.0, 34.00, 'Enter via the dedicated Gladiator Gate onto the arena floor.'),
('item-106', 'stop-euro-3', 'act-rome-2', 'Trastevere Secret Food & Wine Safari', 2, '18:30:00', 3.5, 68.00, 'Evening wine tasting and handmade pasta course.')
ON DUPLICATE KEY UPDATE `custom_title`=VALUES(`custom_title`);

-- 7. SEED EXPENSES
INSERT INTO `expenses` (`id`, `trip_id`, `category`, `amount`, `expense_date`, `description`)
VALUES
('exp-01', 'trip-grand-europe', 'Transport', 620.00, '2026-08-15', 'Flight tickets: NYC to Paris Charles de Gaulle'),
('exp-02', 'trip-grand-europe', 'Stay', 750.00, '2026-08-20', 'Hotel Saint-Germain 4 nights booking (Paris)'),
('exp-03', 'trip-grand-europe', 'Transport', 180.00, '2026-08-25', 'TGV Lyria High-Speed Train: Paris to Interlaken'),
('exp-04', 'trip-grand-europe', 'Stay', 680.00, '2026-08-25', 'Alpine Swiss Chalet in Grindelwald 4 nights'),
('exp-05', 'trip-grand-europe', 'Activities', 367.00, '2026-09-10', 'Advance booking for Eiffel Tower, Louvre, & Top of Europe'),
('exp-06', 'trip-grand-europe', 'Meals', 240.00, '2026-09-12', 'Fine dining dinner on Seine River and Parisian bistros'),
('exp-07', 'trip-grand-europe', 'Stay', 520.00, '2026-08-28', 'Boutique Hotel in Trastevere Rome (5 nights)'),
('exp-08', 'trip-grand-europe', 'Other', 115.00, '2026-09-11', 'International eSIM, metro passes, and museum storage lockers')
ON DUPLICATE KEY UPDATE `amount`=VALUES(`amount`);
