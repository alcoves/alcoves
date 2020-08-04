const { gql, AuthenticationError } = require('apollo-server-lambda');
const { getUserById } = require('../loaders/users');
const {
  deleteVideo,
  createVideo,
  getVideoById,
  updateVideoTitle,
  getTidalVideoById,
  setVideoVisibility,
  getVideosByUsername,
} = require('../loaders/videos');

module.exports.typeDefs = gql`
  extend type Query {
    video(id: String!): Video!
    authenticatedQuery: String!
    videosByUsername(username: String!): [Video!]!
  }
  extend type Mutation {
    deleteVideo(id: String!): Boolean!
    createVideo(input: CreateVideoInput!): Video!
    updateVideoTitle(id: String!, title: String!): Video!
    setVideoVisibility(id: String!, visibility: VisibilityOption!): Video!
  }
  type Video {
    id: String!
    user: User!
    views: Int!
    title: String!
    duration: Float!
    createdAt: String!
    modifiedAt: String!
    visibility: String!
    tidal: TidalVideo
  }
  type TidalVideo {
    status: String!
    thumbnail: String!
    versions: [TidalVersion!]!
  }
  type TidalVersion {
    link: String
    status: String!
    preset: String!
    percentCompleted: Float!
  }
  enum VisibilityOption {
    public
    private
    unlisted
  }
  input CreateVideoInput {
    user: String!
    title: String!
  }
`;

module.exports.resolvers = {
  Video: {
    async tidal({ id }) {
      return getTidalVideoById(id);
    },
    user({ user }) {
      return getUserById(user);
    },
  },
  Query: {
    video(_, { id }) {
      return getVideoById(id);
    },
    authenticatedQuery(_, __, { auth: { isAuthenticated } }) {
      if (!isAuthenticated) throw new AuthenticationError('Auth failure');
      return 'you are authenticated!';
    },
    videosByUsername(_, { username }, { auth: { isAuthenticated } }) {
      return getVideosByUsername(username);
    },
  },
  Mutation: {
    deleteVideo(_, { id }) {
      return deleteVideo(id);
    },
    createVideo(_, { input }) {
      return createVideo(input);
    },
    updateVideoTitle(_, { id, title }) {
      return updateVideoTitle({ id, title });
    },
    setVideoVisibility(_, { id, visibility }) {
      return setVideoVisibility({ id, visibility });
    },
  },
};
