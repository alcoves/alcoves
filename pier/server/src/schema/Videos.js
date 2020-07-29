const { gql } = require('apollo-server-lambda');

module.exports.typeDefs = gql`
  extend type Query {
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
    percentCompleted: Float!
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
    thumbnail: async function ({ id }, _, { videos: { getTidalVideoById } }) {
      const video = await getTidalVideoById(id);
      if (video && video.thumbnail) return video.thumbnail;
      return 'https://cdn.bken.io/static/default-thumbnail-sm.jpg';
    },
    createdAt: ({ createdAt }) => createdAt,
    modifiedAt: ({ modifiedAt }) => modifiedAt,
    user: function ({ user }, _, { users: { getUserById } }) {
      return getUserById(user);
    },
    versions: async function ({ id }, _, { videos: { getTidalVideoById } }) {
      const video = await getTidalVideoById(id);
      if (video) {
        return Object.entries(video.versions).map(([k, v]) => {
          const percentCompleted =
            (v.segmentsCompleted / video.segmentCount) * 100;
          return {
            link: v.link || null,
            status: v.status || null,
            preset: v.preset || null,
            percentCompleted: isNaN(percentCompleted) ? 0 : percentCompleted,
          };
        });
      }

      return [];
    },
  },
  Query: {
    video: function (_, { id }, { videos: { getVideoById } }) {
      return getVideoById(id);
    },
    videosByUsername: function (
      _,
      { username },
      { videos: { getVideosByUsername } }
    ) {
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
