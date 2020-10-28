const { GraphQLServer } = require('graphql-yoga');

const links = [
  {
    id: 'link-1',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

const idCount = links.length;

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews clone',
    feed: () => links,
    link: (_, agrs) => {
      const link = links.find((l) => l.id === agrs.id);
      return link;
    },
  },

  Mutation: {
    post: (parent, agrs) => {
      const link = {
        id: `link-${idCount + 1}`,
        description: agrs.description,
        url: agrs.url,
      };
      links.push(link);
      return link;
    },

    updateLink: (_, agrs) => {
      const linkIndex = links.findIndex((l) => l.id === agrs.id);
      const link = links[linkIndex];
      link.description = agrs.description || link.description;
      link.url = agrs.url || link.url;
      links[linkIndex] = link;
      return link;
    },

    deleteLink: (_, agrs) => {
      const linkIndex = links.findIndex((l) => l.id === agrs.id);
      const link = links[linkIndex];
      links.splice(linkIndex, 1);
      return link;
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => console.log('Server is running on http://localhost:4000/'));
