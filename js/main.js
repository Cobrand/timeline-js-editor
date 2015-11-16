import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";

import "../scss/main.scss";
import * as model from "model.js";
import * as view from "view.js";

const json = require("json!./example_json.json");
const timeline = model.Timeline.from_json(JSON.stringify(json));
ReactDOM.render(<view.Slides slides={timeline.events} />, document.getElementById("root"));
