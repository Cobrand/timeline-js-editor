import React from "react";
import view from "view/view.js";
import model from "model/model.js";

export const Slide = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slide": "model"
    },

    propTypes: {
        slide: React.PropTypes.objectOf(model.Slide).isRequired
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

    handleChangeText(event) {
        const s = this.props.slide;
        const text = new model.Text(s.get("text").headline, event.target.value);
        s.set({
            text
        });
    },

    handleChangeTitle(event) {
        const s = this.props.slide;
        const text = new model.Text(event.target.value, s.get("text").text);
        s.set({
            text
        });
    },

    onGroupChange(event) {
        this.props.slide.set("group", event.target.value);
    },

    toggleBgColor() {
        const s = this.props.slide;
        const bg = s.get("background");
        if (bg) {
            if (bg.color) {
                s.set("background", {url: bg.url});
            } else {
                s.set("background", {url: bg.url, color: "#ffffff"});
            }
        } else {
            s.set("background", {color: "#ffffff"});
        }
    },

    getBgColor() {
        const bg = this.props.slide.get("background");
        let val = "#ffffff";
        if (this.isColorChecked()) {
            val = bg.color;
        }
        let onBgColorChange = (event) => {
            const s = this.props.slide;
            const bg = s.get("background");
            s.set("background", Object.assign({}, bg, {color: event.target.value}));
        };
        return (
            <input type="color"
                   className="inline-block"
                   value={val}
                   onChange={onBgColorChange}>
            </input>
        );
    },

    toggleBgImage() {
        const s = this.props.slide;
        const bg = s.get("background");
        if (bg) {
            if (bg.url) {
                s.set("background", {color: bg.color});
            } else {
                s.set("background", {color: bg.color, url: ""});
            }
        } else {
            s.set("background", {url: ""});
        }
    },

    getBgImage() {
        const bg = this.props.slide.get("background");
        let val = "";
        if (this.isImageChecked()) {
            val = bg.url;
        }
        let onBgImageChange = (event) => {
            const s = this.props.slide;
            const bg = s.get("background");
            s.set("background", Object.assign({}, bg, {url: event.target.value}));
        };
        return (
            <input type="url"
                   className="inline-block"
                   placeholder="URL image de fond"
                   value={val}
                   onChange={onBgImageChange}>
            </input>
        );
    },

    isColorChecked() {
        const bg = this.props.slide.get("background");
        return bg && bg.color;
    },

    isImageChecked() {
        const bg = this.props.slide.get("background");
        return bg && bg.url;
    },

    render() {
        const s = this.props.slide;
        return (
            <div className="slide" style={this.getBg()}>
                <view.Media slide={s} />
                <div className="slide_right">
                    <input className="headline_input"
                           value={s.get("text").headline}
                           onChange={this.handleChangeTitle}
                           placeholder="Titre" />
                    <textarea name="text"
                              value={s.get("text").text}
                              onChange={this.handleChangeText}
                              placeholder="Texte" />
                    <view.MDate slide={this.props.slide} />
                    <div>
                        <input value={s.get("group")}
                               className="inline-block"
                               onChange={this.onGroupChange}
                               placeholder="Groupe" />
                    </div>
                    <div>
                        <input type="checkbox"
                               className="toggle_bg_color"
                               checked={this.isColorChecked()}
                               onClick={this.toggleBgColor}>
                        </input>
                        Fond :
                        {this.getBgColor()}
                    </div>
                    <div>
                        <input type="checkbox"
                               className="toggle_bg_image"
                               checked={this.isImageChecked()}
                               onClick={this.toggleBgImage}>
                        </input>
                        {this.getBgImage()}
                    </div>
                </div>
            </div>
        );
    }
});
