import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import PopularAndRecentInfo from './components/popularAndrecent';
import { Link } from "react-router-dom";
import { gql, useQuery, useMutation } from '@apollo/client';
import Cookies from 'universal-cookie';
import List from '@mui/material/List';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import CircularProgress from '@mui/material/CircularProgress';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function AddProducts(props)
{
    const [SearchInput, setSearchInput] = React.useState("");
    const [CheckBoxState, setCheckBoxState] = React.useState();
    const cookies = new Cookies();

    const SEARCH_PRODUCTS = gql`
    query SearchProducts($token: String!, $name: String!, $listname: String!) {
        searchproducts(token: $token, name: $name, listname: $listname)
        {
            name
            checked
        }
    }
    `;

    const NEW_PRODUCT = gql`
    mutation NewProduct($token: String!, $listname: String!, $product: String!) {
        newproduct(token: $token, listname: $listname, product: $product)
    }
    `;

    const DELETE_PRODUCT = gql`
    mutation DeleteProduct($token: String!, $listname: String!, $product: String!) {
        deleteproduct(token: $token, listname: $listname, product: $product)
    }
    `;


    const [callMutationNEW, { data, loading, error }] = useMutation(NEW_PRODUCT);
    const [callMutationDELETE, deleteInfo] = useMutation(DELETE_PRODUCT);

    const AddProduct = (elem) =>
    {
        // future: make mutations async
        list.refetch(SearchInput);
        if (!elem.checked)
        {
            callMutationNEW({ variables: { token: cookies.get('google_token'), listname: cookies.get('current_list'), product: elem.name } });
        }
        else
        {
            callMutationDELETE({ variables: { token: cookies.get('google_token'), listname: cookies.get('current_list'), product: elem.name } });
        }
        setCheckBoxState(elem);
    }

    const SearchInputf = (e) =>
    {
        setSearchInput(e.target.value);
        list.refetch({ name: e.target.value });
    }

    const list = useQuery(SEARCH_PRODUCTS, { variables: { token: cookies.get('google_token'), name: SearchInput, listname: cookies.get('current_list') } });

    return (
        <div className="search">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open returning back"
                        sx={{ mr: 2 }}
                        component={Link}
                        to="../show-list"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Search onChange={SearchInputf}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Добавить товар..."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </Toolbar>
            </AppBar>

            {SearchInput.length === 0 ? <PopularAndRecentInfo /> : <ShowSearchList info={list} callback={AddProduct} addedProduct={CheckBoxState} />}
        </div>
    );
}


function ShowSearchList(props)
{

    const remove = () =>
    {
        // implementation in a future
    };

    const add = () =>
    {
        // implementation in a future
    };

    const addProduct = (elem) => 
    {
        props.callback(elem);
    };


    return (
        <List>
            {(props.info.loading) ? <CircularProgress sx={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)" }} /> : props.info.data.searchproducts.map((elem, index) =>
                (
                    <ListItem
                        key={elem.name}
                        role={undefined}
                        dense
                        button
                        onClick={() => addProduct(elem)}
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={props.addedProduct === undefined ? elem.checked : (props.addedProduct.name === elem.name ? !elem.checked : elem.checked)}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={elem.name}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="less" onClick={remove}>
                                <RemoveCircleIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="more" onClick={add}>
                                <AddCircleIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            )}

        </List>);
}
