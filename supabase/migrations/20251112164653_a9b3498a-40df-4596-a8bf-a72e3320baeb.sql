-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create car models table
CREATE TABLE public.car_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  fuel_efficiency_city DECIMAL(5,2) NOT NULL, -- MPG or L/100km
  fuel_efficiency_highway DECIMAL(5,2) NOT NULL,
  fuel_tank_capacity DECIMAL(5,2) NOT NULL, -- in gallons or liters
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view car models"
  ON public.car_models FOR SELECT
  TO authenticated
  USING (true);

-- Create user cars table (user's selected cars)
CREATE TABLE public.user_cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_model_id UUID NOT NULL REFERENCES public.car_models(id) ON DELETE CASCADE,
  custom_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cars"
  ON public.user_cars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cars"
  ON public.user_cars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cars"
  ON public.user_cars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cars"
  ON public.user_cars FOR DELETE
  USING (auth.uid() = user_id);

-- Create fuel expenses table
CREATE TABLE public.fuel_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_car_id UUID NOT NULL REFERENCES public.user_cars(id) ON DELETE CASCADE,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  distance DECIMAL(10,2) NOT NULL, -- in miles or km
  fuel_amount DECIMAL(8,2) NOT NULL, -- in gallons or liters
  fuel_price_per_unit DECIMAL(6,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.fuel_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
  ON public.fuel_expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON public.fuel_expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON public.fuel_expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON public.fuel_expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample car models
INSERT INTO public.car_models (make, model, year, fuel_efficiency_city, fuel_efficiency_highway, fuel_tank_capacity) VALUES
  ('Toyota', 'Camry', 2024, 28, 39, 15.8),
  ('Honda', 'Civic', 2024, 31, 40, 12.4),
  ('Ford', 'F-150', 2024, 20, 26, 23),
  ('Tesla', 'Model 3', 2024, 0, 0, 0),
  ('Chevrolet', 'Silverado', 2024, 16, 21, 24),
  ('BMW', '3 Series', 2024, 26, 36, 15.6),
  ('Mercedes-Benz', 'C-Class', 2024, 25, 35, 17.4),
  ('Hyundai', 'Elantra', 2024, 33, 43, 12.8),
  ('Mazda', 'CX-5', 2024, 25, 31, 15.3),
  ('Volkswagen', 'Jetta', 2024, 30, 41, 13.2);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();