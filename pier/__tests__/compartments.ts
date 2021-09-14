import request from 'supertest'
import app from '../src/app'

import { QueryResult } from 'pg'
import { query } from '../src/config/db'
import { Compartment } from '../src/types'

jest.mock('../src/config/db')

const testCompartment: Compartment = {
  id: "test-compartment-id",
  name: "Bken Test Compartment",
}

const mockQuery = query as jest.MockedFunction<typeof query>

describe("Videos Endpoint", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list compartments', async () => {
    const res = await request(app).get('/compartments')
    expect(res.statusCode).toEqual(200)
  })

  it('should create a compartment', async () => {
    const res = await request(app).post('/compartments')
    expect(res.statusCode).toEqual(200)
  })

  it('should get a compartment', async () => {
    mockQuery.mockResolvedValueOnce({ rows:[testCompartment] } as QueryResult)
    const res = await request(app).get(`/compartments/${testCompartment.id}`)
    expect(res.statusCode).toEqual(200)
    expect(mockQuery).toHaveBeenNthCalledWith(1,
      "select * from compartments where id = $1",
      [testCompartment.id])
  })

  it('should fail to get a compartment', async () => {
    mockQuery.mockResolvedValueOnce({ rows:[] as unknown } as QueryResult)
    const res = await request(app).get(`/compartments/404`)
    expect(res.statusCode).toEqual(404)
    expect(mockQuery).toHaveBeenNthCalledWith(1,
      "select * from compartments where id = $1",
      ["404"])
  })

  it('should patch a compartment', async () => {
    const res = await request(app).patch('/compartments/id')
    expect(res.statusCode).toEqual(200)
  })

  it('should delete a compartment', async () => {
    const res = await request(app).delete('/compartments/id')
    expect(res.statusCode).toEqual(200)
  })
})