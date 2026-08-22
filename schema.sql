-- ============================================================================
-- GlobeTrotter - Multi-City Travel Planning Web Platform
-- Relational Database Architecture (MySQL 8.0+)
-- Complete DDL Schema with Foreign Keys, Cascades, Indexes, and Constraints
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `globetrotter` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `globetrotter`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `avatar_url` VARCHAR(512) NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  `language` VARCHAR(10) NOT NULL DEFAULT 'en',
  `home_currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CITIES TABLE
CREATE TABLE IF NOT EXISTS `cities` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `region` VARCHAR(100) NOT NULL,
  `cost_index` ENUM('$', '$$', '$$$') NOT NULL DEFAULT '$$',
  `popularity_score` DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  `image_url` VARCHAR(512) NOT NULL,
  `description` TEXT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cities_region` (`region`),
  KEY `idx_cities_country` (`country`),
  KEY `idx_cities_cost_index` (`cost_index`),
  KEY `idx_cities_popularity` (`popularity_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TRIPS TABLE
CREATE TABLE IF NOT EXISTS `trips` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `total_budget` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `cover_image_url` VARCHAR(512) NULL,
  `is_public` BOOLEAN NOT NULL DEFAULT FALSE,
  `share_token` VARCHAR(64) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_trips_share_token` (`share_token`),
  KEY `idx_trips_user_id` (`user_id`),
  KEY `idx_trips_dates` (`start_date`, `end_date`),
  KEY `idx_trips_is_public` (`is_public`),
  CONSTRAINT `fk_trips_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TRIP STOPS (Multi-City Route Sequence)
CREATE TABLE IF NOT EXISTS `trip_stops` (
  `id` VARCHAR(36) NOT NULL,
  `trip_id` VARCHAR(36) NOT NULL,
  `city_id` VARCHAR(36) NOT NULL,
  `arrival_date` DATE NOT NULL,
  `departure_date` DATE NOT NULL,
  `stop_order` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trip_stops_trip_order` (`trip_id`, `stop_order`),
  KEY `idx_trip_stops_city_id` (`city_id`),
  CONSTRAINT `fk_trip_stops_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_trip_stops_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ACTIVITIES CATALOG (Global Directory of Curated Activities)
CREATE TABLE IF NOT EXISTS `activities_catalog` (
  `id` VARCHAR(36) NOT NULL,
  `city_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM('Sightseeing', 'Food', 'Adventure', 'Culture') NOT NULL,
  `cost` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `duration_hours` DECIMAL(3,1) NOT NULL DEFAULT 2.0,
  `image_url` VARCHAR(512) NOT NULL,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 4.8,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activities_city_category` (`city_id`, `category`),
  KEY `idx_activities_cost` (`cost`),
  CONSTRAINT `fk_activities_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ITINERARY ITEMS (Day-by-Day Activity Slots in a Trip Stop)
CREATE TABLE IF NOT EXISTS `itinerary_items` (
  `id` VARCHAR(36) NOT NULL,
  `trip_stop_id` VARCHAR(36) NOT NULL,
  `activity_id` VARCHAR(36) NULL,
  `custom_title` VARCHAR(200) NULL,
  `day_number` INT NOT NULL DEFAULT 1,
  `start_time` TIME NOT NULL DEFAULT '09:00:00',
  `duration_hours` DECIMAL(3,1) NOT NULL DEFAULT 2.0,
  `cost` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_itinerary_stop_day` (`trip_stop_id`, `day_number`, `start_time`),
  KEY `idx_itinerary_activity_id` (`activity_id`),
  CONSTRAINT `fk_itinerary_stop` FOREIGN KEY (`trip_stop_id`) REFERENCES `trip_stops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_itinerary_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities_catalog` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. EXPENSES TABLE (Budget & Financial Logs)
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` VARCHAR(36) NOT NULL,
  `trip_id` VARCHAR(36) NOT NULL,
  `category` ENUM('Transport', 'Stay', 'Activities', 'Meals', 'Other') NOT NULL DEFAULT 'Other',
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `expense_date` DATE NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_expenses_trip_category` (`trip_id`, `category`),
  KEY `idx_expenses_date` (`expense_date`),
  CONSTRAINT `fk_expenses_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
