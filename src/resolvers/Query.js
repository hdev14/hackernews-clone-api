const feed = async (_, args, context) => {
  const where = args.filter ? {
    OR: [
      { description: { contains: args.filter } },
      { url: { contains: args.filter } },
    ],
  } : {};

  const links = await context.prisma.link.findMany({ where });
  return links;
};

const link = async (_, args, context) => context.prisma.link.findOne({
  where: { id: args.id },
});

module.exports = {
  feed, link,
};
