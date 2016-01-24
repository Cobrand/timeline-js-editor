import React from "react";
import Filesaver from "filesaver.js";
import "utils.js";
import model from "model/model.js";

export const Json = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
    },

    propTypes: {
        timeline: React.PropTypes.objectOf(model.Timeline).isRequired,
        filename: React.PropTypes.string,
        handleCloseJSON: React.PropTypes.func.isRequired
    },

    saveAsFile(){
        // TODO set filename as title of timeline
        let filename = this.props.filename || "timeline" ;
        let canvas = document.getElementById("jsontextexport");
        let blob = new Blob([canvas.textContent]);
        Filesaver.saveAs(blob, filename+".json");
    },

    render() {
        const t = this.props.timeline;
        return (
            <div className="json">
                <button className="button main red fright"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleCloseJSON}>
                    Fermer
                </button>
                <button className="button main blue fright"
                        name="save_json"
                        type="button"
                        onClick={this.saveAsFile}>
                    Sauvegarder en JSON
                </button>
                <h1>Exporter en json</h1>
                <textarea id="jsontextexport" className="jsontextexport" readOnly="readOnly">{JSON.stringify(t.toJSON())}</textarea>

            </div>
        );
    }
});
