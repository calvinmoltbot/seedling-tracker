import * as Sowing from '../../models/sowing.js'
import * as Photo from '../../models/photo.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { status, q } = req.query
      let sowings = await Sowing.list({ status: status || undefined })

      if (q) {
        const query = q.toLowerCase()
        sowings = sowings.filter(s =>
          s.sowing_code.toLowerCase().includes(query) ||
          s.seed_name.toLowerCase().includes(query) ||
          (s.variety && s.variety.toLowerCase().includes(query))
        )
      }

      return res.json(sowings)
    }

    if (req.method === 'POST') {
      const { seed_name, variety, brand, sowing_date, notes, packet_photo_url, tray_photo_url } = req.body

      if (!seed_name || !sowing_date) {
        return res.status(400).json({ error: 'seed_name and sowing_date are required' })
      }

      const sowing = await Sowing.create({ seed_name, variety, brand, sowing_date, notes })

      if (packet_photo_url) {
        await Photo.create({
          sowing_id: sowing.id,
          photo_type: 'packet',
          filename: packet_photo_url,
        })
      }

      if (tray_photo_url) {
        await Photo.create({
          sowing_id: sowing.id,
          photo_type: 'tray',
          filename: tray_photo_url,
        })
      }

      const photos = await Photo.listBySowing(sowing.id)
      return res.status(201).json({ ...sowing, photos })
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
