import db from '../../../../utils/db'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const user = await db.user.findFirst({ where: { id: req.query.id } })
      if (!user) return res.status(404).end()
      return res.send({
        id: user.id,
        name: user.name,
        image: user.image,
      })
    }
    res.status(400).end()
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}
