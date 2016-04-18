import React from "react";
import model from "model/model.js";
import {embed_media} from "embed_media.js";

export const Media = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slide": "model"
    },

    propTypes: {
        slide: React.PropTypes.objectOf(model.Slide).isRequired
    },

    handleChangeUrl(event) {
        this.set("url", event.target.value);
    },

    handleChangeCredit(event) {
        this.set("credit", event.target.value);
    },

    handleChangeCaption(event) {
        this.set("caption", event.target.value);
    },

    set(key, value) {
        const m = this.props.slide.get("media");
        const pote = new model.Media.from_object(m);
        pote[key] = value;
        this.props.slide.set("media", pote);
    },

    render() {
        const m = this.props.slide.get("media");
        if (!m) {
            return;
        }
        return (
            <div className="slide_media">
                <div className="slide_media_meta_info">Media</div>
                {embed_media(m.url)}
                <div className="slide_media_info">
                    <input className="slide_media_url" value={m.url}
                           type="url"
                           onChange={this.handleChangeUrl}
                           placeholder="URL" />
                    <textarea className="slide_media_credit" value={m.credit || ""}
                              onChange={this.handleChangeCredit}
                              placeholder="Crédit" />
                    <textarea className="slide_media_caption" value={m.caption || ""}
                              onChange={this.handleChangeCaption}
                              placeholder="Caption" />
                </div>
            </div>
        );
    }
});
