--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: car_models; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.car_models (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    year integer NOT NULL,
    fuel_efficiency_city numeric(5,2) NOT NULL,
    fuel_efficiency_highway numeric(5,2) NOT NULL,
    fuel_tank_capacity numeric(5,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: fuel_expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fuel_expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    user_car_id uuid NOT NULL,
    expense_date date DEFAULT CURRENT_DATE NOT NULL,
    distance numeric(10,2) NOT NULL,
    fuel_amount numeric(8,2) NOT NULL,
    fuel_price_per_unit numeric(6,2) NOT NULL,
    total_cost numeric(10,2) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_cars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_cars (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    car_model_id uuid NOT NULL,
    custom_name text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: car_models car_models_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.car_models
    ADD CONSTRAINT car_models_pkey PRIMARY KEY (id);


--
-- Name: fuel_expenses fuel_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fuel_expenses
    ADD CONSTRAINT fuel_expenses_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: user_cars user_cars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_cars
    ADD CONSTRAINT user_cars_pkey PRIMARY KEY (id);


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: fuel_expenses fuel_expenses_user_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fuel_expenses
    ADD CONSTRAINT fuel_expenses_user_car_id_fkey FOREIGN KEY (user_car_id) REFERENCES public.user_cars(id) ON DELETE CASCADE;


--
-- Name: fuel_expenses fuel_expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fuel_expenses
    ADD CONSTRAINT fuel_expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_cars user_cars_car_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_cars
    ADD CONSTRAINT user_cars_car_model_id_fkey FOREIGN KEY (car_model_id) REFERENCES public.car_models(id) ON DELETE CASCADE;


--
-- Name: user_cars user_cars_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_cars
    ADD CONSTRAINT user_cars_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: car_models Anyone can view car models; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view car models" ON public.car_models FOR SELECT TO authenticated USING (true);


--
-- Name: user_cars Users can delete own cars; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own cars" ON public.user_cars FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: fuel_expenses Users can delete own expenses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own expenses" ON public.fuel_expenses FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_cars Users can insert own cars; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own cars" ON public.user_cars FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: fuel_expenses Users can insert own expenses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own expenses" ON public.fuel_expenses FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: user_cars Users can update own cars; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own cars" ON public.user_cars FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: fuel_expenses Users can update own expenses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own expenses" ON public.fuel_expenses FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: user_cars Users can view own cars; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own cars" ON public.user_cars FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: fuel_expenses Users can view own expenses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own expenses" ON public.fuel_expenses FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: car_models; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;

--
-- Name: fuel_expenses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.fuel_expenses ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_cars; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_cars ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


