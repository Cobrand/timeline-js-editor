import React from "react";
import ReactDOM from "react-dom";

import "../scss/main.scss";
import model from "model/model.js";
import view from "view/view.js";
const json = require("example_json.json");
window.timeline = new model.Timeline(json, {parse: true});
ReactDOM.render(<view.Interface timeline={window.timeline} />,
                document.getElementById("root"));


ReactDOM.render(<view.Json timeline={window.timeline} />,
                document.getElementById("json"));

window.timelinejs = new window.TL.Timeline("timeline-embed",
                                           window.timeline.toJSON());
