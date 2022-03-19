import * as React from 'react';
import { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { gql, useQuery, useMutation } from '@apollo/client';
import Cookies from 'universal-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import EditItem from './components/editItem';


const category = ["Хлеб & хлебобулочные изделия", "Овощи & грибы", "Фрукты", "Замороженные овощи", "Молочная продукция", "Мясная & колбасная продукция", "Рыба", "Бакалея", "Напитки", "Кондитерские изделия"];
const unit = ["литр", "кг", "граммы", "упаковки", "мл"];

// data generator
const getItems = count =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `${k}`,
        content: `category ${k}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) =>
{
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    border: `1px solid lightgrey`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "white",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "white",
    padding: grid,
    width: window.innerWidth - 2 * grid,
});

export default function ShowListData(props)
{
    const [all_products_info, set_all_products_info] = React.useState(null);
    const [list_expand, set_list_expand] = React.useState(null);
    const [list_order, set_list_order] = React.useState(null);

    const compare = (a, b) =>
    {
        let arr = order.data.getuser.category_order;
        if (arr.includes(b.category, arr.indexOf(a.category))) return -1;
        else return 1;
    }

    const ListExpanded = (array) =>
    {
        set_list_expand(array);
    }

    const ListOrder = (array) =>
    {
        set_list_order(array);
    }

    // start update products states

    const changeStates = (states) =>
    {
        const list_array = Array.from(products.map(elem => { return elem.list }));
        updatestates({
            variables: {
                token: cookies.get('google_token'), listname: cookies.get('current_list'),
                listarray: list_array, liststates: states
            }
        });

        let new_array = [], numb;

        all_products_info.forEach((elem) =>
        {
            for (let i = 0; i < products.length; ++i)
            {

                if ((numb = products[i].list.indexOf(elem.name)) !== -1)
                {

                    let obj = Object.assign(elem);
                    obj.checked = states[i][numb];
                    new_array.push(obj);
                    break;
                }

            }
        });

        set_all_products_info(new_array);



    }

    const UPDATE_PRODUCTS_STATES = gql`
    mutation UpdateStates($token: String!, $listname: String!, $listarray: [[String!]], $liststates: [[Boolean!]]) {
        editproductssate(token: $token, listname: $listname, listarray: $listarray, liststates: $liststates) 
    }
    `;
    const [updatestates, updatestatesInfo] = useMutation(UPDATE_PRODUCTS_STATES);
    // end

    const UPDATE_PRODUCTS = gql`
    mutation Editproduct($token: String!, $listname: String!, $product: String!, $newcategory: Int!, $newunit: Int!, $newnote: String, $newquanity: Float!) {
        editproduct(token: $token, listname: $listname, product: $product, newcategory: $newcategory, newunit: $newunit, newnote: $newnote, newquanity: $newquanity) 
    }
    `;

    const [updateproduct, updateInfo] = useMutation(UPDATE_PRODUCTS);

    const callback = ({ productName, currentcategory, currentunit, quantity, comment, condition }) =>
    {
        if (!condition) return;

        updateproduct({
            variables: {
                token: cookies.get('google_token'), listname: cookies.get('current_list'), product: productName,
                newcategory: category.indexOf(currentcategory), newunit: unit.indexOf(currentunit), newquanity: parseFloat(quantity), newnote: comment
            }
        });

        all_products_info.forEach((elem, index) =>
        {
            if (elem.name === productName && elem.category !== category.indexOf(currentcategory))
            {

                let temp = [...all_products_info];
                temp[index].category = category.indexOf(currentcategory);
                set_all_products_info(temp);

            }
        });

    }

    let products = [];

    const cookies = new Cookies();

    const GET_FULL_LIST_INFO = gql`
    query Getproducts($token: String!, $listname: String!) {
        getproducts(token: $token, listname: $listname) {
            name
            quanity
            note
            unit
            category
            checked
        }
    }
    `;

    const GET_CATEGORY_ORDER = gql`
    query Getcategoryorder($token: String!) {
        getuser(token: $token)
        {
            category_order
        }
    }
    `;

    const products_list = useQuery(GET_FULL_LIST_INFO, { variables: { token: cookies.get('google_token'), listname: cookies.get('current_list') } });
    const order = useQuery(GET_CATEGORY_ORDER, { variables: { token: cookies.get('google_token') } });

    if (products_list.loading || order.loading) return <CircularProgress sx={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)" }} />;

    if (products_list.data.getproducts !== all_products_info)
        set_all_products_info(products_list.data.getproducts);

    if (order.data && products_list.data)
    {
        if (all_products_info === null) return <CircularProgress sx={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)" }} />;

        all_products_info.forEach(elem =>
        {
            for (let i = 0; i < products.length; ++i)
            {
                if (products[i].category === elem.category)
                {
                    products[i].list.push(elem.name);
                    products[i].states.push(elem.checked);
                    return;
                }
            }

            products.push({ id: null, category: elem.category, list: [elem.name], states: [elem.checked] });

        });

        products.sort(compare);

        products.forEach((elem, index) => elem.id = index);

    }

    return (
        <ShowList products={products} listname={cookies.get('current_list')} entireProductInfo={all_products_info}
            callback={callback} productsStates={changeStates} IsListExpanded={ListExpanded} ListExpandationList={list_expand} ListOrder={ListOrder} ReturnListOrder={list_order} />
    );
}


class ShowList extends Component 
{
    constructor(props)
    {
        const temp_array = [], temp = [];

        for (let i = 0; i < props.products.length; ++i)
        {
            temp_array.push([]);
            for (let j = 0; j < props.products[i].list.length; ++j)
                temp_array[i].push(props.products[i].states[j]);
        }

        for (let i = 0; i < props.products.length; ++i)
            temp[i] = false;

        super(props);
        this.state = {
            items: getItems(props.products.length),
            products_state: [...temp_array],
            IsListExpanded: [...temp],
            current_product: null,
            edit_state: false,
        };
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onListExpand = this.onListExpand.bind(this);
        this.changeBoxState = this.changeBoxState.bind(this);
        this.handleCloseEdit = this.handleCloseEdit.bind(this);
        this.EditProductCallback = this.EditProductCallback.bind(this);
    }

    onDragEnd(result)
    {
        // dropped outside the list
        if (!result.destination)
        {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items
        });
    }

    componentWillReceiveProps(props)
    {
        const temp_array = [], temp = [];
        for (let i = 0; i < props.products.length; ++i)
        {
            temp_array.push([]);
            for (let j = 0; j < props.products[i].list.length; ++j)
                temp_array[i].push(props.products[i].states[j]);
        }

        for (let i = 0; i < props.products.length; ++i)
        {
            if (props.ListExpandationList === null) temp[i] = false;
            else temp.push(props.ListExpandationList[i]);
        }

        this.setState({
            items: props.ReturnListOrder === null ? getItems(props.products.length) : props.ReturnListOrder,
            products_state: [...temp_array],
            IsListExpanded: [...temp],
        });

    }

    onListExpand(e)
    {
        const id = (e.target.id[0] === 'u' || e.target.id[0] === 'd') ? e.target.id.substr(1) : e.target.id;
        const newList = [...this.state.IsListExpanded];
        newList[id] = !newList[id];
        this.setState({
            IsListExpanded: [...newList]
        });
    }

    changeBoxState(item)
    {
        for (let i = 0; i < this.props.products.length; ++i)
            if (this.props.products[i].category === item)
                return this.props.products[i].id;
    }

    EditItemInfo(product)
    {
        let res;
        this.props.entireProductInfo.forEach(e =>
        {
            if (e.name === product) res = e;
        });

        this.setState({
            current_product: res,
            edit_state: true
        });
    }

    handleCloseEdit(value)
    {
        if (!value)
        {
            this.setState({
                edit_state: false
            });
        }
    }

    EditProductCallback(value)
    {
        this.props.callback(value);
    }

    render()
    {
        const fabStyle = {
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 10,
        };
        return (
            <div>
                <AppBar sx={{ position: 'relative' }} >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="close"
                            component={Link}
                            to="../list-of-lists"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {this.props.listname}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Link to="../search">
                    <Fab color="secondary" aria-label="edit" sx={fabStyle}>
                        <AddIcon />
                    </Fab>
                </Link>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {this.state.items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                {
                                                    <div style={{ lineHeight: "34px" }}>
                                                        {category[this.props.products[item.id].category]}

                                                        <IconButton color="primary" aria-label="show list" sx={{ float: "right" }} component="span" id={item.id} onClick={this.onListExpand}>
                                                            {this.state.IsListExpanded[Number(item.id)] ? <ArrowDropUpIcon id={'u' + item.id} /> : <ArrowDropDownIcon id={'d' + item.id} />}
                                                        </IconButton>

                                                        {
                                                            this.state.IsListExpanded[Number(item.id)] &&

                                                            <List>
                                                                {this.props.products[item.id].list.map((product, product_index) =>
                                                                    (
                                                                        <ListItem
                                                                            key={product}
                                                                            secondaryAction={
                                                                                <IconButton edge="end" aria-label="changeitem" onClick={() => this.EditItemInfo(product)}>
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                            }
                                                                            disablePadding
                                                                        >
                                                                            <ListItemButton role={undefined} onClick={() =>
                                                                            {
                                                                                let product_states_temp = this.state.products_state;
                                                                                let el = this.changeBoxState(this.props.products[item.id].category);
                                                                                product_states_temp[el][product_index] = !product_states_temp[el][product_index];
                                                                                this.setState({
                                                                                    products_state: [...product_states_temp]
                                                                                });

                                                                                this.props.productsStates(product_states_temp);
                                                                                this.props.IsListExpanded(this.state.IsListExpanded);
                                                                                this.props.ListOrder(this.state.items);

                                                                            }} dense>
                                                                                <ListItemIcon>
                                                                                    <Checkbox
                                                                                        edge="start"
                                                                                        checked={this.state.products_state[
                                                                                            this.changeBoxState(this.props.products[item.id].category)][product_index]}
                                                                                        tabIndex={-1}
                                                                                        disableRipple
                                                                                    />
                                                                                </ListItemIcon>
                                                                                <ListItemText primary={this.state.products_state[this.changeBoxState(
                                                                                    this.props.products[item.id].category)][product_index] ?
                                                                                    <p style={{ textDecoration: "line-through" }}>{product}</p> : <p>{product}</p>} />
                                                                            </ListItemButton>
                                                                        </ListItem>
                                                                    )
                                                                )}
                                                            </List>

                                                        }

                                                    </div>
                                                }
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                {this.state.edit_state && <EditItem product={this.state.current_product} Compstate={this.state.edit_state} returnState={this.handleCloseEdit} callback={this.EditProductCallback} />}
            </div>
        );
    }
}
