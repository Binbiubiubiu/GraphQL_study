import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const HELLO_WORLD = gql`
  {
    hello
  }
`;

export default function HelloWorld() {
  const { loading, error, data, refetch, networkStatus } = useQuery<string>(HELLO_WORLD, {
    skip: false,
    notifyOnNetworkStatusChange: true
  });
  if (networkStatus === 4) return <p>Refetching!</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      <p>{JSON.stringify(data)}</p>
      <button onClick={() => refetch()}>Refetch!</button>
    </div>
  );
}
