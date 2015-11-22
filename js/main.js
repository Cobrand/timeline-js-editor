import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";

import "../scss/main.scss";
import * as Model from "model/model.js";
import * as View from "view/view.js";
const json = require("./example_json.json");
const timeline = new Model.Timeline(json, {parse: true});
let kek = <View.Timeline timeline={timeline} /> ;
ReactDOM.render(kek, document.getElementById("root"));
