import React from "react";
import view from "view/view.js";

export const Interface = React.createClass({
    getInitialState() {
        return {
            current_slide: null
        };
    },

    handleChangeTab(slide) {
        this.setState({
            current_slide: slide
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
                <view.Tabs tabs={t.get("events")}
                           handleChangeTab={this.handleChangeTab}
                           />
                {this.getSlide()}
            </div>
        );
    }
});
