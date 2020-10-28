const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews clone',

    feed: async (_, __, context) => context.prisma.link.findMany(),

    link: async (_, args, context) => context.prisma.link.findOne({
      where: { id: args.id },
    }),
  },

  Mutation: {
    post: async (_, args, context) => {
      const newLink = await context.prisma.link.create({ data: args });
      return newLink;
    },

    updateLink: async (_, args, context) => {
      const { id, ...rest } = args;

      const link = context.prisma.link.update({
        where: { id: Number(id) },
        data: rest,
      });
      return link;
    },

    deleteLink: async (_, args, context) => {
      const link = await context.prisma.link.delete({ where: { id: Number(args.id) } });
      return link;
    },
  },
};

const prisma = new PrismaClient();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    prisma,
  },
});

server.start(() => console.log('Server is running on http://localhost:4000/'));
