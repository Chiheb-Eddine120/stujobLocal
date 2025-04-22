-- Ajouter la colonne change_history si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'settings' 
        AND column_name = 'change_history'
    ) THEN
        ALTER TABLE public.settings 
        ADD COLUMN change_history JSONB[] DEFAULT ARRAY[]::JSONB[];
    END IF;
END $$;

-- Recréer la fonction de trigger si elle n'existe pas
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

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS settings_audit_trigger ON public.settings;

-- Recréer le trigger
CREATE TRIGGER settings_audit_trigger
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION log_settings_changes(); 