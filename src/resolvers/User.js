const links = async (parent, _, context) => context.prisma.user.findOne({
  where: { id: parent.id },
}).links();

module.exports = {
  links,
};
