import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_VISIBILITY_FILTER = gql`
  {
    hello @client
  }
`;

interface LocaleStorageResp {
  hello: string;
}

export default function LocaleStorage() {
  const { data, client } = useQuery<LocaleStorageResp>(GET_VISIBILITY_FILTER);
  return (
    <div>
      {data && data.hello}
      <button onClick={() => client.writeData({ data: { hello: "asdf" } })}>按钮</button>
    </div>
  );
}
