const CreateMultipartUpload = require('./createMultipartUpload');
const CompleteMultipartUpload = require('./completeMultipartUpload');

module.exports = {
  Mutation: {
    createMultipartUpload: async (_, { input }, ctx) => {
      if (!ctx.user) throw new Error('authentication failed');
      return CreateMultipartUpload(input, ctx);
    },
    completeMultipartUpload: async (_, { input }, ctx) => {
      if (!ctx.user) throw new Error('authentication failed');
      return CompleteMultipartUpload(input, ctx);
    },
  },
};
