/* istanbul ignore file */
const ServerTestHelper = {
  async registerAndLogin({ server, userPayload }) {
    // ==== 1. Register user ====
    const registerResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
        fullname: userPayload.fullname,
      },
    });

    const {
      data: { addedUser },
    } = JSON.parse(registerResponse.payload);

    // ==== 2. Login user ====
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });

    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    // ==== 3. Return hasil ====
    return {
      userId: addedUser.id,
      accessToken,
    };
  },
};

// ==== Export ====
module.exports = ServerTestHelper;
