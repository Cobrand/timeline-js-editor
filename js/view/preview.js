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
                <iframe src="preview.html"></iframe>
                <button className="button main red fright"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleClosePreview}>
                    Fermer
                </button>
            </div>
        );
    }
});
