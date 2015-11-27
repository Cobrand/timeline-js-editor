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
            <div>
                <h1>Timeline en json</h1>
                <code>{JSON.stringify(t.toJSON())}</code>
            </div>
        );
    }
});
