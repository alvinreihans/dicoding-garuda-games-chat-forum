const ServerTestHelper = {
  defaultUser: {
    id: 'user-123',
    username: 'dicoding',
    password: 'secret',
    fullname: 'Dicoding Indonesia',
  },

  async getAccessToken({ server, username }) {
    const {
      password,
      fullname,
      username: defaultUsername,
    } = ServerTestHelper.defaultUser;
    const finalUsername = username || defaultUsername;

    // Payload untuk registrasi dan login
    const userPayload = { username: finalUsername, password };

    // ==== 1. Registrasi user baru ====
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: { ...userPayload, fullname },
    });

    // ==== 2. Login untuk mendapatkan token ====
    const authResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    // ==== 3. Parsing response JSON ====
    const {
      data: { accessToken },
    } = JSON.parse(authResponse.payload);

    // ==== 4. Return hasil ====
    return accessToken;
  },
};

// ==== Export ====
module.exports = ServerTestHelper;
