import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  DragOverlay,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  // Cùng 1 thời điểm chỉ có 1 phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    //Nên dùng c.cards thay vì c.cardOrderIds bởi vì ở handleDragOver ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    //Đảm bảo nếu không tồn tại active hoặc over (kéo ra ngoài container) thì không làm gì
    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // Tìm nơi activeCard sắp được thả trong overColumn
        const overCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // Tính CardIndex mới (trên hoặc dưới của overCard)
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng OrderdColumns cũ ra một cái mới để xử lý data rồi mới return --> cập nhật state mới
        const nextColumns = cloneDeep(prevColumns)

        const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

        if (nextActiveColumn) {
          //Xóa card ở column active (column cũ)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(c => c._id !== activeDraggingCardId)
          //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(c => c._id)
        }
        if (nextOverColumn) {
          //Ktra card đang kéo có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(c => c._id !== activeDraggingCardId)
          //Thêm card đang kéo vào overColumn theo vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          //Cập nhật lại mảng cardOrderIds
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(c => c._id)
        }
        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('Hành động kéo card không làm gì hết!')
      return
    }

    const { active, over } = event

    //Đảm bảo nếu không tồn tại active hoặc over (kéo ra ngoài container) thì không làm gì
    if (!active || !over) return

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
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  // console.log('activeDragItemId: ', activeDragItemId)
  // console.log('activeDragItemType: ', activeDragItemType)
  // console.log('activeDragItemData: ', activeDragItemData)
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Bao quanh */}
      <Box sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        height: (theme) => theme.trello.boardContentHeight,
        width: '100%',
        p: '10px 0' //trick scroll
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box >
    </DndContext>
  )
}

export default BoardContent
