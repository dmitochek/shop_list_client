import './App.css';
import React from 'react';
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

export default function Showlist(props)
{

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
    const [checked, setChecked] = React.useState([]);
    const handleToggle = (value) => () =>
    {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1)
        {
            newChecked.push(value);
        } else
        {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const ListChosen = () =>
    {
        const LISTS = gql`
            query($id : ID!)
            {
                getuser(_id : $id) {
                    lists{
                        name
                        list
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
        for (let i = 0; i < data.getuser.lists.length; ++i)
        {
            if (data.getuser.lists[i].name === props.ListChsn)
            {
                current_index = i;
            }
        }
        let elem = data.getuser.lists[current_index].list;

        return (
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
                                        checked={checked.indexOf(index) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        );
    }

    return (
        <div className="showlist">
            {props.ListChsn ? <ListChosen /> : <ListNotChosen />}
        </div>
    );
}