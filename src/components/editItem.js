import * as React from 'react';
import { gql, useQuery } from '@apollo/client';
import Cookies from 'universal-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

const category = ["Хлеб & хлебобулочные изделия", "Овощи & грибы", "Фрукты", "Замороженные овощи", "Молочная продукция", "Мясная & колбасная продукция", "Рыба", "Бакалея", "Напитки", "Кондитерские изделия"];

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditItemInfo(props)
{
    const cookies = new Cookies();
    const GET_PRODUCT_INFO = gql`
    query Getproduct($token: String!, $listname: String!, $product: String!) {
        getproduct(token: $token, listname: $listname, product: $product) {
            category 
            unit
            note
            quanity
        }
    }
    `;

    const handleClose = (value) =>
    {
        props.returnState(false);
    };

    const { data, loading } = useQuery(GET_PRODUCT_INFO, { variables: { token: cookies.get('google_token'), listname: cookies.get('current_list'), product: props.productName } });

    if (loading) return <CircularProgress sx={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)" }} />;

    return <EditItem menu={data} Compstate={props.Compstate} returnState={handleClose} productName={props.productName} />
}

function EditItem(props)
{

    const handleClose = () =>
    {
        props.returnState(false);
    };

    return (
        <Dialog
            fullScreen
            open={props.Compstate}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: 'forestgreen' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {props.productName}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose}>
                        Сохранить
                    </Button>
                </Toolbar>


            </AppBar>

        </Dialog>
    );
}