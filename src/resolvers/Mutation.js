const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

module.exports = {
  post, updateLink, deleteLink, signup, login,
};
