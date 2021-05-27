import { createEvent, createStore } from 'effector';

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

export default createStore<Store>({
  todos: [],
  newTodo: '',
})
  .on(setNewTodo, (state, newTodo) => ({
    ...state,
    newTodo,
  }))
  .on(addTodo, (state, newTodo) => ({
    newTodo: '',
    todos: addTodoList(state.todos, state.newTodo),
  }));
