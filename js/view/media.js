import React from "react";

export const Media = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slide": "model"
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
        const pote = Object.assign({}, this.props.slide.get("media"));
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
                <div className="slide_media_preview"></div>
                <input className="slide_media_url" value={m.url}
                       type="url"
                       onChange={this.handleChangeUrl}
                       placeholder="URL" />
                <textarea className="slide_media_credit" value={m.credit}
                          onChange={this.handleChangeCredit}
                          placeholder="Crédit" />
                <textarea className="slide_media_caption" value={m.caption}
                          onChange={this.handleChangeCaption}
                          placeholder="Caption" />
            </div>
        );
    }
});
