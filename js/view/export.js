import React from "react";
import Filesaver from "filesaver.js";
import "utils.js";
import model from "model/model.js";

const EXPORT = `<div class="timeline">
    <div id="timeline-embed-RANDOMID"></div>

    <link title="timeline-styles"
          rel="stylesheet"
          href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css">
    </link>
    <style>
        html, body, #timeline-embed {
            width: 100%;
            height: 100%;
            margin: 0;
        }
    </style>
    <script src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js">
    </script>
    <script>
        (function() {
            "use strict";
            var options = {};
            window.timelinejs = new TL.Timeline("timeline-embed-RANDOMID",
                                                JSON.parse('TIMELINE'),
                                                options);
        }());
    </script>
</div>`;

export const Export = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
    },

    propTypes: {
        timeline: React.PropTypes.objectOf(model.Timeline).isRequired,
        filename: React.PropTypes.string,
        handleCloseJSON: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            which_export: "json"
        };
    },

    saveAsFile(){
        // TODO set filename as title of timeline
        let filename = this.props.filename || "timeline" ;

        let id, ext;
        switch (this.state.which_export) {
            case "json":
                id = "jsontextexport";
                ext = ".json";
                break;
            case "html":
                id = "htmltextexport";
                ext = ".html";
                break;
            default:
                throw "unsupported export type";
        }

        let txt = document.getElementById(id).textContent;
        let blob = new Blob([txt]);
        Filesaver.saveAs(blob, filename + ext);
    },

    getEmbedHtml() {
        const random_id = (Math.floor(Math.random() * 100000)).toString();
        const timeline = JSON.stringify(this.props.timeline.toJSON());
        return EXPORT.replace(/RANDOMID/g, random_id)
                     .replace(/TIMELINE/, timeline);
    },

    onWhichExportChange(event) {
        this.setState({
            which_export: event.target.value
        });
    },

    getExport() {
        if (this.state.which_export == "json") {
            return (
                <textarea id="jsontextexport"
                          className="textexport"
                          readOnly="readOnly"
                          value={JSON.stringify(this.props.timeline.toJSON())}>
                </textarea>
            );
        } else {
            return (
                <textarea id="htmltextexport"
                          className="textexport"
                          readOnly="readOnly"
                          value={this.getEmbedHtml()}>
                </textarea>
            );
        }
    },

    render() {
        return (
            <div className="export">
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
                    Sauvegarder
                </button>
                <h1>Exporter en</h1>
                <select value={this.state.which_export}
                        onChange={this.onWhichExportChange}
                        className="select_option">
                    <option value="json">JSON</option>
                    <option value="html">HTML</option>
                </select>
                {this.getExport()}
            </div>
        );
    }
});
