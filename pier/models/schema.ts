import joi from 'joi'

const patchVideoSchema = joi.object({
  title: joi.string().min(1).max(100)
})

export default function validateSchema(method: string, body: string) {
  switch (method) {
    case 'patchVideo':
      return patchVideoSchema.validate(body)
    default:
      return { value: null, error: 'invalid schema validation method' }
  }
}