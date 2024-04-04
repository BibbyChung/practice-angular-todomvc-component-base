import { combineLatest, map, of, shareReplay, switchMap, take, tap } from "rxjs";
import { getBehaviorSubject, getUUID } from "../common/utils";

export type todosFilterType = "all" | "active" | "completed";

export type todoType = {
  id: string;
  title: string;
  completed: boolean;
};

const todos: todoType[] = [
  {
    id: "f33f9cd8-4941-4535-bef9-06200b918541",
    title: "abc",
    completed: false
  }
];

const todosFilter$ = getBehaviorSubject<todosFilterType>("all");
export const setTodosFilter = (ff: todosFilterType) => todosFilter$.next(ff);
export const getTodosFilter = () => todosFilter$.asObservable();

const todos$ = getBehaviorSubject<todoType[]>(todos);
export const getTodos = () =>
  getTodosFilter().pipe(
    switchMap((f) => combineLatest([todos$, of(f)])),
    map(([todos, f]) => {
      switch (f) {
        case "active":
          return todos.filter((a) => !a.completed);
        case "completed":
          return todos.filter((a) => a.completed);
        default:
          return todos;
      }
    }),
    shareReplay(1)
  );
export const addTodo = (title: string) => {
  const todo = {
    title,
    id: getUUID(),
    completed: false
  };

  const todos = todos$.value;
  todos.push(todo);
  todos$.next(todos);
};
export const delTodo = (id: string) => {
  const todos = todos$.value;
  const newTodos = todos.filter((a) => a.id !== id);
  todos$.next(newTodos);
};
export const updateTodo = (todo: todoType) => {
  const todos = todos$.value;
  const updatedItem = todos.find((a) => a.id === todo.id);
  if (updatedItem) {
    Object.assign(updatedItem, todo);
  }
  todos$.next(todos);
};
export const setAllTodosCompleted = (isCompleted: boolean) =>
  getTodos().pipe(
    take(1),
    tap((todos) => {
      todos.forEach((a) => (a.completed = isCompleted));
      todos$.next(todos);
    })
  );
export const removeAllTodosCompleted = () =>
  getTodos().pipe(
    take(1),
    tap((todos) => {
      const newTodos = todos.filter((a) => !a.completed);
      todos$.next(newTodos);
    })
  );
