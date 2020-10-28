const feed = async (_, __, context) => context.prisma.link.findMany();

const link = async (_, args, context) => context.prisma.link.findOne({
  where: { id: args.id },
});

module.exports = {
  feed, link,
};
