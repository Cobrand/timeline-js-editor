import React from "react";
import "utils.js";

export const Json = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
    },

    render() {
        const t = this.props.timeline;
        return (
            <div className="json">
                <button className="button main red fright"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleCloseJSON}>
                    Fermer
                </button>
                <h1>Exporter en json</h1>
                <textarea className="jsontextexport" readOnly="readOnly">{JSON.stringify(t.toJSON())}</textarea>

            </div>
        );
    }
});
