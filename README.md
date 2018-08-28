http://localhost:4001/graphiql?query=query%20getTodos%20%7B%0A%20%20todos%20%7B%0A%20%20%20%20id%0A%20%20%20%20title%0A%20%20%20%20completed%0A%20%20%7D%0A%7D%0A%0A%0Amutation%20newTodo%20%7B%0A%20%20addTodo(%0A%20%20%09title%3A%20%22test%22%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20title%0A%20%20%20%20completed%0A%20%20%7D%0A%7D%0A%0Amutation%20updateTodo%20%7B%0A%20%20updateTodo(%0A%20%20%20%20id%3A%20%22cb753e87-e8c3-4601-afce-39a596c3d957%22%2C%0A%20%20%09title%3A%20%22test88%22%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20title%0A%20%20%20%20completed%0A%20%20%7D%0A%7D%0A%0Amutation%20deleteTodo%20%7B%0A%20%20deleteTodo(%0A%20%20%20%20id%3A%20%226763a72d-a66d-4640-a90c-4005f913d7f8%22%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20title%0A%20%20%20%20completed%0A%20%20%7D%0A%7D&operationName=getTodos




```
query getTodos {
  todos {
    id
    title
    completed
  }
}


mutation newTodo {
  addTodo(
  	title: "test"
  ) {
    id
    title
    completed
  }
}

mutation updateTodo {
  updateTodo(
    id: "cb753e87-e8c3-4601-afce-39a596c3d957",
  	title: "test88"
  ) {
    id
    title
    completed
  }
}

mutation deleteTodo {
  deleteTodo(
    id: "6763a72d-a66d-4640-a90c-4005f913d7f8"
  ) {
    id
    title
    completed
  }
}
```
