import React from "react";
import "utils.js";

export const Preview = React.createClass({
    mixins: [React.Backbone],

    propTypes: {
        handleClosePreview: React.PropTypes.func
    },

    render() {
        return (
            <div className="preview">
                <button className="closepopup"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleClosePreview}>
                    ×
                </button>
                <h1>Aperçu du rendu</h1>
                <p>
                    Cette fenêtre donne un aperçu de la timeline actuelle telle
                    qu'elle apparaîtra dans Timeline.js
                </p>
                <iframe src="preview/preview.html"></iframe>
            </div>
        );
    }
});
