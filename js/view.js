import React from "react";
import "utils.js";

export const Slide = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slide": "model",
    },

    render() {
        const s = this.props.slide;
        return (
            <div>
                <h1>{s.text.headline}</h1>
                <p>{s.text.text}</p>
                <p>from {s.start_date} to {s.end_date}</p>
            </div>
        );
    }
});

export const Slides = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slides": "collection",
    },

    render() {
        const slides = this.props
                           .slides
                           .map(slide => <Slide slide={slide}
                                                key={slide.unique_id}
                                                />);
        return (
            <div>{slides}</div>
        );
    }
})