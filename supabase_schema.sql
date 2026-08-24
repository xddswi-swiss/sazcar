-- Supabase Schema Initialization for Autogarage & Carrosserie

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    license_plate TEXT NOT NULL,
    services_done TEXT[] DEFAULT '{}'::TEXT[],
    before_image_urls TEXT[] DEFAULT '{}'::TEXT[],
    after_image_urls TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    entry_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completion_date TIMESTAMPTZ,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Cars For Sale Table
CREATE TABLE IF NOT EXISTS public.cars_for_sale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    fuel_type TEXT NOT NULL,
    transmission TEXT NOT NULL,
    description TEXT,
    image_urls TEXT[] DEFAULT '{}'::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on cars_for_sale
ALTER TABLE public.cars_for_sale ENABLE ROW LEVEL SECURITY;

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    vehicle_info TEXT NOT NULL,
    selected_services TEXT[] DEFAULT '{}'::TEXT[],
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    notes TEXT,
    image_urls TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Projects Policies
CREATE POLICY "Allow public select on published projects" 
ON public.projects FOR SELECT 
USING (is_published = TRUE);

CREATE POLICY "Allow admin select all projects" 
ON public.projects FOR SELECT 
TO authenticated 
USING (TRUE);

CREATE POLICY "Allow admin insert/update/delete on projects" 
ON public.projects FOR ALL 
TO authenticated 
USING (TRUE) 
WITH CHECK (TRUE);


-- Cars For Sale Policies
CREATE POLICY "Allow public select on active cars" 
ON public.cars_for_sale FOR SELECT 
USING (is_active = TRUE);

CREATE POLICY "Allow admin select all cars" 
ON public.cars_for_sale FOR SELECT 
TO authenticated 
USING (TRUE);

CREATE POLICY "Allow admin insert/update/delete on cars" 
ON public.cars_for_sale FOR ALL 
TO authenticated 
USING (TRUE) 
WITH CHECK (TRUE);


-- Appointments Policies
CREATE POLICY "Allow public insert on appointments"
ON public.appointments FOR INSERT
WITH CHECK (TRUE);

CREATE POLICY "Allow admin read appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (TRUE);

CREATE POLICY "Allow admin update/delete appointments"
ON public.appointments FOR ALL
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);


-- =========================================================================
-- 5. Promotions Table (Hero Aktions- & Rabatt-Badge)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    original_price NUMERIC(10, 2),
    discounted_price NUMERIC(10, 2),
    discount_percent INTEGER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    badge_type TEXT NOT NULL DEFAULT 'custom' CHECK (badge_type IN ('winter_tires', 'summer_tires', 'detailing', 'service', 'custom')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CHECK (end_date >= start_date)
);

-- Enable RLS on promotions
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Promotions Policies
-- Public only ever sees a promotion that is active AND currently within its date window.
-- Expiry/activation is enforced here, not in application code, so it can't drift.
CREATE POLICY "Allow public select on active promotions"
ON public.promotions FOR SELECT
USING (is_active = TRUE AND CURRENT_DATE BETWEEN start_date AND end_date);

CREATE POLICY "Allow admin select all promotions"
ON public.promotions FOR SELECT
TO authenticated
USING (TRUE);

CREATE POLICY "Allow admin insert/update/delete on promotions"
ON public.promotions FOR ALL
TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- Fast lookup for the public-facing "current active promotion" query
CREATE INDEX IF NOT EXISTS idx_promotions_active_window
ON public.promotions (is_active, start_date, end_date);
