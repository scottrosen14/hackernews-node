const { GraphQLServer } = require('graphql-yoga');

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]
let idCount = links.length;

const resolvers = {
  Query: {
    feed: () => links,
    link: (root, args) => {
      const filteredLinks = links.filter((link) => link.id === args.id);
      return filteredLinks[0];
    }
  },
  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link);
      return link;
    },
    updateLink: (root, args) => {
      const updatedLinks = []
      links.forEach((link) => {
        if (link.id === args.id) {
          link.description = args.description
          link.url = args.url
          updatedLinks.push(link);
        }
      })
      return updatedLinks[0];
    },
    deleteLink: (root, args) => {
      const rejectedLinks = [];
      links = links.filter((link) => {
        if(link.id === args.id) {
          rejectedLinks.push(link);
        }
        return link.id !== args.id;
      })
      return rejectedLinks[0];
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))