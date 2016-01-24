import React from "react";
import moment from "moment";
import DatePicker from "react-pikaday-component";
import model from "model/model.js";

export const MDate = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slide": "model"
    },

    handleChange(prop, date) {
        const mdate = new model.MDate(moment(date));
        this.props.slide.set(prop, mdate);
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
                <DatePicker value={s.get("start_date").date.toDate()}
                         onChange={this.handleChangeStart} />
            </div>
        );
    }
});
