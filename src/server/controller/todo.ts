import { NextApiRequest, NextApiResponse } from "next";
import { read } from "@db-crud-todo";

function get(_: NextApiRequest, response: NextApiResponse) {
  const ALL_TODOS = read();
  response.status(200).json({
    todos: ALL_TODOS,
  });
}

export const todoController = {
  get,
};
