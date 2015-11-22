import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";

import "../scss/main.scss";
import * as Model from "model/model.js";
import * as View from "view/view.js";
const json = require("./example_json.json");
window.timeline = new Model.Timeline(json, {parse: true});
ReactDOM.render(<View.Timeline timeline={timeline} />,
                document.getElementById("root"));


ReactDOM.render(<View.Json timeline={timeline} />,
               document.getElementById("json"));

// console.log(window.timeline);
// console.log(window.timeline.toJSON());
window.timelinejs = new TL.Timeline('timeline-embed', window.timeline.toJSON());
