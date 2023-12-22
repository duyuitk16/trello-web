import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from '~/pages/Boards/BoardBar/BoardBar'
import BoardContent from '~/pages/Boards/BoardContent/BoardContent'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'


// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { mapOrder } from '~/utils/sorts'
import { toast } from 'react-toastify'


function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Tạm thời fix cứng boardId, flow chuẩn thì ta sử dụng react-router-dom để lấy boardId từ URL về
    const boardId = '657ea13a8c298156be483be5'
    //Call API
    fetchBoardDetailsAPI(boardId).then(board => {
      // Sắp xếp mảng columns trước khi đưa xuống component con
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      // Xử lý cột trống vừa mới F5 chưa có PlaceHolderCard ==> không kéo qua đc
      board.columns.forEach(c => {
        if (isEmpty(c.cards)) {
          c.cards = [generatePlaceholderCard(c)]
          c.cardOrderIds = [generatePlaceholderCard(c)._id]
        } else {
          // Sắp xếp mảng cards trước khi đưa xuống component con
          c.cards = mapOrder(c?.cards, c?.cardOrderIds, '_id')
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
      // Nếu column rỗng: bản chất nó đang chứa Placeholder Card
      if (columnToUpdate.cards.some(c => c.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  const moveColumns = (dndOrderedColumns) => {
    // Update dl để set state Board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumns.map(c => c._id)
    setBoard(newBoard)

    // Gọi API
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  const moveCardsInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update dl để set state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(c => c._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
   * B1: Xóa _id của card đang kéo trong mảng cardOrderIds ở Column cũ
   * B2: Thêm _id của card đang kéo trong mảng cardOrderIds ở Column mới
   * B3: Cập nhật lại columnId của card đang kéo.
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update cho chuẩn dl state Board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumns.map(c => c._id)
    setBoard(newBoard)

    // Gọi API
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // Xử lý trường hợp kéo card cuối cùng, khi column rỗng thì nó có Placeholder card, phải xóa rồi mới đưa dl sang BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  const deleteColumnDetails = (columnId) => {
    // Update state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // Gọi API
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
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
        moveCardsInTheSameColumn={moveCardsInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
