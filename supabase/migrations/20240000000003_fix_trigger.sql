-- Recréer la fonction de trigger avec une meilleure gestion de l'utilisateur
CREATE OR REPLACE FUNCTION log_settings_changes()
RETURNS TRIGGER AS $$
DECLARE
    old_json JSONB;
    new_json JSONB;
    user_id TEXT;
BEGIN
    -- Obtenir l'ID de l'utilisateur ou utiliser une valeur par défaut
    BEGIN
        user_id := auth.uid()::TEXT;
    EXCEPTION
        WHEN OTHERS THEN
            user_id := '00000000-0000-0000-0000-000000000000';
    END;

    -- Convertir les anciennes et nouvelles valeurs en JSONB
    old_json := to_jsonb(OLD);
    new_json := to_jsonb(NEW);

    -- Créer l'entrée d'historique
    NEW.change_history := array_append(
        COALESCE(OLD.change_history, ARRAY[]::JSONB[]),
        jsonb_build_object(
            'changed_at', CURRENT_TIMESTAMP,
            'changed_by', user_id,
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

-- Supprimer le trigger existant
DROP TRIGGER IF EXISTS settings_audit_trigger ON public.settings;

-- Recréer le trigger
CREATE TRIGGER settings_audit_trigger
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION log_settings_changes(); 