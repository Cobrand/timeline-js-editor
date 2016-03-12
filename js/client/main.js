import React from "react";
import ReactDOM from "react-dom";

// For React.Backbone
import "utils.js";

import "../../scss/main.scss";
import "../../node_modules/pikaday/css/pikaday.css";
import "../../node_modules/sweetalert/dist/sweetalert.css";

import model from "model/model.js";
import view from "view/view.js";
const json = require("example_json.json");
window.timeline = new model.Timeline(json, {parse: true});
ReactDOM.render(<view.Interface timeline={window.timeline}
                                login={new model.Login()}
                                signup={new model.SignUp()}/>,
                document.getElementById("root"));
