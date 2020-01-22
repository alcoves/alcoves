const doco = require('./do');

describe('digital ocean api wrapper tests', () => {
  test('should get account information', async () => {
    const res = await doco({
      method: 'get',
      url: '/v2/account',
    });

    expect(res.status).toEqual(200);
    expect(res.data.account.status).toEqual('active');
  });

  test('should throw error', async () => {
    await expect(doco({ method: 'get', url: '/404' })).rejects.toThrow(
      'Request failed with status code 404'
    );
  });
});
