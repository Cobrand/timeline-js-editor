import React from "react";
import "utils.js";

export const SignUpScreen = React.createClass({
    mixins: [React.Backbone],

    propTypes: {
        handleClose: React.PropTypes.func
    },

    getInitialState() {
        return {
            id: "",
            pass: "",
            email: ""
        };
    },

    onChangeId(event) {
        this.setState({id: event.target.value});
    },

    onChangePass(event) {
        this.setState({pass: event.target.value});
    },

    onChangeEmail(event) {
        this.setState({email: event.target.value});
    },

    onConnect() {

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
