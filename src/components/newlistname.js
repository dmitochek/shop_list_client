import * as React from 'react';
import Slide from '@mui/material/Slide';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import Cookies from 'universal-cookie';

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewListData(props)
{
    const [name, setName] = React.useState(null);

    const CREATE_LIST = gql`
        mutation CreateList($token: String!, $newname: String!) {
            createnewlist(token: $token, newname: $newname) 
        }
        `;
    const cookies = new Cookies();
    const changeName = newname =>
    {
        setName(newname);
        props.currentlist(newname);
    }

    const onclick = value =>
    {
        createlist({ variables: { token: cookies.get('google_token'), newname: name } });
    }

    const [createlist, { data, loading, error }] = useMutation(CREATE_LIST);

    return (<NewList name={changeName} buttonState={onclick} />);
}

function NewList(props)
{
    const [open, setOpen] = React.useState(false);

    const fabStyle = {
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 10,
    };

    const buttonClicked = () =>
    {
        props.buttonState(true);
    }

    const nameHandler = e =>
    {
        props.name(e.target.value);
    }

    return (
        <div>
            <Fab color="secondary" aria-label="add" sx={fabStyle} onClick={() => setOpen(true)}>
                <AddIcon />
            </Fab>

            <Dialog
                fullScreen
                open={open}
                onClose={() => setOpen(false)}
                TransitionComponent={Transition}
            >
                <Box sx={{ height: '100vh' }}>
                    <AppBar sx={{ position: 'relative' }} >
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setOpen(false)}
                                aria-label="close"
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Назовите список
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <TextField label="Название" onChange={nameHandler} variant="standard" sx={{ borderRadius: "3px", bgcolor: 'white', width: '70%', position: 'absolute', left: '50%', top: '30%', marginRight: '-50%', transform: 'translate(-50%,-50%)' }} />
                    <Link to="/show-list">
                        <Button variant="contained" onClick={buttonClicked} sx={{ position: 'absolute', left: '50%', top: '40%', marginRight: '-50%', transform: 'translate(-50%,-50%)' }}>
                            Создать список
                        </Button>
                    </Link>
                </Box>
            </Dialog>
        </div>
    );
}