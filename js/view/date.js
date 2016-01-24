import React from "react";
import moment from "moment";
import DatePicker from "react-pikaday-component";
import model from "model/model.js";

export const MDate = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "slide": "model"
    },

    propTypes: {
        slide: React.PropTypes.objectOf(model.Slide).isRequired
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

    toggleEndDate() {
        const s = this.props.slide;
        if (s.get("end_date")) {
            s.set("end_date", null);
        } else {
            s.set("end_date", s.get("start_date"));
        }
    },

    getEndDate() {
        const d = this.props.slide.get("end_date");
        if (d) {
            return <DatePicker value={d.date.toDate()}
                               onChange={this.handleChangeEnd} />;
        }
    },

    render() {
        const s = this.props.slide;
        return (
            <div className="date">
                <div className="datepicker">
                    <DatePicker value={s.get("start_date").date.toDate()}
                                onChange={this.handleChangeStart} />
                    {this.getEndDate()}
                </div>
                <button name="toggle_end_date"
                        className="toggle_end_date"
                        type="button"
                        onClick={this.toggleEndDate}>
                    Date de fin
                </button>
            </div>
        );
    }
});
