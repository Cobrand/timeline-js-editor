import React from "react";
import model from "model/model.js";
import {hash_password} from "utils.js";
import Promise from "bluebird";
import axios from "axios";

export const LoginScreen = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "login": "model"
    },

    propTypes: {
        handleClose: React.PropTypes.func.isRequired,
        login: React.PropTypes.objectOf(model.Login).isRequired
    },

    getInitialState() {
        return {
            loginPromise:null // if != null : currently connecting
        }
    },

    handleChangeLogin(event) {
        this.props.login.set({
            login:event.target.value,
        });
    },

    handleChangePassword(event) {
        this.props.login.set({
            password:event.target.value,
            hashed_password:hash_password(event.target.value)
        });
    },

    handleLoginButton(){
        this.setState({isLoading:true});
        console.log("debut de la connexion ... creation de promise");
        this.loadingPromise = Promise.resolve().then(() => {
            return axios.post('/api/user/connect',{ // wrap ES6 promise inside bluebird
                username:this.props.login.get("username"),
                password:this.props.login.get("hashed_password")
            })
        }).then((response) => {
            console.log("UTILISATEUR CONNECTE !!!")
            console.log(response);
        }).catch((response) => {
            console.log("TU SAIS PAS TAPER TON MOT DE PASSE ??? !!!")
            console.log(response);
        }).finally(() => {
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ^^^^ important, si c'est marqué 8 fois c'est pas pour faire joli ^^^^
            this.setState({isLoading:false});
            console.log("fin de la connexion ... destruction de promise");
            this.loadingPromise = null ;
        })
    },

    getInitialState() {
        return {
            id: "",
            pass: ""
        };
    },

    onChangeId(event) {
        this.setState({id: event.target.value});
    },

    onChangePass(event) {
        this.setState({pass: event.target.value});
    },

    onConnect() {

    },

    render() {
        return (
            <div className="loginscreen">
                <input type="text"
                       placeholder="Identifiant"
                       onChange={this.onChangeId}>
                </input>
                <input type="password"
                       placeholder="Mot de passe"
                       onChange={this.onChangePass}>
                </input>
                <button type="button"
                        onClick={this.onConnect}>
                    Connexion
                </button>
                <button className="button main red fright"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleClose}>
                    Fermer
                </button>
                <input value={this.props.login.get("login")}
                       onChange={this.handleChangeLogin}
                       placeholder="login"
                       name="login" />
                <input value={this.props.login.get("password")}
                       onChange={this.handleChangePassword}
                       type="password"
                       name="password"
                       placeholder="password" />
                <button className="button main blue"
                        name="connect"
                        type="button"
                        onClick={this.handleLoginButton}>
                    Login
                </button>
            </div>
        );
    }
});
