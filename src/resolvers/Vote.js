const link = async (parent, _, context) => context.prisma.vote.findOne({
  where: { id: parent.id },
}).link();

const user = async (parent, _, context) => context.prisma.vote.findOne({
  where: { id: parent.id },
}).user();

module.exports = {
  link, user,
};
