import React from "react";
import {Slide,Slides} from "./slide.js"
import "utils.js";

export const Timeline = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "collection",
    },

    getTitle() {
        const t = this.props.timeline;
        if (t.title.text) {
            return (
                <div>
                    <h1>{t.title.text.headline}</h1>
                    <h2>{t.title.text.text}</h2>
                </div>
            );
        }
    },

    render() {
        const t = this.props.timeline;
        return (
            <div>
                {this.getTitle()}
                <Slides slides={t.events} />
            </div>
        );
    }
});
