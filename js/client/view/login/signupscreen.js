import React from "react";
import "utils.js";

export const SignUpScreen = React.createClass({
    mixins: [React.Backbone],

    propTypes: {
        handleCloseSignUpScreen: React.PropTypes.func
    },

    render() {
        return (
            <div className="signupscreen">
                <button className="button main red fright"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleCloseSignUpScreen}>
                    Fermer
                </button>
            </div>
        );
    }
});
