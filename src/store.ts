import { createEvent, createStore } from 'effector';
import { idText } from 'typescript';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export const updateTodo = (todos: Todo[], id: number, text: string): Todo[] =>
  todos.map((todo) => ({
    ...todo,
    text: todo.id === id ? text : todo.text,
  }));

export const toggleTodo = (todos: Todo[], id: number): Todo[] =>
  todos.map((todo) => ({
    ...todo,
    done: todo.id === id ? !todo.done : todo.done,
  }));

export const removeTodo = (todos: Todo[], id: number): Todo[] =>
  todos.filter((todo) => todo.id !== id);

export const addTodoList = (todos: Todo[], text: string): Todo[] => [
  ...todos,

  {
    id: Math.max(0, Math.max(...todos.map(({ id }) => id))) + 1,
    text,
    done: false,
  },
];

//effector state
type Store = {
  todos: Todo[];
  newTodo: string;
};

export const setNewTodo = createEvent<string>();
export const addTodo = createEvent();
export const update = createEvent<{ id: number; text: string }>();
export const toggle = createEvent<number>();
export const remove = createEvent<number>();

export default createStore<Store>({
  todos: [],
  newTodo: '',
})
  .on(setNewTodo, (state, newTodo) => ({
    ...state,
    newTodo,
  }))
  .on(addTodo, (state, newTodo) => ({
    ...state,
    todos: addTodoList(state.todos, state.newTodo),
  }))
  .on(update, (state, { id, text }) => ({
    ...state,
    todos: updateTodo(state.todos, id, text),
  }))
  .on(toggle, (state, id) => ({
    ...state,
    newTodo: '',
    todos: toggleTodo(state.todos, id),
  }))
  .on(remove, (state, id) => ({
    ...state,
    todos: removeTodo(state.todos, id),
  }));
