import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '~/pages/Boards/BoardBar/BoardBar'
import BoardContent from '~/pages/Boards/BoardContent/BoardContent'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Tạm thời fix cứng boardId, flow chuẩn thì ta sử dụng react-router-dom để lấy boardId từ URL về
    const boardId = '657ea13a8c298156be483be5'
    //Call API
    fetchBoardDetailsAPI(boardId).then(board => {
      // Xử lý cột trống vừa mới F5 chưa có PlaceHolderCard ==> không kéo qua đc
      board.columns.forEach(c => {
        if (isEmpty(c.cards)) {
          c.cards = [generatePlaceholderCard(c)]
          c.cardOrderIds = [generatePlaceholderCard(c)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  // function gọi API tạo mới column và cập nhật dl state board
  const createNewColumn = async (newColumnData) => {
    // Gọi API tạo column
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Xử lý cột trống vừa mới taọ chưa có PlaceHolderCard ==> không kéo qua đc
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật state board
    // Phía FE ta tự làm đúng lại state board thay vì phải gọi lại api fetchBoardDetailsAPI
    // Lưu ý: cách làm này phụ thuộc vào đặc thù dự án, có nơi thì BE hỗ trợ trả về toàn bộ Board dù có là tạo mới column hay card
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  // function gọi API tạo mới card và cập nhật dl state board
  const createNewCard = async (newCardData) => {
    // Gọi API tạo card
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(c => c._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  const moveColumns = async (dndOrderedColumns) => {
    // Update dl để set state Board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumns.map(c => c._id)
    setBoard(newBoard)

    // Gọi API
    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
      />
    </Container>
  )
}

export default Board
