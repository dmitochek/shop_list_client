import React, { Component } from 'react';
//import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { YandexLogin, YandexLogout } from 'react-yandex-login';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as YandexIcon } from './components/yandex_icon.svg';
import Cookies from 'universal-cookie';
import { gql, useMutation } from '@apollo/client';

export default function Auth()
{
    const navigate = useNavigate();

    const SIGN_IN = gql`
        mutation SignIn($token: String!) {
            verifyuser(token: $token)
        }
        `;

    const token_send = (token) => verifyuser({ variables: { token: token } });

    const [verifyuser, { data, loading, error }] = useMutation(SIGN_IN);

    return <AuthCont navigate={navigate} token={token_send} />;
}


class AuthCont extends Component
{
    state = {
        fail: false,
    }
    componentDidMount()
    {
        const _onInit = auth2 =>
        {
            console.log('init OK', auth2);
        }
        const _onError = err =>
        {
            console.log('error', err);
        }
        window.gapi.load('auth2', function ()
        {
            window.gapi.auth2
                .init({
                    client_id:
                        process.env.REACT_APP_GOOGLE_CLIENT_ID,
                })
                .then(_onInit, _onError);
        });
    }
    signIn = () =>
    {

        const auth2 = window.gapi.auth2.getAuthInstance();
        return auth2.signIn().then(googleUser =>
        {
            const profile = googleUser.getBasicProfile();

            console.log('ID: ' + profile.getId());
            console.log('Full Name: ' + profile.getName());
            console.log('Given Name: ' + profile.getGivenName());
            console.log('Family Name: ' + profile.getFamilyName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());

            // токен
            const cookies = new Cookies();
            const id_token = googleUser.getAuthResponse().id_token;
            this.props.token(id_token);
            cookies.set('google_token', id_token, { path: '/' });
            //console.log(cookies.get('google_token'), "!!!");
            console.log('ID Token: ' + id_token);

        });

    }
    signOut = () =>
    {
        const auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function ()
        {
            console.log('User signed out.');
        })
    }

    //Yandex
    loginSuccess = (userData) =>
    {
        console.log('User Data: ', userData);
        this.props.navigate('list-of-lists');
    }

    render()
    {
        return (
            <div className="Auth">
                <header className="Auth-cont">
                    {/*<Button onClick={this.signOut} variant="outlined">Выйти</Button>*/}
                    {
                        this.state.fail
                        &&
                        <Alert severity="error">
                            <AlertTitle>Ошибка!</AlertTitle>
                            Не удалось войти — <strong>попробуйте еще раз!</strong>
                        </Alert>
                    }
                    <GoogleLogin
                        className="googleBut"
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        buttonText={<b>Войти через Google</b>}
                        onSuccess={() => { this.signIn().then(() => this.props.navigate('list-of-lists')); }}
                        cookiePolicy={'single_host_origin'}
                        onFailure={() => this.setState({ fail: true })}
                    />

                    <YandexLogin clientID={process.env.REACT_APP_YANDEX_CLIENT_ID} onSuccess={this.loginSuccess} onFailure={() => this.setState({ fail: true })}>
                        <Button sx={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }} variant="contained" startIcon={<SvgIcon component={YandexIcon} viewBox="0 0 1080 1080" />}>
                            <p style={{ textTransform: "none", margin: "7px 0 7px 0" }}>Войти через Яндекс</p>
                        </Button>
                    </YandexLogin>

                </header>
            </div>
        );
    }
}
