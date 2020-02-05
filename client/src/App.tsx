import React from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import { ApolloProvider } from "@apollo/react-hooks";

import TodoList from "./components/hello-world";
import Login from "./components/login";
import LocaleStorage from "./components/localstorage";
import { ApolloLink, Observable, split } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { getMainDefinition } from "apollo-utilities";
import WSConnect from "./components/ws-connect";

const cache = new InMemoryCache({});

const request = (operation: any) => {
  const token = window.localStorage.getItem("token");
  operation.setContext({
    headers: {
      "auth-token": token
    }
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((oper) => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const httpLink = new HttpLink({
  uri: "http://localhost:4000"
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      token: "token"
    }
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    requestLink,
    withClientState({
      defaults: {
        isConnected: true
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_: any, { isConnected }: any, { cache }: any) => {
            cache.writeData({ data: { isConnected } });
            return null;
          }
        }
      },
      cache
    }),
    link
  ]),
  cache: cache
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <TodoList />
        <Login />
        <LocaleStorage />
        <WSConnect />
      </div>
    </ApolloProvider>
  );
};

export default App;
