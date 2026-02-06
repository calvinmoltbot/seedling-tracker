import * as Sowing from '../../models/sowing.js'
import * as Photo from '../../models/photo.js'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    if (req.method === 'GET') {
      const sowing = await Sowing.getById(Number(id))
      if (!sowing) return res.status(404).json({ error: 'Sowing not found' })

      const photos = await Photo.listBySowing(sowing.id)
      return res.json({ ...sowing, photos })
    }

    if (req.method === 'PATCH') {
      const sowing = await Sowing.getById(Number(id))
      if (!sowing) return res.status(404).json({ error: 'Sowing not found' })

      const fields = {}
      const allowed = ['seed_name', 'variety', 'brand', 'sowing_date', 'germination_date', 'notes', 'status']
      for (const key of allowed) {
        if (key in req.body) fields[key] = req.body[key]
      }

      if (fields.status === 'germinated' && !sowing.germination_date && !fields.germination_date) {
        fields.germination_date = new Date().toISOString().split('T')[0]
      }

      const updated = await Sowing.update(Number(id), fields)
      const photos = await Photo.listBySowing(updated.id)
      return res.json({ ...updated, photos })
    }

    if (req.method === 'DELETE') {
      const sowing = await Sowing.getById(Number(id))
      if (!sowing) return res.status(404).json({ error: 'Sowing not found' })

      await Sowing.softDelete(Number(id))
      return res.json({ ok: true })
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
