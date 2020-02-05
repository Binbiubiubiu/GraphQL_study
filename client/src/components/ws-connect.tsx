import React from "react";
import gql from "graphql-tag";
import { useSubscription } from "@apollo/react-hooks";

const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    newUser {
      id
      username
      firstLetterOfUsername
    }
  }
`;

export default function WSConnect() {
  const { data, loading } = useSubscription(COMMENTS_SUBSCRIPTION);
  console.log(data);

  return <div>{JSON.stringify(data && data.newUser ? data.newUser : "")}</div>;
}
