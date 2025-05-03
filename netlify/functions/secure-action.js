const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  // Initialisation du client Supabase avec la clé secrète (jamais côté client !)
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL, // OK, c'est public
    process.env.SUPABASE_SERVICE_ROLE_KEY // SÉCURISÉ, jamais côté client
  );

  // Exemple : vérification d'un secret admin envoyé par le frontend
  const { adminSecret } = JSON.parse(event.body || '{}');
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Accès refusé' })
    };
  }

  // Exemple : action admin (lecture de la table profiles)
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}; 