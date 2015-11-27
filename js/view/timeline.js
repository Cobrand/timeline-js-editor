import React from "react";
import {Slides} from "./slide.js";
import "utils.js";

export const Timeline = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
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
            <div>
                {this.getTitle()}
                <Slides slides={t.get("events")} />
            </div>
        );
    }
});
