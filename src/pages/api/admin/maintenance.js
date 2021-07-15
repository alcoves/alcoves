export default async function(req, res) {
  if (req.method === 'POST') {
    return res.status(200).end();
  }
}