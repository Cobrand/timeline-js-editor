import React from "react";
import {Slides} from "./slide.js";
import "utils.js";
import model from "model/model.js";

export const Timeline = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
    },

    propTypes: {
        timeline: React.PropTypes.objectOf(model.Timeline).isRequired
    },

    getTitle() {
        const title = this.props.timeline.get("title");
        if (title && title.text) {
            return (
                <div>
                    <h1>{title.text.headline}</h1>
                    <h2>{title.text.text}</h2>
                </div>
            );
        }
    },

    render() {
        const t = this.props.timeline;
        return (
            <div className="timeline">
                {this.getTitle()}
                <Slides slides={t.get("events")} />
            </div>
        );
    }
});
