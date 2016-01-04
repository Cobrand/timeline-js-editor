import React from "react";
import "utils.js";

export const Preview = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
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
