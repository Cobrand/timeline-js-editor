import React from "react";
import view from "view/view.js";
import model from "model/model.js";
import "../../../node_modules/quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

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

    handleChangeText(str) {
        const s = this.props.slide;
        const text = new model.Text(s.get("text").headline, str);
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
                   className="bg_color_editor_input"
                   value={val}
                   onChange={onBgColorChange}>
            </input>
        );
    },

    getBgImage() {
        const bg = this.props.slide.get("background");
        let val = "";
        if (bg && bg.url) {
            val = bg.url;
        }
        let onBgImageChange = (event) => {
            const s = this.props.slide;
            const bg = s.get("background") || {};
            const url = event.target.value;
            if (url) {
                s.set("background", Object.assign({}, bg, {url}));
            } else {
                if (bg.color) {
                    s.set("background", {color: bg.color});
                } else {
                    s.set("background", null);
                }
            }
        };
        return (
            <input type="url"
                   className="bg_url_editor_input"
                   placeholder="URL de l'image de fond"
                   value={val}
                   onChange={onBgImageChange}>
            </input>
        );
    },

    getBgEditor(){
        if (!this.isColorChecked()){
            return (
                <div className="bg_editor">
                    <div className="bg_meta">
                        <div className="bg_meta_info">
                            Fond
                        </div>
                        <view.Common.EnableButton
                               className="bg_meta_enable"
                               enabled={this.isColorChecked()}
                               handleChange={this.toggleBgColor} />
                    </div>
                </div>);
        } else {
            return (
                <div className="bg_editor">
                    <div className="bg_meta">
                        <div className="bg_meta_info">
                            Fond
                        </div>
                        <view.Common.EnableButton
                               className="bg_meta_enable"
                               enabled={this.isColorChecked()}
                               handleChange={this.toggleBgColor} />
                    </div>
                    <div className="bg_color_editor" >
                        <div className="bg_color_meta_info">Couleur :</div>
                        {this.getBgColor()}
                    </div>
                    <div className="bg_url_editor">
                        {this.getBgImage()}
                    </div>
                    <div className="bg_editor_preview"
                         style={this.getBg()}>
                        Aperçu du fond
                    </div>
                </div>);
        }
    },

    isColorChecked() {
        const bg = this.props.slide.get("background");
        return !!(bg && bg.color);
    },

    render() {
        const s = this.props.slide;
        console.log(this.isColorChecked())
        return (
            <div className="slide">
                <div className="slide_right">
                    <input className="headline_input"
                           value={s.get("text").headline}
                           onChange={this.handleChangeTitle}
                           placeholder="Titre" />
                    <ReactQuill theme="snow"
                                value={s.get("text").text}
                                onChange={this.handleChangeText} />
                    <view.MDate slide={this.props.slide} />
                    <div>
                        <input value={s.get("group")}
                               title="Peut être n'importe quel texte, la timeline essaiera d'être organisée de façon à ce que les évenements ayant le même groupe soient sur la même ligne"
                               className="inline-block"
                               onChange={this.onGroupChange}
                               placeholder="Groupe" />
                    </div>
                    {this.getBgEditor()}
                </div>
                <view.Media slide={s} />
            </div>
        );
    }
});
