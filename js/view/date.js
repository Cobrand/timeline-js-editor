import React from "react";
import moment from "moment";

export const MDate = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slide": "model"
    },

    handleChange(prop, event) {
        this.props.slide.set("start_date", this.parse(event.target.value));
        return moment(string, "YYYY-MM-DD");
    },

    handleChangeStart(event) {
        this.handleChange("start_date", event);
    },

    handleChangeEnd(event) {
        this.handleChange("end_date", event);
    },

    render() {
        const s = this.props.slide;
        //<input type="date"
        //               value={s.get("end_date").date.format("YYYY-MM-DD")}
        //               onChange={this.handleChangeEnd}
        //               placeholder="Fin" />
        return (
            <div className="date">
                <input type="date"
                       value={s.get("start_date").date.format("YYYY-MM-DD")}
                       onChange={this.handleChangeStart}
                       placeholder="Début" />
            </div>
        );
    }
});
