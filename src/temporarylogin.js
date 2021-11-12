import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import
{
    useQuery,
    gql
} from "@apollo/client";

export default function Temporarysign(props) 
{
    const [value, ChangeValue] = useState('');

    const updateInputValue = (e) =>
    {
        ChangeValue(e.target.value);
    }
    const Onsign = (event) =>
    {
        event.preventDefault();

        let UsrId = CheckRequest(value);
        if (UsrId)
        {
            props.onLogin = UsrId;
        }
    }
    
    return (

        <form onSubmit={Onsign}>
            {loading ? <div/> : <snap/>}
            <label>
                Временный вход:
                <TextField id="temporary_login" label="Логин" variant="outlined" value={value} onChange={(e) => updateInputValue(e)} />
            </label>
            <Button variant="contained" endIcon={<SendIcon />} type="submit">
                Вход
            </Button>
        </form>

    );

}

function CheckRequest(value)
{
    const USER = gql`
        query($login : String!)
        {
            getuser(login : $login) {
                _id
            }
        }
        `;
    const { loading, error, data } = useQuery(USER, {
        variables: { value }
    });

    if (loading) console.log("loading...wait");
    if (error)
    {
        console.log(`Error! ${error}`);
        return false;
    }
    console.log(data);
    if (data.getuser._id)
    {
        return data.getuser._id;
    }
}