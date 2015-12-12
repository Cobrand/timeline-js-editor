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
            <div className="slide-media">
                <input value={m.url}
                       type="url"
                       onChange={this.handleChangeUrl}
                       placeholder="URL" />
                <input value={m.credit}
                       onChange={this.handleChangeCredit}
                       placeholder="Crédit" />
                <input value={m.caption}
                       onChange={this.handleChangeCaption}
                       placeholder="Caption" />
            </div>
        );
    }
});
