const { gql } = require('apollo-server-lambda');

module.exports.typeDefs = gql`
  extend type Query {
    videos: [Video!]!
    video(id: String!): Video!
    videosByUserId(id: String!): [Video!]!
  }
  extend type Mutation {
    deleteVideo(id: String!): Boolean!
    createVideo(input: CreateVideoInput!): Video!
    updateVideoTitle(id: String!, title: String!): Video!
    setVideoVisability(id: String!, visability: String!): Video!
  }
  type Video {
    id: String!
    user: User!
    views: Int!
    title: String!
    duration: Float!
    thumbnail: String!
    createdAt: String!
    modifiedAt: String!
    visability: String!
    versions: [VideoVersion!]
  }
  type VideoVersion {
    link: String
    status: String!
    preset: String!
    segments: VideoSegments!
  }
  type VideoSegments {
    done: Int!
    total: Int!
    percentCompleted: Int!
  }
  input CreateVideoInput {
    user: String!
    title: String!
  }
`;

module.exports.resolvers = {
  Video: {
    id: ({ id }) => id,
    views: ({ views }) => views,
    title: ({ title }) => title,
    duration: ({ duration }) => duration,
    thumbnail: ({ thumbnail }) => thumbnail,
    createdAt: ({ createdAt }) => createdAt,
    modifiedAt: ({ modifiedAt }) => modifiedAt,
    user: function ({ user }, _, { users: { getUserById } }) {
      return getUserById(user);
    },
    versions: function ({ id }, _, { videos: { getVideoVersionsById } }) {
      return getVideoVersionsById(id);
    },
  },
  VideoVersion: {
    segments: ({ segments }) => {
      const total = Object.keys(segments).length;
      const { percentCompleted, done } = Object.values(segments).reduce(
        (acc, cv, i, arr) => {
          if (cv) acc.done++;
          acc.percentCompleted = parseInt((acc.done / arr.length) * 100);
          return acc;
        },
        { done: 0, processing: 0, percentCompleted: 0 }
      );
      return { done, total, percentCompleted };
    },
  },
  Query: {
    videos: function (_, __, { videos: { getVideos } }) {
      return getVideos();
    },
    video: function (_, { id }, { videos: { getVideoById } }) {
      return getVideoById(id);
    },
    videosByUserId: function (_, { id }, { videos: { getVideosByUserId } }) {
      return getVideosByUserId(id);
    },
  },
  Mutation: {
    deleteVideo: function (_, { id }, { videos: { deleteVideo } }) {
      return deleteVideo(id);
    },
    createVideo: function (_, { input }, { videos: { createVideo } }) {
      return createVideo(input);
    },
    updateVideoTitle: function (
      _,
      { id, title },
      { videos: { updateVideoTitle } }
    ) {
      return updateVideoTitle({ id, title });
    },
    setVideoVisability: function (
      _,
      { id, visability },
      { videos: { setVideoVisability } }
    ) {
      return setVideoVisability({ id, visability });
    },
  },
};
