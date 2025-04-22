-- Supprimer la table settings existante
DROP TABLE IF EXISTS public.settings CASCADE;

-- Recréer la table settings avec la bonne structure
CREATE TABLE public.settings (
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

-- Recréer la fonction de trigger
CREATE OR REPLACE FUNCTION log_settings_changes()
RETURNS TRIGGER AS $$
DECLARE
    old_json JSONB;
    new_json JSONB;
BEGIN
    -- Convertir les anciennes et nouvelles valeurs en JSONB
    old_json := to_jsonb(OLD);
    new_json := to_jsonb(NEW);

    -- Créer l'entrée d'historique
    NEW.change_history := array_append(
        COALESCE(OLD.change_history, ARRAY[]::JSONB[]),
        jsonb_build_object(
            'changed_at', CURRENT_TIMESTAMP,
            'changed_by', COALESCE(auth.uid(), 'system'),
            'changes', jsonb_build_object(
                'old', old_json,
                'new', new_json
            )
        )
    );

    -- Mettre à jour updated_at
    NEW.updated_at := CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recréer le trigger
CREATE TRIGGER settings_audit_trigger
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION log_settings_changes();

-- Insérer les paramètres par défaut
INSERT INTO public.settings (
    site_name,
    site_email,
    matching_threshold,
    auto_match_enabled,
    email_notifications,
    maintenance_mode,
    language
) VALUES (
    'StuJob',
    'contact@stujob.be',
    80,
    true,
    true,
    false,
    'fr'
);

-- Recréer les politiques RLS
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