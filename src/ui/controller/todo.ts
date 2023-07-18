async function get() {
  return fetch("/api/todos").then(async (response) => {
    const todosString = await response.text();
    const todosData = JSON.parse(todosString).todos;
    return todosData;
  });
}

export const todoController = {
  get,
};
