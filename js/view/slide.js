import React from "react";
import "utils.js";

export class Slide extends React.Component {
    getDate() {
        const s = this.props.slide;
        if (s.display_date) {
            return <p>{s.display_date}</p>;
        } else if (s.end_date) {
            return (<p> de {s.start_date.toString()} au {s.end_date && s.end_date.toString()} </p>);
        } else {
            return <p>{s.start_date.toString()}</p>;
        }
    }

    getMedia() {
        const s = this.props.slide;
        if (!s.media) {
            return;
        }
        const m = s.media;
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
    }

    getBg() {
        const s = this.props.slide;
        if (!s.background) {
            return;
        }
        const b = s.background;
        let style = Object.create(null);
        if (b.url) {
            style.backgroundImage = "url(" + b.url + ")";
        }
        if (b.color) {
            style.backgroundColor = b.color;
        }
        return style;
    }

    render() {
        const s = this.props.slide;
        return (
            <div className="slide" style={this.getBg()}>
                <h1 dangerouslySetInnerHTML={{__html: s.text.headline}} />
                <p dangerouslySetInnerHTML={{__html: s.text.text}} />
                {this.getDate()}
                {this.getMedia()}
            </div>
        );
    }
}

Slide.updateOnProps = {
    "slide": "model",
}

export class Slides extends React.Component {
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
}

Slides.updateOnProps = {
    "slides": "collection",
}
