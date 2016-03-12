import React from "react";
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
            signupPromise: null,
            errorMessage: null
        };
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
        let signupPromise = Promise.resolve().then(() => {
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
            })
        }).catch((err) => {
            if (err.status === 500){
                swal({
                    "title":"Erreur serveur",
                    "text":"Le serveur a renvoyé une erreur",
                    "type":"error"
                })
                console.error("Une erreur serveur est survenue :");
                console.error(err);
            } else if (err.status === 409){
                swal({
                    "title":"Inscription échouée",
                    "text":"Nom d'utilisateur ou email déjà utilisé",
                    "type":"error"
                })
            } else {
                swal({
                    "title":"Erreur",
                    "text":"Une erreur inconnue est survenue : "+err.statusText,
                    "type":"error"
                })
                console.error("Une erreur inconnue est survenue :");
                console.error(err);
            }
        }).finally(() => {
            this.setState({
                signupPromise: null
            });
        });

        this.setState({signupPromise});
    },

    render() {
        return (
            <div className="signupscreen">
                <input type="text"
                       placeholder="Identifiant"
                       onChange={this.onChangeId}>
                </input>
                <input type="password"
                       placeholder="Mot de passe"
                       onChange={this.onChangePass}>
                </input>
                <input type="email"
                       placeholder="email"
                       onChange={this.onChangeEmail}>
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
            </div>
        );
    }
});
