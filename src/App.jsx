import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    setMode(event.target.value)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">
          <div style={{ display:'flex', alignContent:'center', gap:'8px' }}>
            <LightModeIcon/> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{
            display : 'flex',
            alignContent : 'center',
            gap : 1
          }}>
            <DarkModeOutlinedIcon/> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{
            display : 'flex',
            alignContent : 'center',
            gap : 1
          }}>
            <SettingsBrightnessIcon/> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
      <Box sx={{
        backgroundColor:'primary.light',
        height:(theme) => theme.trello.appBarHeight,
        width:'100%',
        display:'flex',
        alignItems:'center'
      }}>
        <ModeSelect />
      </Box>
      <Box sx={{
        backgroundColor:'primary.dark',
        height:(theme) => theme.trello.boardBarHeight,
        width:'100%',
        display:'flex',
        alignItems:'center'
      }}>
        Board Bar
      </Box>
      <Box sx={{
        backgroundColor:'primary.main',
        height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        width:'100%',
        display:'flex',
        alignItems:'center'
      }}>
        Board Content
      </Box>
    </Container>
  )
}

export default App
