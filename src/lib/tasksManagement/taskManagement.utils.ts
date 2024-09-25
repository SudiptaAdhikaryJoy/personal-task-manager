import { endPoints } from "@/utils/api/route";
import { postMethod } from "@/utils/api/postMethod";
import { getMethod } from "@/utils/api/getMethod";
import { putMethod } from "@/utils/api/putMethod";
import { deleteMethod } from "@/utils/api/deleteMethod";

export const getTasks = async () => {
    const response = await getMethod(endPoints.todoTasks.getTasks)
    return response.data;
  }

export const createTasks = async (title: string) => {
    const response = await postMethod({ route: endPoints.todoTasks.createTasks, postData: { title, completed: false } })
    return response.data; 
}

export const updateTasks = async (id: number, completed: boolean) => {
    const response = await putMethod({ route: endPoints.todoTasks.updateTasks(id), updateData: { completed } })
    return response.data; 
}

export const removeTasks = async (id: number) => {
    const response = await deleteMethod({ route: endPoints.todoTasks.removeTasks(id), deleteData: {} })
    return response.data; 
}