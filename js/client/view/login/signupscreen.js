import React from "react";
import Spinner from "react-spin";
import model from "model/model.js";
import {hash_password} from "utils.js";
import Promise from "bluebird";
import axios from "axios";
import swal from "sweetalert";

export const SignUpScreen = React.createClass({
    mixins: [React.Backbone],

    propTypes: {
        handleClose: React.PropTypes.func.isRequired,
        signup: React.PropTypes.objectOf(model.Signup).isRequired
    },

    getInitialState() {
        return {
            loadingPromise: null
        };
    },

    getSpin(){
        if (this.state.loadingPromise){
            return <Spinner config={{top:"80%"}}/>;
        } else {
            return ;
        }
    },

    onChangeId(event) {
        this.props.signup.set({
            login: event.target.value
        });
    },

    onChangePass(event) {
        this.props.signup.set({
            password: event.target.value
        });
    },

    onChangeEmail(event) {
        this.props.signup.set({
            email: event.target.value
        });
    },

    onConnect() {
        let loadingPromise = Promise.resolve().then(() => {
            return axios.post("/api/user/", {
                username: this.props.signup.get("login"),
                password: hash_password(this.props.signup.get("password")),
                email: this.props.signup.get("email")
            });
        }).then((res) => {
            swal({
                "title":"Inscription terminée !",
                "text":"Vous êtes désormais inscrit ! Vous pouvez commencer à éditer !",
                "type":"success"
            });
            localStorage.setItem("credentials_key", res.data.credentials_key);
            localStorage.setItem("user_id", res.data.userid);
            localStorage.setItem("username", res.data.username);
            this.props.handleClose();
        }).catch((err) => {
            if (err.status === 500){
                swal({
                    "title":"Erreur serveur",
                    "text":"Le serveur a renvoyé une erreur",
                    "type":"error"
                });
                console.error("Une erreur serveur est survenue :");
                console.error(err);
            } else if (err.status === 409){
                swal({
                    "title":"Inscription échouée",
                    "text":"Nom d'utilisateur ou email déjà utilisé",
                    "type":"error"
                });
            } else {
                swal({
                    "title":"Erreur",
                    "text":"Une erreur inconnue est survenue : "+err.statusText,
                    "type":"error"
                });
                console.error("Une erreur inconnue est survenue :");
                console.error(err);
            }
        }).finally(() => {
            this.setState({
                loadingPromise: null
            });
        });

        this.setState({loadingPromise});
    },

    onKeyPressed(e) {
        // If the user presses Enter, we validate the form.
        if (e.charCode === 13) {
            this.onConnect();
        }
    },

    render() {
        return (
            <div className="signupscreen">
                <button className="closepopup"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleClose}>
                    ×
                </button>
                <h2>Inscrivez-vous</h2>
                <input type="text"
                       placeholder="Identifiant"
                       onKeyPress={this.onKeyPressed}
                       onChange={this.onChangeId}>
                </input>
                <input type="password"
                       placeholder="Mot de passe"
                       onKeyPress={this.onKeyPressed}
                       onChange={this.onChangePass}>
                </input>
                <input type="email"
                       placeholder="email"
                       onKeyPress={this.onKeyPressed}
                       onChange={this.onChangeEmail}>
                </input>
                {this.getSpin()}
                <button type="button"
                        className="button big wide blue"
                        onClick={this.onConnect}>
                    Inscription
                </button>


            </div>
        );
    }
});
