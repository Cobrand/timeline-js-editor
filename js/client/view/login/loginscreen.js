import React from "react";
import Spinner from "react-spin";
import model from "model/model.js";
import {hash_password} from "utils.js";
import Promise from "bluebird";
import axios from "axios";
import swal from "sweetalert";

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
            loadingPromise:null // if != null : currently connecting
        };
    },

    getSpin(){
        if (this.state.loadingPromise){
            return <Spinner config={{top:"80%"}}/>;
        } else {
            return ;
        }
    },

    handleChangeLogin(event) {
        this.props.login.set({
            login:event.target.value
        });
    },

    handleChangePassword(event) {
        this.props.login.set({
            password:event.target.value,
            hashed_password:hash_password(event.target.value)
        });
    },

    handleLoginButton() {
        let shouldClose = false ;
        let loadingPromise = Promise.resolve().then(() => {
            return axios.post("/api/user/connect", { // wrap ES6 promise inside bluebird
                username: this.props.login.get("login"),
                password: this.props.login.get("hashed_password")
            });
        }).then((response) => {
            localStorage.setItem("user_id", response.data.userid);
            localStorage.setItem("credentials_key", response.data.credentials_key);
            this.props.onConnect();
            shouldClose = true ;
        }).catch((err) => {
            if (err.status === 404){
                swal({
                    "title":"Identification échouée",
                    "text":"Nom d'utilisateur ou mot de passe incorrect",
                    "type":"error"
                });
            } else {
                swal({
                    "title":"Identification échouée",
                    "text":"Erreur inconnue",
                    "type":"error"
                });
                console.console.error(err);
            }
        }).finally(() => {
            this.setState({loadingPromise: null});
            if (shouldClose){
                this.props.handleClose(); // force close of this screen
            }
        });

        this.setState({loadingPromise});
    },

    onKeyPressed(e) {
        // If the user presses Enter, we validate the form.
        if (e.charCode === 13) {
            this.handleLoginButton();
        }
    },

    render() {
        return (
            <div className="loginscreen">
                <button className="closepopup"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleClose}>
                    ×
                </button>
                <h2>Connectez-vous</h2>
                <input type="text"
                       placeholder="Identifiant"
                       onKeyPress={this.onKeyPressed}
                       onChange={this.handleChangeLogin}>
                </input>
                <input type="password"
                       placeholder="Mot de passe"
                       onKeyPress={this.onKeyPressed}
                       onChange={this.handleChangePassword}>
                </input>
                {this.getSpin()}
                <button type="button"
                        className="button big wide blue"
                        onClick={this.handleLoginButton}>
                    Connexion
                </button>

            </div>
        );
    }
});
