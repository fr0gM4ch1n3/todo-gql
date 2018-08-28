import { PubSub } from 'graphql-subscriptions';
import { Todo } from './todo.model';

const pubsub = new PubSub();

const TODO_ADDED = 'TODO_ADDED';
const TODO_UPDATED = 'TODO_UPDATED';
const TODO_DELETED = 'TODO_DELETED';

export class TodoNotFoundError extends Error {
  code = 1;
  message: string = this.message ||
    'Todo not found';
}

const todos: Todo[] = [];

export default {
  Query: {
    todo: (_: any, { id }: { id: string }) => Promise.resolve(todos.find(todo => todo.id === id)),
    todos: (_: any, { ids }: { ids: string[] }): Promise<any[]> =>
      ids ? Promise.resolve(todos.filter(todo => ids.indexOf(todo.id) > -1)) : Promise.resolve(todos)
  },
  Mutation: {
    addTodo: (_: any, args: { title?: string, completed?: boolean }) => {
      const newTodo = new Todo(args);
      todos.push(newTodo);
      pubsub.publish(TODO_ADDED, { todoAdded: newTodo });
      return newTodo;
    },
    updateTodo: (_: any, args: { id: string, title?: string, completed?: boolean }) => {
      const todo = todos.find(todo => todo.id === args.id);
      if (!todo) {
        throw new TodoNotFoundError();
      }
      const updatedTodo = Object.assign(todo, args);
      pubsub.publish(TODO_UPDATED, { todoUpdated: updatedTodo });
      return updatedTodo;
    },
    deleteTodo: (_: any, args: { id: string }) => {
      let todo: Todo;
      for (let index = todos.length - 1; index >= 0; index--) {
        if (todos[index].id === args.id) {
          todo = todos.splice(index, 1)[0];
        }
      }
      if (!todo) {
        throw new TodoNotFoundError();
      }
      pubsub.publish(TODO_DELETED, { todoDeleted: todo });
      return todo;
    }
  },
  Subscription: {
    todoAdded: {
      subscribe: () => pubsub.asyncIterator(TODO_ADDED)
    },
    todoUpdated: {
      subscribe: () => pubsub.asyncIterator(TODO_UPDATED)
    },
    todoDeleted: {
      subscribe: () => pubsub.asyncIterator(TODO_DELETED)
    }
  }
};
