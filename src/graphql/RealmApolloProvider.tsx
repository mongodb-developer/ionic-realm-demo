import { useState, useEffect } from "react";
import { useRealmApp } from "../Realm";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import * as Realm from "realm-web";

const createRealmApolloClient = (app: Partial<Realm.App>) => {
  const fetchWithHeaders = async (uri: string, options: RequestInit) => {
    if (!app.currentUser) {
      throw new Error(`Must be logged in to use the GraphQL API`);
    }
    await app.currentUser.refreshCustomData();
    const myHeaders = new Headers({
      Authorization: `Bearer ${app.currentUser.accessToken}`,
    });
    options.headers = myHeaders;
    return fetch(uri, options);
  };

  const cache = new InMemoryCache();
  const link = new HttpLink({
    uri: `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`,
    fetch: fetchWithHeaders,
  });
  return new ApolloClient({ link, cache });
};

export default function RealmApolloProvider({ children }: {children: JSX.Element}) {
  const app = useRealmApp();
  const [client, setClient] = useState(createRealmApolloClient(app));
  useEffect(() => {
    setClient(createRealmApolloClient(app));
  }, [app]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
