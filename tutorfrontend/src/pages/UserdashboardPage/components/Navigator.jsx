import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import PropTypes from 'prop-types';

const categories = [
  {
    id: 'Working Area',
    children: [
      { id: 'Lesson App', icon: <DnsRoundedIcon /> },
      {
        id: 'Generator App',
        icon: <PermMediaOutlinedIcon/>,
      },
      { id: 'Q&A App', icon: <PeopleIcon /> },
      { id: 'Exam Booking App', icon: <TimerIcon /> },
      { id: 'Functions', icon: <SettingsEthernetIcon /> },
      {
        id: 'Machine learning',
        icon: <SettingsInputComponentIcon />,
      },
    ],
  },
  {
    id: 'Quality',
    children: [
      { id: 'Analytics', icon: <SettingsIcon /> },
      { id: 'Performance', icon: <TimerIcon /> },
      { id: 'Test Lab', icon: <PhonelinkSetupIcon /> },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

function Navigator(props) {
  const {...other} = props;
  const {onAppSelect} = props;
  const [activeCategory, setActiveCategory] = React.useState(
    categories[0].children[1].id
  )

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onAppSelect(categoryId);
  }

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 20, color: '#fff' ,fontFamily: 'cursive'}}>
          EdTech Inc. System
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Overview</ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem disablePadding key={childId} >
                <ListItemButton selected={activeCategory === childId} sx={item} onClick={() => handleCategoryClick(childId)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  {/* <ListItemText>{childId}</ListItemText> */}
                  <label
                    style={{
                      fontSize: '19px',
                      fontFamily: 'cursive'
                    }}
                  >{childId}</label>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.props = {
  onAppSelect: PropTypes.func.isRequired,
}

export default Navigator;