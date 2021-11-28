import './App.css';
import React from 'react';
import DialogAddItem from './components/Dialog';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useQuery, gql } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import useState from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function Showlist(props)
{
    const fabStyle = {
        position: 'absolute',
        bottom: 16,
        right: 16,
    };
    const [isOpened, setIsOpened] = React.useState(false);
    const [checked, setChecked] = React.useState([]);

    //adding lists to checkboxes state
    let exist = false;

    for (let i = 0; i < checked.length; ++i)
    {
        if (checked[i].name === props.ListChsn)
        {
            exist = true;
            break;
        }
    }

    if (!exist && props.ListChsn != null)
    {
        const newChecked = [...checked];
        newChecked.push({ name: props.ListChsn, indexes: [] });
        setChecked(newChecked);
        console.log(checked);
    }

    const ListNotChosen = () =>
    {
        return (
            <Alert severity="info" id="Newalert">
                <AlertTitle>Внимание!</AlertTitle>
                Создайте новый список покупок или выберите уже созданный в меню =)
            </Alert>
        );
    }

    //[{name: "listname", indexes: [1, 2, 3]}]
    const checkboxTapAction = (index) =>
    {
        let listId;
        for (let i = 0; i < checked.length; ++i)
        {
            if (checked[i].name === props.ListChsn)
            {
                listId = i;
                break;
            }
        }
        return checked[listId].indexes.indexOf(index) !== -1;
    }

    const handleToggle = (value) => () =>
    {
        let arrayIndex;
        for (let i = 0; i < checked.length; ++i)
        {
            if (checked[i].name === props.ListChsn)
            {
                arrayIndex = i;
                break;
            }
        }


        const currentIndex = checked[arrayIndex].indexes.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1)
        {
            newChecked[arrayIndex].indexes.push(value);
        } else
        {
            newChecked[arrayIndex].indexes.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        console.log(checked);
    };

    function ListChosen()
    {
        const LISTS = gql`
            query($id : ID!)
            {
                getuser(_id : $id) {
                    lists{
                        name
                        list
                        {
                            product_name
                            product_quantity
                            product_units_value
                        }
                    }
                }
            }
            `;
        const { loading, error, data } = useQuery(LISTS, {
            variables: { id: props.UsID }
        });

        if (loading) return <CircularProgress className="loading" />;

        if (error) return
        (<Alert severity="error">
            <AlertTitle>Ошибка</AlertTitle>
            Описание ошибки:<strong>{error}</strong>
        </Alert>);

        let current_index;
        console.log(data);
        for (let i = 0; i < data.getuser.lists.length; ++i)
        {
            console.log(data.getuser.lists[i].name + " " + props.ListChsn);
            if (data.getuser.lists[i].name === props.ListChsn || data.getuser.lists[i].name === props.PrevListNm)
            {
                current_index = i;
            }
        }

        console.log(props.ListChsn);
        let elem = data.getuser.lists[current_index].list;

        return (
            <div className="products">
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {elem.map((value, index) =>
                    {
                        const labelId = `checkbox-list-label-${index}`;

                        return (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="comments">
                                        <EditIcon />
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checkboxTapAction(index)}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={value.product_name} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Fab color="primary" sx={fabStyle} aria-label="add" onClick={() => setIsOpened(true)}>
                    <AddIcon />
                </Fab>

                <DialogAddItem isOpened={isOpened} callback_dialog={setIsOpened} user_id={props.UsID} list_name={props.ListChsn} />

            </div >
        );
    }

    return (
        <div className="showlist">
            {props.ListChsn ? <ListChosen /> : <ListNotChosen />}
        </div>
    );
}