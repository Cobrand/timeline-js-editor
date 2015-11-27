import React from "react";
import ReactDOM from "react-dom";

import "../scss/main.scss";
import * as Model from "model/model.js";
import * as View from "view/view.js";
const json = require("./example_json.json");
window.timeline = new Model.Timeline(json, {parse: true});
ReactDOM.render(<View.Interface timeline={window.timeline} />,
                document.getElementById("root"));


ReactDOM.render(<View.Json timeline={window.timeline} />,
                document.getElementById("json"));

window.timelinejs = new window.TL.Timeline("timeline-embed",
                                           window.timeline.toJSON());
