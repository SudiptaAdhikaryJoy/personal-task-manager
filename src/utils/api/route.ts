export const endPoints = {
  auth: {
    sendOtp: "/auth/sendOtp",
    verifyOtp: "/auth/verifyOtp",
    register: "/auth/register",
    login: "/auth/login",
    updatePassword: "/auth/update-password",
    logout: "/auth/logout",
    registerOrg: "auth/registerOrg",
    refresh: "/auth/refresh",
  },
  todoTasks: {
    getTasks: '/todos',
    createTasks: '/todos',
    updateTasks: (id: number)=> `/todos/${id}`,
    removeTasks: (id: number)=> `/todos/${id}`,
  }
};
