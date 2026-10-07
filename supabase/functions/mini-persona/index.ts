import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { withSupabase } from 'npm:@supabase/server@^1'

const RODIN_BASE = 'https://api.hyper3d.com/api/v2'
const MAX_FILES = 5
const MAX_FILE_SIZE = 25 * 1024 * 1024

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

function actionFrom(req: Request) {
  const header = req.headers.get('x-mini-action')
  if (header) return header
  const path = new URL(req.url).pathname
  if (path.endsWith('/generate')) return 'generate'
  if (path.endsWith('/status')) return 'status'
  if (path.endsWith('/download')) return 'download'
  return ''
}

async function rodinFetch(path: string, init: RequestInit = {}) {
  const key = Deno.env.get('RODIN_API_KEY')
  if (!key) throw new Error('RODIN_API_KEY não configurada no Supabase.')
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${key}`)
  return fetch(`${RODIN_BASE}${path}`, { ...init, headers })
}

export default {
  fetch: withSupabase({ auth: 'publishable' }, async (req) => {
    try {
      const action = actionFrom(req)

      if (req.method === 'OPTIONS') return new Response(null, { status: 204 })

      if (action === 'generate') {
        if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

        const incoming = await req.formData()
        const images = incoming.getAll('images').filter((v): v is File => v instanceof File)

        if (!images.length || images.length > MAX_FILES) {
          return json({ error: 'Envie de 1 a 5 imagens.' }, 400)
        }

        const form = new FormData()
        const labels: string[] = []

        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          if (!file.type.startsWith('image/')) {
            return json({ error: 'Todos os arquivos precisam ser imagens.' }, 400)
          }
          if (file.size > MAX_FILE_SIZE) {
            return json({ error: 'Cada imagem deve ter no máximo 25 MB.' }, 400)
          }
          form.append('images', file, file.name || `mini-${i}.jpg`)
          labels.push(['F', 'B', 'L', 'R', '?'][i] ?? '?')
        }

        form.set('tier', 'Gen-2.5-High')
        form.set('mesh_mode', 'Raw')
        form.set('geometry_file_format', 'glb')
        form.set('texture_mode', 'high')
        form.set('detail_level', '3')
        form.set('preview_render', 'true')
        form.set('geometry_instruct_mode', 'faithful')
        form.set('image_label', labels.join(','))

        const response = await rodinFetch('/rodin', { method: 'POST', body: form })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.error || !data.uuid || !data.jobs?.subscription_key) {
          return json({
            error: data.message || data.error || 'Hyper3D não aceitou a geração.',
            details: data,
          }, response.status || 502)
        }

        return json({
          taskUuid: data.uuid,
          subscriptionKey: data.jobs.subscription_key,
          consumed: data.consumed ?? null,
        }, 201)
      }

      if (action === 'status') {
        if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
        const body = await req.json()
        if (!body.subscriptionKey) return json({ error: 'subscriptionKey ausente.' }, 400)

        const response = await rodinFetch('/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription_key: body.subscriptionKey }),
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          return json({ error: data.message || data.error || 'Falha ao consultar o Hyper3D.', details: data }, response.status)
        }

        const jobs = Array.isArray(data.jobs) ? data.jobs : []
        const states = jobs.map((job: { status?: string }) => String(job.status ?? '').toLowerCase())
        const failed = states.some((s: string) => ['failed', 'error', 'canceled', 'cancelled'].includes(s))
        const done = states.length > 0 && states.every((s: string) => ['done', 'completed'].includes(s))
        const status = failed ? 'failed' : done ? 'done' : 'processing'

        return json({ status, jobs: data.jobs ?? [], raw: data })
      }

      if (action === 'download') {
        if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
        const body = await req.json()
        if (!body.taskUuid) return json({ error: 'taskUuid ausente.' }, 400)

        const response = await rodinFetch('/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_uuid: body.taskUuid }),
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          return json({ error: data.message || data.error || 'Falha ao obter o modelo.', details: data }, response.status)
        }

        const urls: string[] = []
        const walk = (value: unknown) => {
          if (!value) return
          if (typeof value === 'string') {
            if (/\\.glb(?:[?#]|$)/i.test(value)) urls.push(value)
            return
          }
          if (Array.isArray(value)) value.forEach(walk)
          else if (typeof value === 'object') Object.values(value as Record<string, unknown>).forEach(walk)
        }
        walk(data)

        const url = urls[0] ?? null
        if (!url) return json({ error: 'Hyper3D não retornou um arquivo GLB.', details: data }, 502)

        return json({ url, files: data })
      }

      return json({ error: 'Ação inválida. Use generate, status ou download.' }, 400)
    } catch (error) {
      console.error(error)
      return json({
        error: error instanceof Error ? error.message : 'Erro interno.',
      }, 500)
    }
  }),
}
