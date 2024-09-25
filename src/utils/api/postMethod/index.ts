'use client'
import { apiSetup } from '../api'

type Props = {
  route: string
  postData: string | number | boolean | object | []
}

export const postMethod = async ({ route, postData }: Props) => {
  try {
    const api = apiSetup()
    const response = await (await api).post(route, postData)
    return response
  } catch (error) {
    throw error
  }
}
