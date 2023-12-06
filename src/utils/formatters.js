/**
 * YouTube: TrungQuanDev - Một Lập Trình Viên
 * Created by trungquandev.com's author on Jun 28, 2023
 */
/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// Fix bug empty column
// Phía FE tự tạo ra 1 card đặc biệt: Placeholder Card, không liên quan đến BE
// Card đặc biệt này sẽ được ẩn ở giao diện UI
// Cấu trúc Id của cái card này để Unique đơn giản, không cần random phức tạp
// "columnId-placeholder-card" (mỗi column chỉ có thể có tối đa một cái Placehoder Card)
// Quan trọng khi tạo: phải đầy đủ: (_id, boardId, columnId,FE_PlaceholderCard)
// Về cách tạo chuẩn ở bước nào thì sẽ học ở phần tích hợp API BE vào dự án
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columId: column._id,
    FE_PlaceholderCard: true
  }
}