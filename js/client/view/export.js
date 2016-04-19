import React from "react";
import Filesaver from "filesaver.js";
import "utils.js";
import model from "model/model.js";

const EXPORT = `<div class="timeline">
    <div class="timeline-js-embed" id="timeline-embed-RANDOMID"></div>

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

        let txt = document.getElementById(id).value;
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
                <div>
                    <p>
                        L'export en JSON permet de sauvegarder son travail.
                        Il peut être chargé à l'aide du bouton "Ouvrir"
                    </p>
                    <textarea id="jsontextexport"
                              className="textexport"
                              readOnly="readOnly"
                              value={JSON.stringify(this.props.timeline.toJSON())}>
                    </textarea>
                </div>
            );
        } else {
            return (
                <div>
                    <p>
                        L'export en HTML permet d'intégrer la timeline dans un site web.
                        Il suffit de copier-coller le texte ci-contre dans la page web.
                        La timeline devrait alors s'y intégrer.
                    </p>
                    <textarea id="htmltextexport"
                              className="textexport"
                              readOnly="readOnly"
                              value={this.getEmbedHtml()}>
                    </textarea>
                </div>
            );
        }
    },

    render() {
        return (
            <div className="export">
                <button className="closepopup"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleCloseJSON}>
                    ×
                </button>
                <h1>Exporter en</h1>
                <select value={this.state.which_export}
                        onChange={this.onWhichExportChange}
                        className="select_option">
                    <option value="json">JSON</option>
                    <option value="html">HTML</option>
                </select>
                <button className="save_as"
                        name="save_json"
                        type="button"
                        onClick={this.saveAsFile}>
                    Enregistrer sous
                </button>
                {this.getExport()}
            </div>
        );
    }
});
