import React, { useEffect, useRef, useState } from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

const bg = "/bg.avif";

interface HomeTodo {
  id: string;
  content: string;
  done: boolean;
}

function HomePage() {
  const [newTodoContent, setNewTodoContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadComplete = useRef(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [todos, setTodos] = useState<HomeTodo[]>([]);

  const homeTodos = todoController.filterTodosByContent<HomeTodo>(
    todos,
    search
  );

  const hasMorePage = totalPages > page;
  const hasNoTodos = homeTodos.length === 0 && !isLoading;

  useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  return (
    <main>
      <GlobalStyles />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            todoController.create({
              content: newTodoContent,
              onSuccess(todo: HomeTodo) {
                setTodos((oldTodos) => {
                  return [todo, ...oldTodos];
                });
                setNewTodoContent("");
              },

              onError() {
                alert("Necessário preencher a todo.");
              },
            });
          }}
        >
          <input
            value={newTodoContent}
            onChange={function newTodoHandler(event) {
              setNewTodoContent(event.target.value);
            }}
            type="text"
            placeholder="Correr, Estudar..."
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={function handleSearch(event) {
              setSearch(event.target.value);
            }}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {homeTodos.map((currentTodo) => {
              return (
                <tr key={currentTodo.id}>
                  <td>
                    <input
                      onChange={function handleToggle() {
                        todoController.toggleDone({
                          id: currentTodo.id,
                          onError() {
                            alert("Falha ao atualizar a TODO");
                          },
                          updateTodoOnScreen() {
                            setTodos((currentTodos) => {
                              return currentTodos.map((todo) => {
                                if (todo.id === currentTodo.id) {
                                  return { ...todo, done: !todo.done };
                                }
                                return todo;
                              });
                            });
                          },
                        });
                      }}
                      checked={currentTodo.done}
                      type="checkbox"
                    />
                  </td>
                  <td>{currentTodo.id.substring(0, 4)}</td>
                  <td>
                    {!currentTodo.done && currentTodo.content}
                    {currentTodo.done && <s>{currentTodo.content}</s>}
                  </td>
                  <td align="right">
                    <button
                      onClick={function handleClick() {
                        todoController
                          .deleteById(currentTodo.id)
                          .then(() => {
                            setTodos((currentTodos) => {
                              return currentTodos.filter(
                                (todo) => todo.id !== currentTodo.id
                              );
                            });
                          })
                          .catch(() => {
                            console.error("Failed to delete");
                          });
                      }}
                      data-type="delete"
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              );
            })}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePage && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);

                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                          setTotalPages(pages);
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    Página {page}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default HomePage;
