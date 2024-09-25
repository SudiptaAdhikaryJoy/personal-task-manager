import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTasks, createTasks, updateTasks, removeTasks } from "@/lib/tasksManagement/taskManagement.utils";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error?: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string | number) => Promise<void>;
  removeTask: (id: string | number) => Promise<void>;
  removeSelectedTasks: (ids: string[]) => Promise<void>;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,
      fetchTasks: async () => {
        set({ loading: true });
        try {
          const tasks = await getTasks();
          console.log("tasks", tasks);
          
          set({ tasks, loading: false, error: null });
        } catch (error) {
          set({ error: "data fetching tasks failed", loading: false });
        }
      },
      addTask: async (title) => {
        set({ loading: true });
        try {
          const newTask = await createTasks(title);
          set((state) => ({
            tasks: [newTask, ...state.tasks],
            loading: false,
            error: null,
          }));
        } catch (error) {
          set({ error: "data creating task failed", loading: false });
        }
      },
      toggleTask: async (id) => {
        set({ loading: true });
        try {
          const task = get().tasks.find((t) => t.id === id);
          if (task) {
            await updateTasks(id, !task.completed);
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
              ),
              loading: false,
              error: null,
            }));
          }
        } catch (error) {
          set({ error: "Error updating task", loading: false });
        }
      },
      removeTask: async (id) => {
        set({ loading: true });
        try {
          await removeTasks(id);
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            loading: false,
            error: null,
          }));
        } catch (error) {
          set({ error: "Error deleting task", loading: false });
        }
      },
      removeSelectedTasks: async (ids) => {
        set({ loading: true });
        try {
          await Promise.all(ids.map((id) => removeTasks(id)));
          set((state) => ({
            tasks: state.tasks.filter((task) => !ids.includes(task.id)),
            loading: false,
            error: null,
          }));
        } catch (error) {
          set({ error: "Error deleting selected tasks", loading: false });
        }
      },
    }),
    {
      name: "task-storage",
    }
  )
);
