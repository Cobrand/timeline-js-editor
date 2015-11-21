import React from "react";
import "utils.js";

export const Tab = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "tab": "model",
    },
    function switchToSlide() {
        this.props.timeline.switchToSlide(this.props.id);
    },
    render() {
        return (
            <div className="slide_tab" onClick={this.switchToSlide}>
                {this.props.id}
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
        const tabs = this.props
                           .tabs
                           .map(tab => <Tab tab={tab}
                                            key={tab.get("unique_id")}
                                            />);
        return (
            <div>{tabs}</div>
        );
    }
});
