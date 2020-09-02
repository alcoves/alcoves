module.exports = async (event) => {
  const user = null;
  const isAuthenticated = false;

  // try {
  //   const authHeader = event.headers.authorization || '';

  //   if (authHeader) {
  //     const token = authHeader.split(' ')[1];
  //     const payload = ''; // Verify token
  //     user = payload || null;
  //     isAuthenticated = !!payload;
  //   }
  // } catch (error) {
  //   console.error(error);
  // }

  return { auth: { isAuthenticated, user } };
};
