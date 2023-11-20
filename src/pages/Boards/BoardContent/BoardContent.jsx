import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

function BoardContent() {
  return (
    // Bao quanh
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      height: (theme) => theme.trello.boardContentHeight,
      width: '100%',
      p: '10px 0' //trick scroll
    }}>
      <ListColumns />
    </Box >
  )
}

export default BoardContent
