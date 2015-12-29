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
                    className="removebutton"
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
            <div className="slide_tab" onClick={this.switchToSlide}>
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

    handleAddSlide() {
        this.props.tabs.add(new model.Slide());
    },

    handleRemoveSlide(tab, event) {
        event.stopPropagation();
        this.props.tabs.remove(tab);
        this.props.handleRemoveSlide();
    },

    render() {
        const tabs = this.props
                         .tabs
                         .map(tab => <Tab tab={tab}
                                          key={tab.get("unique_id")}
                                          handleChangeTab={this.props.handleChangeTab}
                                          handleRemoveSlide={this.handleRemoveSlide.bind(this, tab)}
                                          />);
        return (
            <div className="tabs">
                <Tab tab={this.props.title}
                     key={this.props.title.get("unique_id")}
                     handleChangeTab={this.props.handleChangeTab}
                     />
                <hr />
                {tabs}
                <button name="add_slide"
                        type="button"
                        onClick={this.handleAddSlide}>
                    Ajouter une slide
                </button>
            </div>
        );
    }
});
