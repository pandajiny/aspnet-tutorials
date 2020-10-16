interface TodoItem {
  // id only exist result
  Id?: number;
  Content: string;
  IsComplete: boolean;
  ParentId?: number;
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

const addTodoItem = async (content: string, parentId?: number) => {
  console.log("adding todo");
  const todoItem: TodoItem = {
    Content: content,
    IsComplete: false,
    ParentId: parentId || null,
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
    addTodoItem($content.value).then(() => {
      $content.value = "";
    });
  }
});

const $submit = document.getElementById("submit") as HTMLButtonElement;
$submit.addEventListener("click", () => {
  addTodoItem($content.value).then(() => {
    $content.value = "";
  });
});

const $todolist = document.getElementById("todolist") as HTMLDivElement;

const updateTodolist = async () => {
  $todolist.innerHTML = "";

  const todoItems = await getTodoItems();
  todoItems
    .filter((todoItem) => todoItem.ParentId == null)
    .map((todoItem) => {
      const $todo = $createTodoItem(todoItem);
      $todolist.appendChild($todo);
    });
};

const $createTodoItem = (todoItem: TodoItem): HTMLDivElement => {
  const $todo = document.createElement("div");
  $todo.id = `todo-${todoItem.Id}`;
  $todo.className = "todo";
  if (todoItem.IsComplete) {
    $todo.className += " done";
  }

  // main
  const $main = document.createElement("div");
  $main.id = "main";

  $main.addEventListener("mouseover", () => {
    const $addForm = document
      .getElementById(`todo-${todoItem.Id}`)
      .querySelector("#add-child-form");

    if ($addForm.className == "unactive") {
      $addForm.className = "active";
    }
  });

  $main.addEventListener("mouseleave", () => {
    const $addForm = document
      .getElementById(`todo-${todoItem.Id}`)
      .querySelector("#add-child-form");
    if ($addForm.className == "active") {
      $addForm.className = "unactive";
    }
  });

  // main-container
  const $container = document.createElement("div");
  $container.id = "container";

  // main-container-content
  const $content = document.createElement("p");
  $content.appendChild(document.createTextNode("• " + todoItem.Content));

  $content.addEventListener("click", () => {
    toggleIsComplete(todoItem.Id);
  });

  // main-container-deleteButton
  const $deleteButton = document.createElement("button");
  $deleteButton.appendChild(document.createTextNode("❌"));
  $deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoItem.Id);
  });

  $container.appendChild($content);
  $container.appendChild($deleteButton);

  $main.appendChild($container);

  // main-addChildForm
  const $addChildForm = document.createElement("div");
  $addChildForm.id = "add-child-form";
  $addChildForm.className = "unactive";

  const $addChildInput = document.createElement("input");
  $addChildInput.placeholder = "...adding relative todo";
  $addChildInput.addEventListener("focus", () => {
    $addChildForm.className = "focused";
  });
  $addChildInput.addEventListener("blur", () => {
    if ($addChildInput.value == "") {
      $addChildForm.className = "unactive";
    }
  });
  $addChildInput.addEventListener("keypress", (ev: KeyboardEvent) => {
    if (ev.key == "Enter") {
      addTodoItem($addChildInput.value, todoItem.Id).then(() => {
        $addChildInput.value = "";
      });
    }
  });

  const $addChildSubmit = document.createElement("button");
  $addChildSubmit.appendChild(document.createTextNode("✅"));
  $addChildSubmit.onclick = () => {
    addTodoItem($addChildInput.value, todoItem.Id).then(() => {
      $addChildInput.value = "";
    });
  };

  $addChildForm.appendChild($addChildInput);
  $addChildForm.appendChild($addChildSubmit);

  $main.appendChild($addChildForm);

  $todo.appendChild($main);

  // child list
  const $childs = document.createElement("div");
  $childs.id = "childs";

  const childList = todoItems.filter((t) => t.ParentId == todoItem.Id);
  childList
    .map((childItem) => {
      return $createTodoItem(childItem);
    })
    .map(($childItem) => {
      $childs.appendChild($childItem);
    });

  $todo.appendChild($childs);

  return $todo;
};

updateTodolist();
