import './App.css';
import React from 'react';
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function Mainheader(props)
{
    const [leftDrawer, setDrawerValue] = useState(false);
    const [menuState, setMenuState] = useState(null);
    const [listname, setListName] = useState("");
    const [openDeleteAlert, setOpenAlertDelete] = React.useState(false);
    const [openRenameAlert, setOpenRenameAlert] = React.useState(false);
    const [RenameInput, setRenameInput] = React.useState("");
    const [DeletedList, setDeletedList] = React.useState("");
    const [PreviousListName, SetPreviousListName] = React.useState("");
    const [openNewList, SetOpenNewList] = React.useState(false);
    const [NewList, SetNewListInput] = React.useState("");

    async function OnButDeleteActions()
    {
        let res = await DltLst();
        console.log(res);
        if (res.data.deletelist)
        {
            setDeletedList(listname);
            props.ListChosen(false);
            setListName("");
        }
    };

    const RenameListfunc = (event) =>
    {
        setRenameInput(event.target.value);
    };

    const NewNameInputfunc = (event) =>
    {
        SetNewListInput(event.target.value);
    };

    async function OnButNewList()
    {
        let res = await NwLst();
        if (res.data.addnewlist)
        {
            props.ListChosen(NewList);
            setListName(NewList);
        }

    };

    async function OnButRenameActions()
    {
        let res = await RnmLst({ variables: { newname: RenameInput } });
        console.log(res);
        if (res.data.rename)
        {
            SetPreviousListName(listname);
            setListName(RenameInput);
        }
    };

    const handleClick = (event) =>
    {
        setMenuState(event.currentTarget);
    };
    const handleClose = () =>
    {
        setMenuState(null);
    };
    const RendelListElem = () =>
    {
        let elem;
        const LISTS = gql`
            query($id : ID!)
            {
                getuser(_id : $id) {
                    login
                    lists{
                        name
                    }
                }
            }
            `;
        const { loading, error, data } = useQuery(LISTS, {
            variables: { id: props.UsID }
        });

        if (loading) return null;
        if (error) return `Error! ${error}`;

        elem = data.getuser.lists;

        let indexDeleted, indexRenamed, newArr;
        newArr = JSON.parse(JSON.stringify(elem));
        for (let i = 0; i < elem.length; ++i)
        {
            if (elem[i].name == DeletedList)
            {
                indexDeleted = i;
            }
            if (elem[i].name == PreviousListName)
            {
                indexRenamed = i;
            }
        }

        if (indexDeleted >= 0)
        {
            newArr = [];
            for (let i = 0; i < elem.length; ++i)
            {
                if (i !== indexDeleted)
                {
                    newArr.push(elem[i]);
                }
            }
        }

        if (indexRenamed >= 0)
        {
            console.log(elem);
            newArr[indexRenamed].name = listname;
        }


        return (
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => setDrawerValue(false)}
                onKeyDown={() => setDrawerValue(false)}
            >
                <List>
                    <ListItem key="settings">
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={data.getuser.login} />
                    </ListItem>
                </List >
                <Divider />
                <List>
                    {newArr.map((item, index) => (
                        <ListItem button key={index} onClick={() => { props.ListChosen(item.name); setListName(item.name) }}>
                            <ListItemIcon>
                                <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItem>
                    ))}
                </List >
                <Divider />
                <List>
                    <ListItem button key="settings">
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Настройки" />
                    </ListItem>
                </List >
            </Box >
        );

    }

    const DELETELIST = gql`
            mutation($_id : ID!, $name: String!)
            {
                deletelist(_id : $_id, name : $name) 
            }
            `;
    const [DltLst, { data, loading, error }] = useMutation(DELETELIST, {
        variables: {
            _id: props.UsID,
            name: listname
        }
    });

    const RENAMELIST = gql`
            mutation($_id : ID!, $name: String!, $newname: String!)
            {
                rename(_id: $_id, name: $name, newname: $newname)
            }
            `;
    const [RnmLst, { data_rename, loading_rename, error_rename }] = useMutation(RENAMELIST, {
        variables: {
            _id: props.UsID,
            name: listname
        }
    });

    const NEWLIST = gql`
            mutation($_id : ID!, $name: String!)
            {
                addnewlist(_id: $_id, name: $name)
            }
            `;
    const [NwLst, { data_new, loading_new, error_new }] = useMutation(NEWLIST, {
        variables: {
            _id: props.UsID,
            name: NewList
        }
    });

    return (
        <div className="mainheader">
            <AppBar position="static">
                <Toolbar>
                    <IconButton variant="text"
                        onClick={() => setDrawerValue(true)}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        anchor="left"
                        open={leftDrawer}
                        onClose={() => setDrawerValue(false)}
                    >
                        <RendelListElem />
                    </Drawer>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {listname}
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleClick}
                        color="inherit"
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={menuState}
                        id="menu-appbar"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(menuState)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => { handleClose(); SetOpenNewList(true); }}>Новый список</MenuItem>
                        <MenuItem onClick={() => { handleClose(); setOpenRenameAlert(true); }} disabled={listname ? false : true}>Переименовать список</MenuItem>
                        <MenuItem onClick={() => { handleClose(); setOpenAlertDelete(true); }} disabled={listname ? false : true}>Удалить список</MenuItem>
                    </Menu>

                    <Dialog open={openNewList} onClose={() => SetOpenNewList(false)}>
                        <DialogTitle>Новый список</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="newname"
                                label="Имя списка"
                                fullWidth
                                variant="standard"
                                value={NewList}
                                onChange={NewNameInputfunc}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => SetOpenNewList(false)}>Отмена</Button>
                            <Button onClick={() => { SetOpenNewList(false); OnButNewList(); }}>Продолжить</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openRenameAlert} onClose={() => setOpenRenameAlert(false)}>
                        <DialogTitle>Переименовать список</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="rename"
                                label="Имя списка"
                                fullWidth
                                variant="standard"
                                value={RenameInput}
                                onChange={RenameListfunc}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenRenameAlert(false)}>Отмена</Button>
                            <Button onClick={() => { setOpenRenameAlert(false); OnButRenameActions(); }}>Продолжить</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openDeleteAlert}
                        onClose={() => setOpenAlertDelete(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Вы уверены?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Вы удалите весь список вместе с его элементами.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenAlertDelete(false)}>Отменить</Button>
                            <Button onClick={() =>
                            {
                                setOpenAlertDelete(false);
                                OnButDeleteActions();
                            }} autoFocus>
                                Продолжить
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </AppBar>
        </div >
    );

}
