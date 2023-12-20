import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'

import {
  DndContext,
  DragOverlay,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'

import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn, createNewCard, moveColumns }) {
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
  const [oldColumn, setOldColumn] = useState(null)

  // Điểm va chạm cuối cùng
  // const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    //Nên dùng c.cards thay vì c.cardOrderIds bởi vì ở handleDragOver ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //Cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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

        //Thêm Placeholder Card nếu Column rỗng (Bị kéo hết card đi, không còn card nào nữa)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(c => c._id)
      }
      if (nextOverColumn) {
        //Ktra card đang kéo có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(c => c._id !== activeDraggingCardId)

        //Phải cập nhật lại columnId trong card cho chuẩn dữ liệu sau khi kéo card giữa 2 columns
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        //Thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xóa Placeholder Card đi nếu column không còn rỗng nữa
        nextOverColumn.cards = nextOverColumn.cards.filter(c => !c.FE_PlaceholderCard)

        //Cập nhật lại mảng cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(c => c._id)

        // console.log('nextColumns: ', nextColumns)
      }
      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(event?.active?.id))
    }
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    //Đảm bảo nếu không tồn tại active hoặc over (kéo ra ngoài container) thì không làm gì
    if (!active || !over) return

    //Xử lý kéo thả Card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!oldColumn || !overColumn) return

      //Dùng oldColumn thay vì activeColumn do trong handleDragOver thì đã thay đổi state rồi
      if (oldColumn._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        //Kéo thả card trong cùng column

        //Lấy oldCardIndex từ oldColumn
        const oldCardIndex = oldColumn?.cards?.findIndex(c => c._id === activeDragItemId)
        //Lấy newCardIndex từ over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        const dndOrderedCards = arrayMove(oldColumn?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          //Cập nhật cards và cardOrderIds
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(c => c._id)

          return nextColumns
        })
      }
    }

    //Xử lý kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        //Lấy oldColumnIndex từ active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        //Lấy newColumnIndex từ over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        // Dùng arrayMove để sắp xếp lại mảng Columns ban đầu và cập nhật lại
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        /**
          * Ở học phần nâng cao, ta sẽ đưa dl Board ra ngoài Redux Global Store
          * Thì khi đó, ta sẽ gọi API ở đây là xong thay vì gọi props ngược lên component cha cao nhất (_id.jxs)
         */
        moveColumns(dndOrderedColumns)

        // Vẫn set state ở đây để tránh flickering giao diện do phải chờ API response (lí do không cần await hàm ở trên, small trick, mượt UI/UX)
        setOrderedColumns(dndOrderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumn(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    // console.log('args: ', args)
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return closestCorners({ ...args })

    //Tìm các điểm giao nhau, va chạm - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)
    // console.log('pointerIntersection: ', pointerIntersections)

    // Fix flickering khi kéo card có image cover lớn lên trên ra khỏi khu vực kéo thả
    if (!pointerIntersections?.length) return

    // //Thuật toán phát hiện va chạm sẽ trả về 1 mảng các va chạm ở đây
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    // Tìm overId đầu tiên trong pointerIntersections ở trên
    let overId = getFirstCollision(pointerIntersections, 'id')
    // console.log('overId: ', overId)
    if (overId) {
      //Đoạn này fix flickering
      //Nếu cái over là column thì tìm tới cardId gần nhất bên trong khu vực va chạm dựa vào thuật toán phát hiện va chạm closestCorners hoặc closestCenter đều được, nhưng closestCorners thì mượt hơn
      const checkColumn = orderedColumns.find(c => c._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      // lastOverId.current = overId
      return [{ id: overId }]
    }
    // return lastOverId.current ? [{ id: lastOverId.current }] : []
    return []
  }, [activeDragItemType, orderedColumns])

  // console.log('activeDragItemId: ', activeDragItemId)
  // console.log('activeDragItemType: ', activeDragItemType)
  // console.log('activeDragItemData: ', activeDragItemData)
  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì conflict giữa card và column) ta dùng closetCorners thay vì closestCenter

      //Nếu chỉ dùng closetCorners sẽ có bug flickering + sai lệch dữ liệu
      // collisionDetection={closestCorners}
      // Custom lại thuật toán va chạm
      collisionDetection={collisionDetectionStrategy}
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
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
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
