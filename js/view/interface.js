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

    showPreview() {

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
                <div className="menu">
                    <button name="show_json"
                            type="button"
                            onClick={this.showJSON}>
                        Export JSON
                    </button>
                    <button name="preview"
                            type="button"
                            onClick={this.showPreview}>
                        Apercu timeline
                    </button>
                </div>
                <div className="content">
                    <view.Tabs title={t.get("title")}
                               tabs={t.get("events")}
                               handleChangeTab={this.handleChangeTab}
                               />
                    {this.getSlide()}
                </div>
                {this.state.json}
            </div>
        );
    }
});
