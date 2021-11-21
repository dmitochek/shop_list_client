import React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const Transition = React.forwardRef(function Transition(props, ref)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogAddItem(props)
{
    const units = [
        {
            value: 'withoutUnit',
            label: 'Без ед. изм',
        },
        {
            value: 'pack',
            label: 'Упаковки',
        },
        {
            value: 'kilogram',
            label: 'Киллограмы',
        },
        {
            value: 'gram',
            label: 'Граммы',
        },
        {
            value: 'millilitres',
            label: 'Миллилитры',
        },
        {
            value: 'litres',
            label: 'Литры',
        },
    ];

    const [unit, setUnit] = React.useState(units[0].value);
    const [product_name, set_product_name] = React.useState("");

    const OnUnitChange = (event) =>
    {
        setUnit(event.target.value);
    };



    const func_set_product_name = (event) =>
    {
        set_product_name(event.target.value);
        console.log(product_name);
    }

    return (
        <Dialog
            fullScreen
            open={props.isOpened}
            onClose={() => props.callback_dialog(false)}
            TransitionComponent={Transition}

        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => props.callback_dialog(false)}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Добавить покупку
                            </Typography>
                    <Button autoFocus color="inherit" onClick={() => props.callback_dialog(false)}>
                        Сохранить
                    </Button>
                </Toolbar>
            </AppBar>
            <List>
                <ListItem margin="dense">
                    <TextField autoFocus id="product_name_input" label="Название продукта" value={product_name} onChange={func_set_product_name} variant="standard" sx={{ width: '100vmax' }} />
                </ListItem>
                <ListItem margin="dense">
                    <TextField id="product_quanity" label="Количество" variant="standard" sx={{ mr: 2 }} />
                    <TextField
                        id="select-unit"
                        select
                        label="Ед. изм"
                        value={unit}
                        onChange={OnUnitChange}
                        variant="standard"
                        sx={{ width: "15vmax" }}
                    >
                        {units.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </ListItem>
            </List>
        </Dialog>
    );
}