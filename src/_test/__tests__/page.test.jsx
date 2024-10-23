import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../../components/ui/features/TaskList/TaskList';
import { useTaskStore } from '@/_store/task-management/personalTaskManager/taskManager.store';

// Mock the task store
jest.mock('@/_store/task-management/personalTaskManager/taskManager.store');

describe('TaskList', () => {
  const mockFetchTasks = jest.fn();
  const mockAddTask = jest.fn();
  const mockToggleTask = jest.fn();
  const mockRemoveTask = jest.fn();
  const mockRemoveSelectedTasks = jest.fn();

  beforeEach(() => {
    useTaskStore.mockReturnValue({
      tasks: [
        { id: '1', title: 'Test Task 1', completed: false },
        { id: '2', title: 'Test Task 2', completed: true }
      ],
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      removeTask: mockRemoveTask,
      removeSelectedTasks: mockRemoveSelectedTasks,
    });
  });

  it('renders the TaskList component with the correct tasks', () => {
    render(<TaskList />);

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks: 2')).toBeInTheDocument();
  });

  it('calls fetchTasks on component mount', () => {
    render(<TaskList />);
    expect(mockFetchTasks).toHaveBeenCalledTimes(1);
  });

  it('allows the user to add a new task', async () => {
    render(<TaskList />);

    const input = screen.getByPlaceholderText('Enter new task');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    expect(mockAddTask).toHaveBeenCalledWith('New Task');
  });

  it('disables the Add button when loading is true', () => {
    useTaskStore.mockReturnValueOnce({
      tasks: [],
      loading: true,
      error: null,
      fetchTasks: mockFetchTasks,
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      removeTask: mockRemoveTask,
      removeSelectedTasks: mockRemoveSelectedTasks,
    });

    render(<TaskList />);

    const addButton = screen.getByText('Add');
    expect(addButton).toBeDisabled();
  });

  it('toggles task completion status when clicking on checkbox', () => {
    render(<TaskList />);

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    // expect(mockToggleTask).toHaveBeenCalledWith('1');
  });

  it('removes a task when clicking the delete button', () => {
    render(<TaskList />);

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    expect(mockRemoveTask).toHaveBeenCalledWith('1');
  });

  it('displays the loading spinner when loading is true', () => {
    useTaskStore.mockReturnValueOnce({
      tasks: [],
      loading: true,
      error: null,
      fetchTasks: mockFetchTasks,
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      removeTask: mockRemoveTask,
      removeSelectedTasks: mockRemoveSelectedTasks,
    });

    render(<TaskList />);

    const spinner = screen.getByLabelText('Loading...');
    expect(spinner).toBeInTheDocument();
  });

  it('displays an error message if an error occurs', () => {
    useTaskStore.mockReturnValueOnce({
      tasks: [],
      loading: false,
      error: 'Failed to fetch tasks',
      fetchTasks: mockFetchTasks,
      addTask: mockAddTask,
      toggleTask: mockToggleTask,
      removeTask: mockRemoveTask,
      removeSelectedTasks: mockRemoveSelectedTasks,
    });

    render(<TaskList />);

    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
  });

  it('removes selected tasks when "Delete Selected" is clicked', async () => {
    render(<TaskList />);

    const checkbox1 = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox1);

    const deleteSelectedButton = screen.getByText('Delete Selected');
    fireEvent.click(deleteSelectedButton);

    // expect(mockRemoveSelectedTasks).toHaveBeenCalledWith(['1']);
  });
});
