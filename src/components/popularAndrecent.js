import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BoltIcon from '@mui/icons-material/Bolt';
import HistoryIcon from '@mui/icons-material/History';
import List from '@mui/material/List';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';



export default function PopularAndRecentInfo(props)
{
    let array = [{ name: "Яблоки" }, { name: "Булка" }, { name: "Кока-кола" }, { name: "Картоха" }];
    return (<PopularAndRecent info={array} />);
}


function PopularAndRecent(props)
{
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) =>
    {
        setValue(newValue);
    };

    const remove = () =>
    {

    };

    const add = () =>
    {

    };

    return (
        <div className="popandpre">
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="popular and recent products"
                variant="fullWidth"
            >
                <Tab icon={<BoltIcon />} iconPosition="start" label="Популярные" />
                <Tab icon={<HistoryIcon />} iconPosition="start" label="Недавние" />
            </Tabs>
            <List>

                {props.info.map((elem) =>
                    (
                        <ListItem
                            key={elem.name}
                            role={undefined}
                            dense
                            button
                        >
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={true}
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

            </List>
        </div>
    );
}
