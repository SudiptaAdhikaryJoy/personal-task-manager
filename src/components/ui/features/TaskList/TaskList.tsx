"use client";
import React, { useState, useEffect } from "react";
import { Button, Checkbox, Spinner, Input, Table, TableHeader,TableBody,TableColumn, TableRow, TableCell} from "@nextui-org/react";
import { useTaskStore } from "@/_store/task-management/personalTaskManager/taskManager.store";

const TaskList = () => {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    removeTask,
    removeSelectedTasks,
  } = useTaskStore();
  
  const [newTask, setNewTask] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  console.log("newTask", newTask);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask(newTask.trim());
      setNewTask("");
    }
  };

  const handleToggleTask = (id: string) => {
    toggleTask(id);
  };

  const handleDeleteSelected = async () => {
    if (selectedTasks.length > 0) {
      await removeSelectedTasks(selectedTasks);
      setSelectedTasks([]); // Clear the selected tasks after deletion
    }
  };

  const handleTaskSelect = (id: string) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((taskId) => taskId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="flex mb-4 justify-center items-center pb-5">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="flex-grow my-2  px-5 py-8"
        />
        <Button onClick={handleAddTask} disabled={loading}>
          Add
        </Button>
      </div>
      <div className="flex justify-center items-center font-semibold text-xl">Total Tasks: {tasks.length}</div>

      {loading ? (
        <div className="flex justify-center items-center fixed inset-0">
          <Spinner color="warning" label="Loading..." />
        </div>
      ) : error ? (
        <p color="error">{error}</p>
      ) : (
        <>
          {/* Task Table */}
          <Table
            aria-label="Tasks Table"
            selectionMode="multiple"
            selectedKeys={selectedTasks}
            onSelectionChange={(keys) => setSelectedTasks([...keys])}
            css={{ minWidth: "100%" }}
          >
            <TableHeader>
              <TableColumn>Completed</TableColumn>
              <TableColumn>Title</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      isSelected={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <p
                      className={`${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="danger"
                      onClick={() => removeTask(task.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Multiple Delete Button */}
          {selectedTasks.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                color="danger"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
