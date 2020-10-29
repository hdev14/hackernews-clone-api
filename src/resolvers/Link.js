const postedBy = async (parent, _, context) => context.prisma.link.findOne({
  where: { id: parent.id },
}).postedBy();

const votes = async (parent, _, context) => context.prisma.link.findOne({
  where: { id: parent.id },
}).votes();

module.exports = {
  postedBy, votes,
};
