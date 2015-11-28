import React from "react";
import "utils.js";

export const Tab = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "tab": "model",
    },

    switchToSlide() {
        this.props.handleChangeTab(this.props.tab);
    },

    render() {
        return (
            <div className="slide_tab" onClick={this.switchToSlide}>
                {this.props.tab.get("text").headline}
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
                                            handleChangeTab={this.props.handleChangeTab}
                                            />);
        return (
            <div>
                {tabs}
            </div>
        );
    }
});
