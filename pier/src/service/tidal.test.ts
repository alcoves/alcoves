import { parseDimensions } from './tidal'

describe('tidal tests', () => {
  const cases: any[] = [
    [
      {
        streams: [
          {
            width: 1024,
            height: 768,
            codec_type: 'video',
            tags: {
              rotate: '90',
            },
            side_data_list: [
              {
                rotation: -90,
              },
            ],
          },
          {
            codec_type: 'data',
            tags: {
              rotate: '90',
            },
          },
        ],
      },
      { width: 768, height: 1024 },
    ],
    [
      {
        streams: [
          {
            width: 1920,
            height: 1080,
            codec_type: 'video',
          },
          {
            codec_type: 'data',
            tags: {
              rotate: '90',
            },
          },
        ],
      },
      { width: 1080, height: 1920 },
    ],
    [
      {
        streams: [
          {
            width: 1080,
            height: 1920,
            codec_type: 'video',
          },
        ],
      },
      { width: 1080, height: 1920 },
    ],
    [
      {
        streams: [
          {
            width: 1920,
            height: 1080,
            codec_type: 'video',
          },
        ],
      },
      { width: 1920, height: 1080 },
    ],
  ]

  describe('parse dimensions', () => {
    test.each(cases)('given metadata input, return dimensions', (metadata, expected) => {
      const dimensions = parseDimensions(metadata)
      expect(dimensions).toEqual(expected)
    })
  })
})
