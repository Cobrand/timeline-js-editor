import React from "react";
import "utils.js";
import model from "model/model.js";

export const Preview = React.createClass({
    mixins: [React.Backbone],

    propTypes: {
        handleClosePreview: React.PropTypes.func
    },

    render() {
        return (
            <div className="preview">
                <button className="button main red fright"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleClosePreview}>
                    Fermer
                </button>
                <h1>Aperçu du rendu</h1>
                <iframe src="preview/preview.html"></iframe>
            </div>
        );
    }
});
