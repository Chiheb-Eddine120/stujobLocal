import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Pour la pagination
  const url = new URL(req.url)
  const pageParam = url.searchParams.get('page') || '1'
  const limitParam = url.searchParams.get('limit') || '100'

  const page = parseInt(pageParam)
  const limit = parseInt(limitParam)

  const offset = (page - 1) * limit

  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: limit,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}) 