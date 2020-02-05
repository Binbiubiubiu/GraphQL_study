import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const LOGIN_MUTATION = gql`
  mutation login($userInfo: UserInfo!) {
    login(userInfo: $userInfo)
  }
`;

interface LoginVariable {
  userInfo: {
    username: string;
    password: string;
    age: number;
  };
}

interface LoginRepo {
  username: string;
  password: string;
  age: number;
}

export default function Login() {
  const [loginAction, { data }] = useMutation<LoginRepo, LoginVariable>(LOGIN_MUTATION, {
    variables: {
      userInfo: { username: "Simon-Bin", password: "123456", age: 12 }
    }
  });

  console.log(data);

  return (
    <div>
      <button
        onClick={() => {
          loginAction();
        }}>
        login
      </button>
    </div>
  );
}
