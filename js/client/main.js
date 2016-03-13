import React from "react";
import ReactDOM from "react-dom";

// For React.Backbone
import "utils.js";

import "../../scss/main.scss";
import "../../node_modules/pikaday/css/pikaday.css";
import "../../node_modules/sweetalert/dist/sweetalert.css";

import model from "model/model.js";
import view from "view/view.js";

ReactDOM.render(<view.Interface login={new model.Login()}
                                signup={new model.SignUp()}/>,
                document.getElementById("root"));
