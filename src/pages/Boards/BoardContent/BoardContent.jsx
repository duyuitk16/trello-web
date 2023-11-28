import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  //Nếu dùng phải kèm với thuộc tính CSS touchAction:'none' ở những phần tử kéo thả ==> nhưng còn bug :)
  // const pointSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug
  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    const { active, over } = event
    //Kiểm tra nếu không tồn tại over thì return (kéo linh tinh ra ngoài)
    if (!over) return

    if (active.id !== over.id) {
      //Lấy oldIndex từ active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      //Lấy newIndex từ active
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      // Dùng arrayMove để sắp xếp lại mảng Columns ban đầu và cập nhật lại
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      //Cập nhật giá trị vào DB (xử lý gọi API)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns: ', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      {/* Bao quanh */}
      <Box sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        height: (theme) => theme.trello.boardContentHeight,
        width: '100%',
        p: '10px 0' //trick scroll
      }}>
        <ListColumns columns={orderedColumns} />
      </Box >
    </DndContext>
  )
}

export default BoardContent
