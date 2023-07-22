import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";
import { todoRepository } from "@server/repository/todo";

async function get(request: NextApiRequest, response: NextApiResponse) {
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
  const output = await todoRepository.get({
    page,
    limit,
  });
  response.status(200).json(output);
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});
async function create(request: NextApiRequest, response: NextApiResponse) {
  const body = TodoCreateBodySchema.safeParse(request.body);
  if (!body.success) {
    response.status(400).json({
      error: {
        message: "You need to provide a content to create a TODO",
        description: body.error.issues,
      },
    });
    return;
  }
  const createdTodo = await todoRepository.createByContent(body.data.content);
  response.status(201).json({
    todo: createdTodo,
  });
}

export const todoController = {
  get,
  create,
};
