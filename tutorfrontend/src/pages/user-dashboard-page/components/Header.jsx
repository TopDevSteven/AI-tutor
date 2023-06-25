import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const lightColor = 'rgba(255, 255, 255, 0.7)';

function Header(props) {
  const { onDrawerToggle, activeTab, onTabChange , changeHeader } = props;

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar sx={{background: 'linear-gradient(90deg, #081627, #c72e9a)'}}>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton color="inherit" sx={{ p: 0.5 }}>
                <Avatar src="./1.jpg" alt="My Avatar" />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar sx={{ background: 'linear-gradient(90deg, #081627, #c72e9a)'}}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {changeHeader}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                sx={{ borderColor: lightColor }}
                variant="outlined"
                color="inherit"
                size="small"
              >
                Web setup
              </Button>
            </Grid>
            <Grid item>
              <Tooltip title="Help">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 , background: 'linear-gradient(90deg, #081627, #c72e9a)'}}>
        {changeHeader === null || changeHeader === "GPT-Hub" ? (
        <Tabs value={activeTab} onChange={onTabChange} textColor="inherit">
          <Tab label="Code" sx={{ fontSize: '20px', fontFamily: 'cursive'}} />
          <Tab label="Presentation" sx={{ fontSize: '20px', fontFamily: 'cursive'}} />
          <Tab label="Blog Content" sx={{ fontSize: '20px', fontFamily: 'cursive'}} />
          <Tab label="Image" sx={{ fontSize: '20px', fontFamily: 'cursive'}} />
        </Tabs>
        ) : changeHeader === "Personal AI-GPT" ? (
          <Tabs value={activeTab} onChange={onTabChange} textColor="inherit">
            <Tab label="View" sx={{ fontSize: '20px', fontFamily: 'cursive'}} />
            <Tab label=" + Create" sx={{ fontSize: '20px', fontFamily: 'cursive'}} />
          </Tabs>
        ) : null}
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
  onTabChange: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
  changeHeader: PropTypes.string.isRequired
};

export default Header;