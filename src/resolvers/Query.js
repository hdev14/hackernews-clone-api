const feed = async (_, args, context) => {
  const where = args.filter ? {
    OR: [
      { description: { contains: args.filter } },
      { url: { contains: args.filter } },
    ],
  } : {};

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });

  return {
    links,
    count: links.length,
  };
};

const link = async (_, args, context) => context.prisma.link.findOne({
  where: { id: args.id },
});

module.exports = {
  feed, link,
};
