const Video = require('../models/video');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  extend type Query {
    videos: [Video!]!
    videosByUserId(id: ID!): [Video!]!
    video(id: ID!): Video!
  }
  extend type Mutation {
    updateVideo(id: ID!, input: UpdateVideoInput!): Video!
    updateVideoFile(id: ID!, input: UpdateVideoFileInput!): Video!
  }
  type Video {
    id: ID!
    views: Int!
    title: String!
    user: User!
    status: String!
    thumbnail: String!
    createdAt: String!
    modifiedAt: String!
    sourceFile: String!
    files: [VideoFile!]
  }
  type VideoFile {
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
  input UpdateVideoFileInput {
    link: String
    preset: String
    status: String
    createdAt: String
    modifiedAt: String
    percentCompleted: Float
  }
`;

const resolvers = {
  Query: {
    video: async (_, { id }) => {
      return Video.findOne({ _id: id }).populate(
        'user',
        '_id avatar displayName'
      );
    },
    // Deprecate? could be used to get homepage video feed
    videos: async (_, input) => {
      return Video.find()
        .sort({ createdAt: -1 })
        .populate('user', '_id avatar displayName');
    },
    videosByUserId: async (_, { id }) => {
      return Video.find({ user: id })
        .sort({ createdAt: -1 })
        .populate('user', '_id avatar displayName followers');
    },
  },
  Mutation: {
    updateVideo: async (_, { id, input }, { user }) => {
      // if (!user) throw new Error('authentication failed');
      await Video.updateOne(
        { _id: id },
        { $set: convertObjectToDotNotation(input) }
      );

      return Video.findOne({ _id: id }).populate(
        'user',
        '_id avatar displayName'
      );
    },
    updateVideoFile: async (_, { id, input }, { user }) => {
      const video = await Video.findOne({ _id: id });
      let shouldUpdate;

      video.files.map(({ preset }) => {
        if (preset === input.preset) shouldUpdate = true;
      });

      if (shouldUpdate) {
        const convertedArrToDot = Object.entries(input).reduce(
          (acc, [k, v]) => {
            acc[`files.$.${k}`] = v;
            return acc;
          },
          {}
        );

        // console.log(`files.preset`, input.preset);
        // console.log('convertedArrToDot', convertedArrToDot);

        await Video.updateOne(
          { _id: id, 'files.preset': input.preset },
          { $set: convertedArrToDot }
        );
      } else {
        await Video.updateOne({ _id: id }, { $push: { files: input } });
      }

      return Video.findOne({ _id: id }).populate(
        'user',
        '_id avatar displayName'
      );
    },
  },
};

module.exports = { typeDefs, resolvers };
