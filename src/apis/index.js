import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/*
  * Tất cả function bên dưới không có catch lỗi vì phía FE ta không cần thiết làm như vậy đối với mọi request bởi nó sẽ gây ra thừa code catch lỗi.
  * Giải pháp: ta sẽ catch lỗi tập trung tại 1 nơi bằng Interceptors
  * Interceptors là cách mà ta sẽ đánh chặn vào giữa request hoặc response để xử lý logic mà ta muốn
  * ==> Học trong phần nâng cao

*/

/** Boards */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios sẽ trả về kết quả thông qua property data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

/** Columns */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

/** Cards */
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}