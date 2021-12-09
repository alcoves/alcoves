import sharp from 'sharp'
import { optimizeUserAvatar, parseDataURIScheme } from '../src/service/images'

describe('parseDataURIScheme', () => {
  const successCases = [
    {
      recieved: 'data:image/jpg;base64,123',
      expected: {
        data: '123',
        encoding: 'base64',
        contentType: 'image/jpg',
      },
    },
    {
      recieved: 'data:image/png;base64,1231251251241241251231',
      expected: {
        data: '1231251251241241251231',
        encoding: 'base64',
        contentType: 'image/png',
      },
    },
  ]

  test.each(successCases)('successfully parses %i', ({ recieved, expected }) => {
    expect(parseDataURIScheme(recieved)).toMatchObject(expected)
  })

  const failureCases = [['data2:image/jpg;base64,123'], ['data:image/jpg;notbase64,123']]
  test.each(failureCases)('fails to parse %i', recieved => {
    expect(parseDataURIScheme(recieved)).toBe(null)
  })
})

describe('optimizeUserAvatar', () => {
  test('', async () => {
    const dataURI =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABpklEQVR4AcXVA48dYRTH4be2HdZ2o9qIUZvfow5qR3UbVev9Ftc3zjpYG/Xpr+YZvp17kmc8c/5j47lOyQgcxj2k0AqBoB1pPMUJTDLW6pRMx330QDz6gFKsDtN4IC7iPSSEPIz323wKshBL6rDCa/MFaIBY1o1tbs1n2Gqu6MIyrfkgZCAuynEFe7ASa7ED55GAuKjGiH8FuAyBpgo70dvlKq5GHALN/T93mo13EEUxhvl4iPvhDkTxEYt+3eE+RFGK/iZAuYR4/n2j0XijXXaMCPEt6afdDrzDRMPgAESxx8KXdDVEccIweKisrEEfY6P0t+OpYZBSVt60+D85r/RIGwZtyspDFgPsUHq0Gwai2GQxwFq1TyTFFzPXAfYoAVqjCnBFCZCKonlvlCsB7vk5kPyT+347IYrD/zcAPzBUKfv2YMQ/D24lAD8wFHv5JdsPwJmhFKJ4j+n2A/DvwB5UQTS4aCgrAbAJh3ATNRAXWQz0/cD52lbXgCmGykWABiwwVC4CZDDdUFEHeIfLGGSoKAO8wX3MjuJbL2hDCg9xAKONx/oE7ZLWqbmf4UoAAAAASUVORK5CYII='
    const parsedDataURIScheme = parseDataURIScheme(dataURI)
    if (parsedDataURIScheme) {
      const imageBuffer = await optimizeUserAvatar(parsedDataURIScheme)
      const metadata = await sharp(imageBuffer).metadata()
      expect(metadata).toMatchSnapshot()
    }
  })
})
