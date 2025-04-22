-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_name VARCHAR NOT NULL DEFAULT 'StuJob',
    site_email VARCHAR NOT NULL DEFAULT 'contact@stujob.be',
    matching_threshold INTEGER NOT NULL DEFAULT 80,
    auto_match_enabled BOOLEAN NOT NULL DEFAULT true,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    language VARCHAR NOT NULL DEFAULT 'fr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    change_history JSONB[] DEFAULT ARRAY[]::JSONB[]
);

-- Fonction pour enregistrer l'historique des modifications
CREATE OR REPLACE FUNCTION log_settings_changes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.change_history = array_append(
        COALESCE(OLD.change_history, ARRAY[]::JSONB[]),
        jsonb_build_object(
            'changed_at', NOW(),
            'changed_by', auth.uid(),
            'changes', jsonb_build_object(
                'old', to_jsonb(OLD),
                'new', to_jsonb(NEW)
            )
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour enregistrer les modifications
CREATE TRIGGER settings_audit_trigger
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION log_settings_changes();

-- Insert default settings if table is empty
INSERT INTO public.settings (
    site_name,
    site_email,
    matching_threshold,
    auto_match_enabled,
    email_notifications,
    maintenance_mode,
    language
)
SELECT
    'StuJob',
    'contact@stujob.be',
    80,
    true,
    true,
    false,
    'fr'
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- Create RLS policies
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings
CREATE POLICY "Allow anyone to read settings" ON public.settings
    FOR SELECT
    USING (true);

-- Only allow admins to update settings
CREATE POLICY "Only admins can update settings" ON public.settings
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Only allow admins to insert settings
CREATE POLICY "Only admins can insert settings" ON public.settings
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    );

-- Only allow admins to delete settings
CREATE POLICY "Only admins can delete settings" ON public.settings
    FOR DELETE
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'admin'
        )
    ); 