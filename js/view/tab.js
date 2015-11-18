import React from "react";
import "utils.js";

export const Tab = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "tab": "model",
    },

    render() {
        return (
            <div className="slide_tab">
                {this.props.number}
            </div>
        );
    }
});

export const Tabs = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "tabs": "collection",
    },

    render() {
        const slides = this.props
                           .tabs
                           .map(tab => <Tab tab={tab}
                                                key={tab.get("unique_id")}
                                                />);
        return (
            <div>{slides}</div>
        );
    }
});
