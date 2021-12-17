import db from '../config/db'

export async function patchPod(req, res) {
  const pod = await db.pod.update({
    where: { id: req.params.podId },
    data: {
      ...req.body, // TODO :: Please validate the body here
    },
  })

  return res.json({
    status: 'success',
    payload: { pod },
  })
}
