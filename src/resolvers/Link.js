const postedBy = async (parent, _, context) => context.prisma.link.findOne({
  where: { id: parent.id },
}).postedBy();

module.exports = {
  postedBy,
};
