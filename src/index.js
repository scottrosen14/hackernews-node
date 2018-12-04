const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
  Query: {
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info);
    }
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description
        }
      }, info)
    },
    updateLink: (root, args, context, info) => {
      return context.db.mutation.updateLink({
        data: {
          url: args.url,
          description: args.description
        },
        where: {
          id: args.id
        }
      });
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
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/scott-rosen-0dd862/database/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  })
})
server.start(() => console.log(`Server is running on http://localhost:4000`))