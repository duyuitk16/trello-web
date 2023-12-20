import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { toast } from 'react-toastify'

function ListColumns({ columns, createNewColumn, createNewCard }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Please enter column name!')
      return
    }

    const newColumnData = {
      title: newColumnTitle
    }

    /**
     * Ở học phần nâng cao, ta sẽ đưa dl Board ra ngoài Redux Global Store
     * Thì khi đó, ta sẽ gọi API ở đây là xong thay vì gọi props ngược lên component cha cao nhất (_id.jxs) */
    createNewColumn(newColumnData)

    // Xóa input và đóng form
    setNewColumnTitle('')
    toggleOpenNewColumnForm()
  }
  //Thằng SortableContext yêu cầu items là 1 mảng dạng ['id-1', 'id-2'] chứ không phải [{id:'id-1'},{id:'id-2'}]
  // Nếu không đúng thì vẫn kéo thả được nhưng không có animation
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      {/* Hiển thị */}
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column key={column._id} column={column} createNewCard={createNewCard} />)}

        {/* Button Add New Column */}
        {
          !openNewColumnForm
            ?
            <Box
              onClick={toggleOpenNewColumnForm}
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: '#ffffff3d'
              }}
            >
              <Button startIcon={<NoteAddIcon />}
                sx={{
                  color: 'white',
                  width: '100%',
                  justifyContent: 'flex-start',
                  pl: 2.5,
                  py: 1
                }}>Add New Column</Button>
            </Box>
            :
            <Box sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
                label="Enter column title..."
                type="text"
                size='small'
                variant="outlined"
                autoFocus
                value={newColumnTitle}
                onChange={(e) => { setNewColumnTitle(e.target.value) }}
                sx={{
                  '& label': { color: 'white' },
                  '& label.Mui-focused': { color: 'white' },
                  '& input': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white', borderWidth: '0.5px' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained" color="success" size="small"
                  sx={{
                    boxShadow: 'none',
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                  onClick={addNewColumn}
                >
                  Add Column
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { color: (theme) => theme.palette.warning.light }
                  }}
                  onClick={toggleOpenNewColumnForm} />
              </Box>
            </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns