import React from "react";
import HelloWorld, { HELLO_WORLD } from "./hello-world";
import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";

const mocks = [
  {
    request: {
      query: HELLO_WORLD
    },
    result: {
      data: {
        hello: "hey undefined"
      }
    }
  }
];

it("should render without error", () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <HelloWorld />
    </MockedProvider>
  );
});
