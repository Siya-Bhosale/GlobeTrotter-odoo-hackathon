export type CostIndex = '$' | '$$' | '$$$';
export type ActivityCategory = 'Sightseeing' | 'Food' | 'Adventure' | 'Culture';
export type ExpenseCategory = 'Transport' | 'Stay' | 'Activities' | 'Meals' | 'Other';
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'AUD' | 'CAD' | 'CHF' | 'AED' | 'IDR';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  language: string;
  home_currency: SupportedCurrency;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  cost_index: CostIndex;
  popularity_score: number;
  image_url: string;
  description?: string;
  currency: string;
  created_at?: string;
}

export interface Activity {
  id: string;
  city_id: string;
  city_name?: string;
  title: string;
  description: string;
  category: ActivityCategory;
  cost: number;
  duration_hours: number;
  image_url: string;
  rating?: number;
  created_at?: string;
}

export interface ItineraryItem {
  id: string;
  trip_stop_id: string;
  activity_id?: string | null;
  custom_title?: string;
  day_number: number;
  start_time: string;
  duration_hours: number;
  cost: number;
  notes?: string;
  activity?: Activity;
  created_at?: string;
}

export interface TripStop {
  id: string;
  trip_id: string;
  city_id: string;
  city?: City;
  arrival_date: string;
  departure_date: string;
  stop_order: number;
  items?: ItineraryItem[];
  created_at?: string;
}

export interface Expense {
  id: string;
  trip_id: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  description: string;
  created_at?: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  cover_image_url?: string;
  is_public: boolean;
  share_token?: string;
  created_at: string;
  updated_at?: string;
  stops?: TripStop[];
  expenses?: Expense[];
  user?: Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>;
}

export interface BudgetSummary {
  trip_id: string;
  total_budget: number;
  total_spent: number;
  remaining_budget: number;
  percent_spent: number;
  daily_average_spent: number;
  is_over_budget: boolean;
  by_category: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }[];
  expenses: Expense[];
}

export interface AdminAnalytics {
  metrics: {
    total_users: number;
    total_trips: number;
    total_expenses_logged: number;
    active_itineraries: number;
    avg_trip_budget: number;
    avg_stops_per_trip: number;
  };
  trips_over_time: {
    month: string;
    trips_created: number;
    active_travelers: number;
  }[];
  top_destinations: {
    city_name: string;
    country: string;
    visit_count: number;
    popularity_score: number;
  }[];
  spending_by_category: {
    category: ExpenseCategory;
    total_amount: number;
  }[];
  user_demographics: {
    country: string;
    users_count: number;
  }[];
}
