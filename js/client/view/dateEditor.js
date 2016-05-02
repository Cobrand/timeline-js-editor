import React from "react";
import moment from "moment";
import DatePicker from "react-pikaday-component";
import view from "view/view.js";
import model from "model/model.js";

export const DateEditor = React.createClass({
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
        } else {
            return <DatePicker value={this.props
                                          .slide
                                          .get("start_date")
                                          .date
                                          .toDate()}
                               disabled={true} />;
        }
    },

    render() {
        const s = this.props.slide;
        const end_date = s.get("end_date");
        const hasEndDate = !!end_date ;
        const option = hasEndDate ? 1 : 0 ;
        if (hasEndDate){
            return (
                <div className="date_editor">
                    <view.Common.EitherButton
                        option1text="Évenement ponctuel"
                        commonClassName="date_editor_meta_switch"
                        option2text="Évenement continu"
                        option={option}
                        handleChange={this.toggleEndDate} />
                    <div className="date_editor_begin_date">
                        <div className="date_editor_meta_info">
                            Date de début :
                        </div>
                        <DatePicker value={s.get("start_date").date.toDate()}
                                    onChange={this.handleChangeStart}
                                    className="date_editor_pikaday" />
                    </div>
                    <div className="date_editor_end_date">
                        <div className="date_editor_meta_info">
                            Date de fin :
                        </div>
                        <DatePicker value={end_date.date.toDate()}
                                    onChange={this.handleChangeEnd}
                                    className="date_editor_pikaday" />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="date_editor">
                    <view.Common.EitherButton
                        option1text="Évenement ponctuel"
                        commonClassName="date_editor_meta_switch"
                        option2text="Évenement continu"
                        option={option}
                        handleChange={this.toggleEndDate} />
                    <div className="date_editor_begin_date">
                        <div className="date_editor_meta_info">
                            Date :
                        </div>
                        <DatePicker value={s.get("start_date").date.toDate()}
                                    onChange={this.handleChangeStart}
                                    className="date_editor_pikaday" />
                    </div>
                </div>
            );
        }

    }
});
/*
<input name="toggle_end_date"
       className="toggle_end_date"
       type="checkbox"
       value={this.props.slide.get("end_date")}
       onClick={this.toggleEndDate}>
</input>
*/
