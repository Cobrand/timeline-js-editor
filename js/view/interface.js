import React from "react";
import view from "view/view.js";

export const Interface = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
    },

    getInitialState() {
        return {
            current_slide: this.props.timeline.get("title"),
            json: null
        };
    },

    handleChangeTab(slide) {
        this.setState({
            current_slide: slide
        });
    },

    handleRemoveSlide() {
        // TODO: better handler
        if (!this.props.timeline.get("events").contains(this.state.current_slide)) {
            this.state.current_slide = null;
        }
        this.forceUpdate();
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

    onChangeScale(event) {
        this.props.timeline.set("scale", event.target.value);
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
                    Échelle temporelle :
                    <select name="scale"
                            value={this.props.timeline.get("scale")}
                            onChange={this.onChangeScale}>
                        <option value="human">Humaine</option>
                        <option value="cosmological">Cosmologique</option>
                    </select>
                </div>
                <div className="content">
                    <view.Tabs title={t.get("title")}
                               tabs={t.get("events")}
                               handleChangeTab={this.handleChangeTab}
                               handleRemoveSlide={this.handleRemoveSlide}
                               />
                    {this.getSlide()}
                </div>
                {this.state.json}
            </div>
        );
    }
});
