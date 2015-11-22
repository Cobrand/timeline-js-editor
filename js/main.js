import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";

import "../scss/main.scss";
import * as Model from "model/model.js";
import {Timeline} from "view/view.js";
import {Json} from "view/json.js";

const json = require("./example_json.json");
window.timeline = new Model.Timeline(json, {parse: true});

ReactDOM.render(<Timeline timeline={timeline} />,
                document.getElementById("root"));
ReactDOM.render(<Json timeline={timeline} />,
               document.getElementById("json"));

window.timelinejs = new TL.Timeline('timeline-embed', window.timeline.toJSON());
