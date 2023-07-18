import { NextApiRequest, NextApiResponse } from "next";
import { todoRepository } from "@server/repository/todo";

function get(request: NextApiRequest, response: NextApiResponse) {
  const query = request.query;
  const page = Number(query.page);
  const limit = Number(query.limit);
  if (query.page && isNaN(page)) {
    response.status(400).json({
      error: {
        message: "`Page` must be a number.",
      },
    });
  }
  if (query.limit && isNaN(limit)) {
    response.status(400).json({
      error: {
        message: "`Limit` must be a number.",
      },
    });
  }
  const output = todoRepository.get({
    page,
    limit,
  });
  response.status(200).json(output);
}

export const todoController = {
  get,
};
