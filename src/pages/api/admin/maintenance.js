export default async function Maintenance(req, res) {
  if (req.method === 'POST') {
    return res.status(200).end();
  }
}