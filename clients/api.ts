import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(
process.env.NEXT_PUBLIC_API_URL as string || 'http://localhost:4000/graphql',
  {
    headers: () => {
      const token = isClient ? localStorage.getItem("__twitter_token") : "";
      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
  }
);