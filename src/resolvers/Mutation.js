const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authtenticateAndGetUserId } = require('../auth');
const Auth = require('../auth');

const post = async (_, args, context) => {
  const userId = Auth.authtenticateAndGetUserId(context);
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  context.pubsub.publish('NEW_LINK', newLink);
  return newLink;
};

const updateLink = async (_, args, context) => {
  const { id, ...rest } = args;

  const link = context.prisma.link.update({
    where: { id: Number(id) },
    data: rest,
  });
  return link;
};

const deleteLink = async (_, args, context) => {
  const link = await context.prisma.link.delete({ where: { id: Number(args.id) } });
  return link;
};

const signup = async (_, args, context) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({ data: { ...args, password } });
  const token = jwt.sign({ userId: user.id }, Auth.APP_SECRET);

  return {
    token,
    user,
  };
};

const login = async (_, args, context) => {
  const user = await context.prisma.user.findOne({ where: { email: args.email } });
  if (!user) { throw new Error('No such user found!'); }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) { throw new Error('Invalid password'); }

  const token = jwt.sign({ userId: user.id }, Auth.APP_SECRET);

  return {
    token,
    user,
  };
};

const vote = async (_, args, context) => {
  const userId = authtenticateAndGetUserId(context);

  const voteExists = await context.prisma.vote.findOne({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId,
      },
    },
  });

  if (voteExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = await context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  context.pubsub.publish('NEW_VOTE', newVote);
  return newVote;
};

module.exports = {
  post, updateLink, deleteLink, signup, login, vote,
};
