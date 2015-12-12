import React from "react";
import ReactDOM from "react-dom";

// For React.Backbone
import "utils.js";

import "../scss/main.scss";
import model from "model/model.js";
import view from "view/view.js";
const json = require("example_json.json");
window.timeline = new model.Timeline(json, {parse: true});
ReactDOM.render(<view.Interface timeline={window.timeline} />,
                document.getElementById("root"));
