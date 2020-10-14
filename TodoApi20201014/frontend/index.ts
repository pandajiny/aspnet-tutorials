interface TodoItem {
  // id only exist result
  Id?: number;
  Content: string;
  IsComplete: boolean;
}

let todoItems: TodoItem[] = [];

const baseUrl = new URL("https://localhost:5001/api/TodoItems/").href;
const URL_GET_TODOITEMS = new URL("https://localhost:5001/api/TodoItems/").href;
const URL_POST_TODO = new URL("https://localhost:5001/api/TodoItems/").href;

const getTodoItems = async (): Promise<TodoItem[]> => {
  console.log("get todoItems");
  const url = baseUrl;
  const result = await fetch(url, {
    method: "GET",
  });
  const data = ((await result.json()) as unknown) as TodoItem[];
  todoItems = data;
  console.log("todoItems :", data);
  return data;
};

const addTodoItem = async () => {
  console.log("adding todo");
  const content = $content.value;
  const todoItem: TodoItem = {
    Content: content,
    IsComplete: false,
  };
  $content.value = "";

  const result = await fetch(URL_POST_TODO, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoItem),
  });
  const data = await result.json();
  console.log("result from server :", data);
  console.log("succesfully add todoItem");
  updateTodolist();
};

const deleteTodoItem = async (id: number) => {
  console.log("delete todo with :" + id);
  const url = baseUrl + id;
  const result = await fetch(url, {
    method: "DELETE",
  });
  const data = ((await result.json()) as unknown) as TodoItem;
  console.log("successfully deleted todoItem", data);
  updateTodolist();
};

const toggleIsComplete = async (id: number) => {
  console.log("update todo Item id" + id);
  const todoItem = todoItems.find((t) => t.Id == id);
  todoItem.IsComplete = !todoItem.IsComplete;
  const url = baseUrl;
  console.log(todoItem);
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoItem),
  });
  console.log("update todoItem done");

  updateTodolist();
};

const $content = document.getElementById("content") as HTMLInputElement;
$content.addEventListener("keyup", (ev: KeyboardEvent) => {
  if (ev.key == "Enter") {
    addTodoItem();
  }
});

const $submit = document.getElementById("submit") as HTMLButtonElement;
$submit.addEventListener("click", addTodoItem);

const $todolist = document.getElementById("todolist") as HTMLDivElement;

const updateTodolist = async () => {
  $todolist.innerHTML = "";

  const todoItems = await getTodoItems();
  todoItems.map((todoItem) => {
    const $todo = document.createElement("div");
    $todo.id = "todo";
    if (todoItem.IsComplete) {
      $todo.className += " done";
    }

    const $content = document.createElement("p");
    $content.appendChild(document.createTextNode(todoItem.Content));

    const $deleteButton = document.createElement("button");
    $deleteButton.appendChild(document.createTextNode("❌"));
    $deleteButton.addEventListener("click", () => {
      deleteTodoItem(todoItem.Id);
    });

    $todo.appendChild($content);
    $todo.appendChild($deleteButton);
    $todo.addEventListener("click", () => {
      toggleIsComplete(todoItem.Id);
    });

    $todolist.appendChild($todo);
  });
};

updateTodolist();
