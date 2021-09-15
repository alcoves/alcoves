// import { QueryResult } from 'pg'
// import request from 'supertest'
// import app from '../app'
// import { query } from '../config/db'
// import { Video } from '../types'

// jest.mock('../config/db')

// const mockQuery = query as jest.MockedFunction<typeof query>

// const testVideo: Video = {
//   "id": "OYtQ4YBeTIeiH5voS7W_T",
//   "status": "completed",
//   "title": "Supreme Court",
//   "duration": "134.6000000000000",
//   "views": 12,
//   "visibility": "public",
//   "thumbnail": "https://cdn.bken.io/v/OYtQ4YBeTIeiH5voS7W_T/thumb.jpg",
//   "percent_completed": "100",
//   "created_at": "2021-09-09T02:43:58.127Z",
//   "updated_at": "2021-09-09T02:43:58.127Z",
//   "mpd_link": "https://cdn.bken.io/v/OYtQ4YBeTIeiH5voS7W_T/pkg/manifest.mpd",
//   "user_id": "ckrf3a06e000t01mg1oft9cxd"
// }

// describe("Videos Endpoint", () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   it('should respond 404', async () => {
//     mockQuery.mockResolvedValueOnce({ rows:[] as unknown } as QueryResult)
//     const res = await request(app).get('/videos/id-not-exist')
//     expect(res.statusCode).toEqual(404)
//     expect(mockQuery).toHaveBeenNthCalledWith(1,
//       "select * from videos where id = $1",
//       ["id-not-exist"])
//   })

//   it('should respond 200', async () => {
//     mockQuery.mockResolvedValueOnce({ rows: [testVideo], } as QueryResult)
//     const res = await request(app).get(`/videos/${testVideo.id}`)
//     expect(mockQuery).toHaveBeenNthCalledWith(1,
//       "select * from videos where id = $1",
//       ["OYtQ4YBeTIeiH5voS7W_T"])
//     expect(res.statusCode).toEqual(200)
//     expect(res.body).toEqual(testVideo)
//   })
// })