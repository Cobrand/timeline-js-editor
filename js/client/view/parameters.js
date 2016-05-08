import React from "react";
import "utils.js";

export const Parameters = React.createClass({
    mixins: [React.Backbone],

    propTypes: {
        handleCloseParameters: React.PropTypes.func
    },

    render() {
        return (
            <div className="parameters_popup">
                <button className="closepopup"
                        name="close_parameters"
                        type="button"
                        onClick={this.props.handleClose}>
                    ×
                </button>
                <h1> Paramètres </h1>
                <div className="change_password_form">
                    <h2> Changer le mot de passe </h2>
                    <input type="password"
                           placeholder="Mot de passe actuel" >
                    </input>
                    <input type="password"
                           placeholder="Nouveau mot de passe" ></input>
                    <input type="password"
                           placeholder="Répéter le nouveau mot de passe" >
                    </input>
                </div>
            </div>
        );
    }
});
