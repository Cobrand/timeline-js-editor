import React from "react";
import model from "model/model.js";
import {hash_password} from "utils.js";
import axios from "axios";

export const SignUpScreen = React.createClass({
    mixins: [React.Backbone],

    propTypes: {
        handleClose: React.PropTypes.func.isRequired,
        signup: React.PropTypes.objectOf(model.Signup).isRequired
    },

    getInitialState() {
        return {
            signupPromise: null
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
        console.log("pote");
        let signupPromise = Promise.resolve().then(() => {
            return axios.post("/api/user/", {
                username: this.props.signup.get("login"),
                password: hash_password(this.props.signup.get("password")),
                email: this.props.signup.get("email")
            });
        }).finally(() => {
            this.setState({
                signupPromise: null
            });
        });

        this.state.set({signupPromise});
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
