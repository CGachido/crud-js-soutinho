const BASE_URL = "http://localhost:3000";

describe("/ - Todos feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });
  it("when create a new todo, it must appears in the screen", () => {
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "04aac5d7-5ae9-4c30-bbdb-02670a542155",
            date: "2023-08-20T01:36:56.944Z",
            content: "digitar alguma coisa",
            done: false,
          },
        },
      });
    }).as("createTodo");
    cy.visit(BASE_URL);
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("digitar alguma coisa");
    const buttonAddTodo = "[aria-label='Adicionar novo item']";
    cy.get(buttonAddTodo).click();
    cy.get("table > tbody").contains("digitar alguma coisa");
  });
});
