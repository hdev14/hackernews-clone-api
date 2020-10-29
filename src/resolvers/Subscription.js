const newLink = {
  subscribe: (_, __, context) => context.pubsub.asyncIterator('NEW_LINK'),
  resolve: (payload) => payload,
};

const newVote = {
  subscribe: (_, __, context) => context.pubsub.asyncIterator('NEW_VOTE'),
  resolve: (payload) => payload,
};

module.exports = {
  newLink, newVote,
};
