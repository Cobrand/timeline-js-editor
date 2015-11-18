import React from "react";
import "utils.js";

export const Slide = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slide": "model",
    },

    getDate() {
        const s = this.props.slide;
        if (s.get("display_date")) {
            return <p>{s.get("display_date")}</p>;
        } else if (s.get("end_date")) {
            return (<p> de {s.get("start_date").toString()} au {s.get("end_date") && s.get("end_date").toString()} </p>);
        } else {
            return <p>{s.get("start_date").toString()}</p>;
        }
    },

    getMedia() {
        const m = this.props.slide.get("media");
        if (!m) {
            return;
        }
        const url = <a href="{m.url}">{m.url}</a>;
        const caption = m.caption ?
            <figcaption dangerouslySetInnerHTML={{__html: m.caption}}
                        className="caption">
            </figcaption> : null;
        const credit = m.credit ?
            <figcaption dangerouslySetInnerHTML={{__html: m.credit}}
                        className="credit">
            </figcaption> : null;
        return (
            <figure>
                {url}
                {caption}
                {credit}
            </figure>
        );
    },

    getBg() {
        const b = this.props.slide.get("background");
        if (!b) {
            return;
        }
        let style = Object.create(null);
        if (b.url) {
            style.backgroundImage = "url(" + b.url + ")";
        }
        if (b.color) {
            style.backgroundColor = b.color;
        }
        return style;
    },

    render() {
        const s = this.props.slide;
        return (
            <div className="slide" style={this.getBg()}>
                <h1 dangerouslySetInnerHTML={{__html: s.get("text").headline}} />
                <p dangerouslySetInnerHTML={{__html: s.get("text").text}} />
                {this.getDate()}
                {this.getMedia()}
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
                                                key={slide.get("unique_id")}
                                                />);
        return (
            <div>{slides}</div>
        );
    }
});
