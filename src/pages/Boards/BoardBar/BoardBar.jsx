import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box sx={{
      // backgroundColor: 'primary.dark',
      height: (theme) => theme.trello.boardBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          clickable />
        {/* Xét điều kiện */}
        {/* {
          board?.type &&
          <Chip
            sx={MENU_STYLES}
            icon={<VpnLockIcon />}
            label={board?.type}
            clickable />
        } */}
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >Invite</Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}
        >
          {/* hiển thị 4 vòng tròn (3 users + 1 count(users còn lại)), nếu dùng total thì không count nữa mà dựa theo total tính ra */}
          <Tooltip title="duyuitk16">
            <Avatar
              alt="duyuitk16"
              src="https://avatars.githubusercontent.com/u/100192240?v=4" />
          </Tooltip>
          <Tooltip title="yenthuong">
            <Avatar
              alt="yenthuong"
              src="https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/366743099_1944155045949643_8834903513125538246_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHWJjBmAV4W1zkkMDVInLZzmb4RCe_vzTmZvhEJ7-_NORasj54af130hPWnNKERMtDTjsXaxI-wI6zdIQGWkdpX&_nc_ohc=sdkbwSYxPDcAX_3l7bN&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfDeHSvvGelqc_c4eGfA0MCVlViqwnPQixl9q5fB9xD2TA&oe=655B95D2" />
          </Tooltip>
          <Tooltip title="huyna">
            <Avatar
              alt="huyna"
              src="https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/272093289_447898560166086_5712438341698048015_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHof9xCg_GF209XAkYKdx7MVOJS_RZicuBU4lL9FmJy4A5bWsQ2R6zlFz-Y9YBgwK9rAJvLrvwxBFaRuxAZw7BZ&_nc_ohc=tO_e8KSpExkAX-oxXr4&_nc_oc=AQmjyhQbiWjLvK2JOY5AMEwZWbjjccCzh-C3jv9Eui8u6sUwebyMMdZBd76yMEJUoeU&_nc_ht=scontent.fsgn5-14.fna&oh=00_AfCxuvmV1vy0xpTE4jrcIjlccVOezXjjLfIu5WCkRvZPsw&oe=655A8D13" />
          </Tooltip>
          <Tooltip title="khangkim">
            <Avatar
              alt="khangkim"
              src="https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.6435-9/125425927_874187163320707_6309256143613554646_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeHUV_pDMmwpWsDPW3sWiHyrlaa6m2WgDv2VprqbZaAO_QTWiO2xVDlLJDVKbFg1ckPuSwkyK-56zqXnVAlksPhL&_nc_ohc=V1i6CwqxHXAAX94WfIg&_nc_ht=scontent.fsgn5-5.fna&oh=00_AfAIXS_d8G1IAeazNlpkhd2EySyQdkYn65fRMmUw-BHF6g&oe=657DD054" />
          </Tooltip>
          <Tooltip title="trungphuc">
            <Avatar
              alt="trungphuc"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/392935634_1415070549071718_2963793584702226650_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGo0Zvry1KuDQptE4GZJwvb0RjGiVdrRQzRGMaJV2tFDANdmQXZyUDdv3BD8h4iIp1JEIiDMGIgKeMKCcys4zZB&_nc_ohc=JS20uRg-tLIAX81pyA9&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfDcCN6Zwz-soLcwW2z9uiObQaYpNJ3m7HyT6d-yLHqk6w&oe=655B7226" />
          </Tooltip>
          <Tooltip title="dinhhuy">
            <Avatar
              alt="dinhhuy"
              src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/317368088_958139868496803_6225776743076180080_n.jpg?stp=dst-jpg_s320x320&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeF-28A0vtwbPV-Gl28tfM_zrwSuQvq4pWGvBK5C-rilYbbTtV0YPGkpPKPWKjvzq4xsJ_2g--O-THzMDAdmG8T_&_nc_ohc=4jwiJmuDgIUAX-Wh87v&_nc_ht=scontent.fsgn5-10.fna&oh=00_AfBriEUDBa6dhXpvppjWph5Mo2XNWyg7rhZKD-kJtC4kkw&oe=655B1656" />
          </Tooltip>
          <Tooltip title="duyuitk16">
            <Avatar
              alt="duyuitk16"
              src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t31.18172-8/21640975_124370258307974_5940478701892983268_o.jpg?_nc_cat=111&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeEn3hTPq3vF5Hn13h2LsZJC-uDax5jxOnj64NrHmPE6eP728zTyXh9oL1ROmjZU_yBKcWqEIE48qxno73wORvFF&_nc_ohc=m3LGaczGMywAX_8N2Vu&_nc_ht=scontent.fsgn5-15.fna&oh=00_AfAyDW6q8cKH0qQrhvLaCL3rUoQKcBWuI54kvwHoTHnmqg&oe=657DC118" />
          </Tooltip>
          <Tooltip title="duyuitk16">
            <Avatar
              alt="duyuitk16"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/392935634_1415070549071718_2963793584702226650_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGo0Zvry1KuDQptE4GZJwvb0RjGiVdrRQzRGMaJV2tFDANdmQXZyUDdv3BD8h4iIp1JEIiDMGIgKeMKCcys4zZB&_nc_ohc=JS20uRg-tLIAX81pyA9&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfDcCN6Zwz-soLcwW2z9uiObQaYpNJ3m7HyT6d-yLHqk6w&oe=655B7226" />
          </Tooltip>
          <Tooltip title="duyuitk16">
            <Avatar
              alt="duyuitk16"
              src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/317368088_958139868496803_6225776743076180080_n.jpg?stp=dst-jpg_s320x320&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeF-28A0vtwbPV-Gl28tfM_zrwSuQvq4pWGvBK5C-rilYbbTtV0YPGkpPKPWKjvzq4xsJ_2g--O-THzMDAdmG8T_&_nc_ohc=4jwiJmuDgIUAX-Wh87v&_nc_ht=scontent.fsgn5-10.fna&oh=00_AfBriEUDBa6dhXpvppjWph5Mo2XNWyg7rhZKD-kJtC4kkw&oe=655B1656" />
          </Tooltip>
          <Tooltip title="duyuitk16">
            <Avatar
              alt="duyuitk16"
              src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t31.18172-8/21640975_124370258307974_5940478701892983268_o.jpg?_nc_cat=111&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeEn3hTPq3vF5Hn13h2LsZJC-uDax5jxOnj64NrHmPE6eP728zTyXh9oL1ROmjZU_yBKcWqEIE48qxno73wORvFF&_nc_ohc=m3LGaczGMywAX_8N2Vu&_nc_ht=scontent.fsgn5-15.fna&oh=00_AfAyDW6q8cKH0qQrhvLaCL3rUoQKcBWuI54kvwHoTHnmqg&oe=657DC118" />
          </Tooltip>
          <Tooltip title="duyuitk16">
            <Avatar
              alt="duyuitk16"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/392935634_1415070549071718_2963793584702226650_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGo0Zvry1KuDQptE4GZJwvb0RjGiVdrRQzRGMaJV2tFDANdmQXZyUDdv3BD8h4iIp1JEIiDMGIgKeMKCcys4zZB&_nc_ohc=JS20uRg-tLIAX81pyA9&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfDcCN6Zwz-soLcwW2z9uiObQaYpNJ3m7HyT6d-yLHqk6w&oe=655B7226" />
          </Tooltip>
          <Tooltip title="duyuitk16">
            <Avatar
              alt="duyuitk16"
              src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/317368088_958139868496803_6225776743076180080_n.jpg?stp=dst-jpg_s320x320&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeF-28A0vtwbPV-Gl28tfM_zrwSuQvq4pWGvBK5C-rilYbbTtV0YPGkpPKPWKjvzq4xsJ_2g--O-THzMDAdmG8T_&_nc_ohc=4jwiJmuDgIUAX-Wh87v&_nc_ht=scontent.fsgn5-10.fna&oh=00_AfBriEUDBa6dhXpvppjWph5Mo2XNWyg7rhZKD-kJtC4kkw&oe=655B1656" />
          </Tooltip>
          <Tooltip title="duyuitk16">
            <Avatar
              alt="duyuitk16"
              src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t31.18172-8/21640975_124370258307974_5940478701892983268_o.jpg?_nc_cat=111&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeEn3hTPq3vF5Hn13h2LsZJC-uDax5jxOnj64NrHmPE6eP728zTyXh9oL1ROmjZU_yBKcWqEIE48qxno73wORvFF&_nc_ohc=m3LGaczGMywAX_8N2Vu&_nc_ht=scontent.fsgn5-15.fna&oh=00_AfAyDW6q8cKH0qQrhvLaCL3rUoQKcBWuI54kvwHoTHnmqg&oe=657DC118" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
