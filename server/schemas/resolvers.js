const { AuthenticationError } = require('apollo-server-express');
const { User, Stories, Comments } = require('../models');
const storySchema = require('../models/Stories');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    stories: async () => {
      return Stories.find();
    },
    story: async (parent, { storyId }) => {
      return Stories.findOne({ _id: storyId });
    },
    comments: async () => {
      return Comments.find();
    },
    comment: async () => {
      return Comments.findOne({ _id: commentId });
    },
    user: async () => {
      return User.findOne({ _id: userId });
    }
  },
  Mutation: {
    addStory: async (parent, { title, storyText  }) => {
      return Stories.create({ title, storyText });
    },
    addComment: async (parent, { storyId, commentText, commentAuthor }) => {
      return Stories.findOneAndUpdate(
        { _id: storyId },
        {
          $addToSet: { comments: { commentText, commentAuthor } },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
    
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const correctPw = await user.isCorrectPassword(password);
    
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const token = signToken(user);
    
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      return User.create({ username, email, password });
    }
  }
};

module.exports = resolvers;

