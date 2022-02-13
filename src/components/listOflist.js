import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { gql, useQuery, useMutation } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'universal-cookie';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Link } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Listoflists(props)
{

    const returnName = name =>
    {
        props.currentlist(name);
    }

    const cookies = new Cookies();
    const GET_LISTS = gql`
        query Getlists($token: String!) {
            getlists(token: $token) {
                name
                size
                completed
                _id
            }
        }
        `;
    const { loading, data, refetch } = useQuery(GET_LISTS, { variables: { token: cookies.get('google_token') } });

    if (loading) return <CircularProgress color="secondary" sx={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)" }} />;

    console.log(data);

    return (
        <div className="listOflists">
            <List sx={{ width: '100vw', bgcolor: 'background.paper', paddingTop: "0" }} >
                {data.getlists.map((elem, index) =>
                    (
                        <Listcomp refetch={refetch} returname={returnName} completed={elem.completed} key={index} size={elem.size} name={elem.name} _id={elem._id} token={cookies.get('google_token')} />
                    )
                )}
            </List>
        </div>
    );
}

function Listcomp(props)
{
    const [renameState, setRename] = React.useState(false);
    const [shareState, setShare] = React.useState(false);
    const [copyState, setCopy] = React.useState(false);
    const [deleteState, setDelete] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) =>
    {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) =>
    {
        setAnchorEl(null);
        console.log(event.target.id);
        switch (event.target.id)
        {
            case "rename":
                setRename(true);
                break;
            case "share":
                setShare(true);
                break;
            case "copy":
                setCopy(true);
                break;
            case "delete":
                setDelete(true);
                break;
            default:
                console.log("No changes!")
        }
    };


    const state = Boolean(anchorEl);

    return (
        <div>
            <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="more" onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                }
            >
                <ListItemButton onClick={() => props.returname(props.name)} component={Link} to="../show-list">
                    <ListItemText primary={props.name} secondary={`Выполнено ${props.completed} из ${props.size}`} />
                </ListItemButton>
                <Menu
                    anchorEl={anchorEl}
                    open={state}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                >
                    <MenuItem onClick={handleClose} id="delete">Удалить</MenuItem>
                    <MenuItem onClick={handleClose} id="share">Поделиться</MenuItem>
                    <MenuItem onClick={handleClose} id="copy">Копировать</MenuItem>
                    <MenuItem onClick={handleClose} id="rename">Переименовать</MenuItem>
                </Menu>
            </ListItem>
            <Divider />
            <Rename state={renameState} changeState={setRename} _id={props._id} token={props.token} refetch={props.refetch} />
            <Share state={shareState} changeState={setShare} _id={props._id} token={props.token} />
            <Copy state={copyState} changeState={setCopy} _id={props._id} token={props.token} refetch={props.refetch} />
            <Delete state={deleteState} changeState={setDelete} _id={props._id} token={props.token} refetch={props.refetch} />
        </div>
    );
}

function Delete(props)
{
    let answer = false;

    const changeSt = async (state) =>
    {
        if (answer && !state)
        {
            await deletelist({ variables: { token: props.token, id: props._id } });
            props.refetch();
            answer = false;
        }
        props.changeState(state);
    };

    const DELETE = gql`
        mutation Removelist($token: String!, $id: String!) {
            removelist(token: $token, _id: $id) 
        }
        `;
    const [deletelist] = useMutation(DELETE);
    return (<DeleteDialogue answer={(callback) => answer = callback} state={props.state} changeState={changeSt} />);
}

function DeleteDialogue(props)
{
    const handleClose = () =>
    {
        props.changeState(false);
    };

    return (
        <Dialog
            open={props.state}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-delete"
        >
            <DialogTitle>Вы точно хотите удалить этот список?</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={() => { props.answer(true); handleClose(); }}>Продолжить</Button>
            </DialogActions>
        </Dialog>);
}


function Rename(props)
{
    const [text, Setext] = React.useState(null);
    const changeSt = async (state) =>
    {
        if (text !== null && !state)
        {
            await renamelist({ variables: { token: props.token, id: props._id, name: text } });
            props.refetch();
        }
        props.changeState(state);
    };

    const RE_NAME = gql`
        mutation Renamelist($token: String!, $id: String!, $name: String!) {
            renamelist(token: $token, _id: $id, newname: $name) 
        }
        `;
    const [renamelist, { data, loading, error }] = useMutation(RE_NAME);

    return (<RenameDialogue input={Setext} state={props.state} changeState={changeSt} />);
}

function RenameDialogue(props)
{

    const [renameText, setText] = React.useState(null);

    const handleInput = e =>
    {
        setText(e.target.value);
        props.input(e.target.value);
    };

    const handleClose = () =>
    {
        props.changeState(false);
    };

    return (
        <Dialog open={props.state} onClose={handleClose}>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Новое имя"
                    fullWidth
                    variant="standard"
                    onChange={handleInput}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={handleClose}>Продолжить</Button>
            </DialogActions>
        </Dialog>
    );
}

function Share(props)
{
    const [text, setText] = React.useState(null);

    const SHARE_LIST = gql`
        mutation Sharelist($token: String!, $id: String!, $newemail: String!) {
            sharelist(token: $token, _id: $id, newemail: $newemail) 
        }
        `;

    const changeSt = (state) =>
    {
        if (text !== null && !state)
        {
            sharelist({ variables: { token: props.token, id: props._id, newemail: text } });
        }
        props.changeState(state);
    };

    const [sharelist, { data, loading, error }] = useMutation(SHARE_LIST);

    return (<ShareDialogue input={setText} state={props.state} changeState={changeSt} />);
}

function ShareDialogue(props)
{

    const [shareText, setText] = React.useState(null);

    const handleInput = e =>
    {
        setText(e.target.value);
        props.input(e.target.value);
    };

    const handleClose = () =>
    {
        props.changeState(false);
    };

    return (
        <Dialog open={props.state} onClose={handleClose}>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Введите email получателя"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={handleInput}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={handleClose}>Продолжить</Button>
            </DialogActions>
        </Dialog>
    );
}


function Copy(props)
{
    const [text, setText] = React.useState(null);

    const COPY_LIST = gql`
        mutation Copylist($token: String!, $id: String!, $newlistname: String!) {
            copylist(token: $token, _id: $id, newlistname: $newlistname) 
        }
        `;

    const changeSt = async (state) =>
    {
        if (text !== null && !state)
        {
            await copylist({ variables: { token: props.token, id: props._id, newlistname: text } });
            props.refetch();
        }
        props.changeState(state);
    };

    const [copylist, { data, loading, error }] = useMutation(COPY_LIST);

    return (<CopyDialogue input={setText} state={props.state} changeState={changeSt} />);
}

function CopyDialogue(props)
{

    const [CopyText, setText] = React.useState(null);

    const handleInput = e =>
    {
        setText(e.target.value);
        props.input(e.target.value);
    };

    const handleClose = () =>
    {
        props.changeState(false);
    };

    return (
        <Dialog open={props.state} onClose={handleClose}>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Введите имя скопированного списка"
                    fullWidth
                    variant="standard"
                    onChange={handleInput}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={handleClose}>Продолжить</Button>
            </DialogActions>
        </Dialog>
    );
}
