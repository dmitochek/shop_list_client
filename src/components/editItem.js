import * as React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
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
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const category = ["Хлеб & хлебобулочные изделия", "Овощи & грибы", "Фрукты", "Замороженные овощи", "Молочная продукция", "Мясная & колбасная продукция", "Рыба", "Бакалея", "Напитки", "Кондитерские изделия"];

const unit = ["литр", "кг", "граммы", "упаковки", "мл"];

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditItem(props)
{
    const [categoryVal, setCategory] = React.useState(category[props.product.category]);
    const [unitVal, setUnit] = React.useState(unit[props.product.unit]);
    const [quantityVal, setQuantity] = React.useState(props.product.quanity);
    const [commentVal, setComment] = React.useState(props.product.note);

    const handleClose = (e) =>
    {
        props.returnState(false);
        props.callback({ productName: props.product.name, currentcategory: categoryVal, currentunit: unitVal, quantity: quantityVal, comment: commentVal, condition: e.target.id === "save" ? true : false });
        console.log(e.target.id)
    };

    const handleCategory = (e) =>
    {
        setCategory(e.target.value);
    };

    const handleUnit = (e) =>
    {
        setUnit(e.target.value);
    };

    const handleQuanity = (e) =>
    {
        setQuantity(e.target.value);
    };

    const handleComment = (e) =>
    {
        setComment(e.target.value);
    };

    return (
        <Dialog
            fullScreen
            open={props.Compstate}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
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
                        {props.product.name}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClose} id="save">
                        Сохранить
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: "flex", flexDirection: "column", flexWrap: "nowrap", mt: "15px" }}>
                <FormControl sx={{ mt: "15px", ml: "auto", mr: "auto", width: "90%" }}>
                    <InputLabel id="category">Категория</InputLabel>
                    <Select
                        labelId="category-select"
                        id="category-select"
                        value={categoryVal}
                        label="Age"
                        onChange={handleCategory}
                    >
                        {category.map(elem =>
                        {
                            return (<MenuItem key={elem} value={elem}>{elem}</MenuItem>);
                        })}
                    </Select>
                </FormControl>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    <FormControl sx={{ mt: "15px" }}>
                        <InputLabel id="category">Единицы измерения</InputLabel>
                        <Select
                            labelId="category-select"
                            id="category-select"
                            value={unitVal}
                            label="Age"
                            onChange={handleUnit}
                        >
                            {unit.map(elem =>
                            {
                                return (<MenuItem key={elem} value={elem}>{elem}</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                    <TextField sx={{ mt: "15px" }} id="field-quantity" label="Количество" variant="standard" value={quantityVal} onChange={handleQuanity} />
                </Box>
                <TextField
                    sx={{ mt: "15px", ml: "auto", mr: "auto", width: "90%" }}
                    id="comment"
                    label="Комментарий"
                    multiline
                    rows={3}
                    defaultValue={props.product.note === null ? "" : props.product.note}
                    onChange={handleComment}
                />
            </Box>
        </Dialog>

    );
}