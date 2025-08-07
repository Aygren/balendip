-- Создание таблиц для Balendip

-- Таблица пользователей (расширение auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица сфер жизни
CREATE TABLE IF NOT EXISTS public.life_spheres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    score INTEGER CHECK (score >= 1 AND score <= 10) DEFAULT 5,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица событий
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    emoji TEXT NOT NULL,
    emotion TEXT CHECK (emotion IN ('positive', 'neutral', 'negative')) NOT NULL,
    spheres TEXT[] NOT NULL, -- Массив ID сфер
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек пользователя
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    notifications_enabled BOOLEAN DEFAULT true,
    weekly_reports BOOLEAN DEFAULT true,
    theme TEXT CHECK (theme IN ('light', 'dark', 'auto')) DEFAULT 'auto',
    language TEXT CHECK (language IN ('ru', 'en')) DEFAULT 'ru',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_life_spheres_user_id ON public.life_spheres(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_spheres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Политики для users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Политики для life_spheres
CREATE POLICY "Users can view own spheres" ON public.life_spheres
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spheres" ON public.life_spheres
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spheres" ON public.life_spheres
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own spheres" ON public.life_spheres
    FOR DELETE USING (auth.uid() = user_id);

-- Политики для events
CREATE POLICY "Users can view own events" ON public.events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON public.events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON public.events
    FOR DELETE USING (auth.uid() = user_id);

-- Политики для user_settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Функция для автоматического создания профиля пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    
    -- Создаем настройки по умолчанию
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    -- Создаем дефолтные сферы жизни
    INSERT INTO public.life_spheres (user_id, name, color, icon, is_default)
    VALUES 
        (NEW.id, 'Здоровье', '#10B981', '🏥', true),
        (NEW.id, 'Карьера', '#3B82F6', '💼', true),
        (NEW.id, 'Отношения', '#F59E0B', '❤️', true),
        (NEW.id, 'Финансы', '#8B5CF6', '💰', true),
        (NEW.id, 'Саморазвитие', '#06B6D4', '📚', true),
        (NEW.id, 'Духовность', '#EC4899', '🧘', true),
        (NEW.id, 'Отдых', '#F97316', '🏖️', true),
        (NEW.id, 'Окружение', '#84CC16', '👥', true);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для обновления updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_life_spheres_updated_at
    BEFORE UPDATE ON public.life_spheres
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 