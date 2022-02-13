import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function BarElem()
{
  const [state, toggleDrawer] = React.useState(false);

  const listItemStyle = { p: '3%' };
  return (
    <div className="bar">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "forestgreen" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Мои списки
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <SwipeableDrawer
        anchor="left"
        open={state}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <div>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} >
            <ListItem sx={listItemStyle}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Mom" />
            </ListItem>
            <Divider />
            <ListItemButton sx={listItemStyle} >
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Удаленные списки" />
            </ListItemButton>
            <ListItemButton sx={listItemStyle}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Настройки" />
            </ListItemButton>
            <Divider />
            <ListItemButton sx={listItemStyle}>
              <ListItemIcon>
                <ThumbUpIcon />
              </ListItemIcon>
              <ListItemText primary="Оцените наше приложение" />
            </ListItemButton>
            <Divider />
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  );
}

