// const Video = require('../models/video');
// const emptyS3Dir = require('../lib/emptyS3Dir');
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend type Query {
    videos: [Video!]!
    videosByUserId(id: ID!): [Video!]!
    video(id: ID!): Video!
  }
  extend type Mutation {
    deleteVideo(id: ID!): Boolean!
    updateVideo(id: ID!, input: UpdateVideoInput!): Video!
    updateVideoFile(id: ID!, input: UpdateVideoFileInput!): Video!
  }
  type Video {
    id: ID!
    views: Int!
    title: String!
    user: User!
    status: String!
    duration: Float!
    thumbnail: String!
    createdAt: String!
    modifiedAt: String!
    sourceFile: String!
    versions: [VideoVersion!]
  }
  type VideoVersion {
    link: String
    status: String!
    preset: String!
    createdAt: String
    modifiedAt: String
    percentCompleted: Float!
  }
  input UpdateVideoInput {
    title: String
    thumbnail: String
    status: String
  }
`;

const resolvers = {
  Query: {
    video: async (_, { id }, { user, videos: { getVideo } }) => {
      return getVideo(id)
    },
    // videosByUserId: async (_, { id }) => {
    //   return Video.find({ user: id })
    //     .sort({ createdAt: -1 })
    //     .populate('user', '_id avatar displayName followers');
    // },
  },
  Mutation: {
    // updateVideo: async (_, { id, input }, { user }) => {
    //   // if (!user) throw new Error('authentication failed');
    //   await Video.updateOne(
    //     { _id: id },
    //     { $set: convertObjectToDotNotation(input) }
    //   );

    //   return Video.findOne({ _id: id }).populate(
    //     'user',
    //     '_id avatar displayName'
    //   );
    // },
    // deleteVideo: async (_, { id }, { user }) => {
    //   if (!user) throw new Error('authentication failed');
    //   await emptyS3Dir(`uploads/${id}`);
    //   const { deletedCount } = await Video.deleteOne({ _id: id });
    //   return Boolean(deletedCount);
    // },
  },
};

module.exports = { typeDefs, resolvers };
