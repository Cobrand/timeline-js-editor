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
            errorMessage: null,
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

    handleLoginButton() {
        console.log("debut de la connexion ... creation de promise");
        let loadingPromise = Promise.resolve().then(() => {
            return axios.post("/api/user/connect", { // wrap ES6 promise inside bluebird
                username: this.props.login.get("login"),
                password: this.props.login.get("hashed_password")
            });
        }).then((response) => {
            console.log("UTILISATEUR CONNECTE !!!")
            console.log(response);
            this.setState({
                errorMessage: null
            });
        }).catch((err) => {
            console.log("TU SAIS PAS TAPER TON MOT DE PASSE ??? !!!")
            console.log(err);
            this.setState({
                errorMessage: err.statusText
            });
        }).finally(() => {
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ne pas oublier de mettre des arrow function sinon le this n'est pas bind
            // ^^^^ important, si c'est marqué 8 fois c'est pas pour faire joli ^^^^
            console.log("fin de la connexion ... destruction de promise");
            this.setState({loadingPromise: null});
        });

        this.setState({loadingPromise});
    },

    render() {
        return (
            <div className="loginscreen">
                <input type="text"
                       placeholder="Identifiant"
                       onChange={this.handleChangeLogin}>
                </input>
                <input type="password"
                       placeholder="Mot de passe"
                       onChange={this.handleChangePassword}>
                </input>
                <button type="button"
                        onClick={this.handleLoginButton}>
                    Connexion
                </button>
                <button className="button main red fright"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleClose}>
                    Fermer
                </button>
                {this.state.errorMessage}
            </div>
        );
    }
});
