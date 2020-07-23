const { gql } = require('apollo-server-lambda');

module.exports.typeDefs = gql`
  extend type Query {
    videos: [Video!]!
    video(id: String!): Video!
    videosByUsername(username: String!): [Video!]!
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
    versions: async function ({ id }, _, { videos: { getTidalVideoById } }) {
      const video = await getTidalVideoById(id);
      if (video) {
        return Object.entries(video.versions).map(([k, v]) => {
          return {
            link: v.link || null,
            status: v.status || null,
            preset: v.preset || null,
            percentCompleted: parseInt((v.segmentsCompleted || 0 / video.segmentCount || 0) * 100),
          };
        });
      }

      return [];
    },
  },
  Query: {
    videos: function (_, __, { videos: { getVideos } }) {
      return getVideos();
    },
    video: function (_, { id }, { videos: { getVideoById } }) {
      return getVideoById(id);
    },
    videosByUsername: function (
      _,
      { username },
      { videos: { getVideosByUsername } }
    ) {
      console.log('username', username);
      return getVideosByUsername(username);
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
