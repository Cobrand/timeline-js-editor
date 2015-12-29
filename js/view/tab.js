import React from "react";
import model from "model/model.js";

export const Tab = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "tab": "model"
    },

    switchToSlide() {
        this.props.handleChangeTab(this.props.tab);
    },

    getButtonRemove() {
        let callback = this.props.handleRemoveSlide;
        if (callback) {
            return (
                <button
                    className="removeslide"
                    name="remove_this_slide"
                    type="button"
                    onClick={callback}>
                    X
                </button>
            );
        }
    },

    render() {
        return (
            <div className="slide_tab" onClick={this.switchToSlide} data-focused={this.props.focused}>
                {this.props.tab.get("text").headline} {this.getButtonRemove()}
            </div>
        );
    }
});

export const Tabs = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "tabs": "collection"
    },

    handleRemoveSlide(tab, event) {
        event.stopPropagation();
        this.props.tabs.remove(tab);
        this.props.handleRemoveSlide();
    },

    getTitleTab() {
        const tab = this.props.title;
        return (
            <Tab tab={tab}
                 key={tab.get("unique_id")}
                 focused={tab === this.props.focused_tab}
                 handleChangeTab={this.props.handleChangeTab}
                 />
        );
    },

    render() {
        const tabs = this.props
                         .tabs
                         .map(tab => <Tab tab={tab}
                                          key={tab.get("unique_id")}
                                          focused={tab === this.props.focused_tab}
                                          handleChangeTab={this.props.handleChangeTab}
                                          handleRemoveSlide={this.handleRemoveSlide.bind(this, tab)}
                                          />);
        return (
            <div className="tabs">
                {this.getTitleTab()}
                <hr />
                {tabs}
                <button className="newslide"
                        name="add_slide"
                        type="button"
                        onClick={this.props.handleAddSlide}>
                    Nouvelle slide
                </button>
            </div>
        );
    }
});
