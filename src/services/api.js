const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export function listSowings({ status, q } = {}) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (q) params.set('q', q)
  const qs = params.toString()
  return request(`/sowings${qs ? `?${qs}` : ''}`)
}

export function getSowing(id) {
  return request(`/sowings/${id}`)
}

export function createSowing(data) {
  return request('/sowings', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateSowing(id, fields) {
  return request(`/sowings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  })
}

export function deleteSowing(id) {
  return request(`/sowings/${id}`, { method: 'DELETE' })
}

export async function uploadPhoto(file) {
  const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

export function getStats() {
  return request('/stats')
}
