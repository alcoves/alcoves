const CreateMultipartUpload = require('./createMultipartUpload');
const CompleteMultipartUpload = require('./completeMultipartUpload');

module.exports = {
  Mutation: {
    createMultipartUpload: async (_, { input }) => {
      return CreateMultipartUpload(input);
    },
    completeMultipartUpload: async (_, { input }) => {
      return CompleteMultipartUpload(input);
    },
  },
};
