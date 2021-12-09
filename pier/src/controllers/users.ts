import db from '../config/db'
import s3 from '../config/s3'
import { optimizeUserAvatar, parseDataURIScheme } from '../service/images'

export async function patchUser(req, res) {
  let userIdToModify = req.params.userId
  if (userIdToModify === '@me') userIdToModify = req.user.id
  if (userIdToModify !== req.user.id) return res.sendStatus(403)

  const userUpdate: any = {}
  if (req.body.image) {
    const parsedDataURIScheme = parseDataURIScheme(req.body.image)
    if (parsedDataURIScheme) {
      const imageBuffer = await optimizeUserAvatar(parsedDataURIScheme)

      const res = await s3
        .upload({
          Key: 'test.jpg',
          Body: imageBuffer,
          Bucket: 'cdn.bken.io',
          ContentType: parsedDataURIScheme.contentType,
        })
        .promise()

      console.log('res', res)

      userUpdate.image = `https://cdn.bken.io/test.jpg`
    }
  }

  const user = await db.user.update({
    where: { id: userIdToModify },
    data: userUpdate,
  })

  return res.json({
    status: 'success',
    payload: { user },
  })
}
