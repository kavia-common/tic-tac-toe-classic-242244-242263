import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Tic Tac Toe title", () => {
  render(<App />);
  const title = screen.getByRole("heading", { name: /tic tac toe/i });
  expect(title).toBeInTheDocument();
});

test("renders New game button", () => {
  render(<App />);
  const btn = screen.getByRole("button", { name: /new game/i });
  expect(btn).toBeInTheDocument();
});
