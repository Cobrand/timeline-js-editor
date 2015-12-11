import React from "react";
import view from "view/view.js";

export const Interface = React.createClass({
    getInitialState() {
        return {
            current_slide: null,
            json: null
        };
    },

    handleChangeTab(slide) {
        this.setState({
            current_slide: slide
        });
    },

    showJSON() {
        this.setState({
            json: <view.Json timeline={this.props.timeline}
                             handleCloseJSON={this.handleCloseJSON}/>
        });
    },

    handleCloseJSON() {
        this.setState({
            json: null
        });
    },

    getSlide() {
        if (this.state.current_slide) {
            return <view.Slide slide={this.state.current_slide}/>;
        }
    },

    render() {
        const t = this.props.timeline;
        return (
            <div className="interface">
                <button name="show_json"
                        type="button"
                        onClick={this.showJSON}>
                    Export JSON
                </button>
                <view.Tabs tabs={t.get("events")}
                           handleChangeTab={this.handleChangeTab}
                           />
                {this.getSlide()}
                {this.state.json}
            </div>
        );
    }
});
