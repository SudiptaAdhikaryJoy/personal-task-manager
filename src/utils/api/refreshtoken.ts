import axios, { AxiosResponse } from "axios";
import { endPoints } from "@/utils/api/route";
interface RefreshTokenResponse {
    statusCode: number
    data: {
      strAccess_token: string
      access_token_expiresIn: string
      strRefresh_token: string
      refresh_token_expiresIn: string
    }
  }
  
 export  async function reFreshToken(refreshToken: string): Promise<{
    newaccessToken: string
    newAccesstokenExpiresin: string
    newrefreshToken: string
    newRefreshTokenExpiresIn: string
  }> {
    try {
      const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endPoints.auth.refresh}`,
        { refresh: refreshToken },
      )
  
      const responseData = response.data
      if (responseData.statusCode === 200) {
        const newAccessToken = responseData?.data?.strAccess_token
        const newRefreshToken = responseData?.data?.strRefresh_token
        const newaccessTokenExpiresIn = responseData?.data?.access_token_expiresIn
        const newrefreshTokenExpiresIn = responseData?.data?.refresh_token_expiresIn
        return {
          newaccessToken: newAccessToken,
          newrefreshToken: newRefreshToken,
          newAccesstokenExpiresin: newaccessTokenExpiresIn,
          newRefreshTokenExpiresIn: newrefreshTokenExpiresIn,
        }
      } else {
        throw new Error('Failed to refresh token: Invalid response')
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw new Error('Failed to refresh token')
    }
  }