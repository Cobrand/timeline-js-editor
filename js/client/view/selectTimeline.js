import React from "react";
import Promise from "bluebird";
import axios from "axios";
import swal from "sweetalert";
import model from "model/model.js";

const TimelinePreview = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
    },

    propTypes: {
        timeline: React.PropTypes.objectOf(model.Timeline).isRequired,
        timelineid: React.PropTypes.number.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onSelect: React.PropTypes.func.isRequired
    },

    render() {
        return (
            <div className="select_timeline_preview" onClick={() => this.props.onSelect(this.props.timelineid, this.props.timeline)}>
                <p>
                    {this.props.timeline.get("title").get("text").headline || "Sample Timeline"}
                </p>
                <button onClick={this.props.onDelete}
                        className="removeslide">×
                </button>
            </div>
        );
    }
});

export const SelectTimeline = React.createClass({
    propTypes: {
        handleClose: React.PropTypes.func.isRequired,
        handleSelect: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            timelines: [],
            promise: null
        };
    },

    refreshTimelines() {
        if (this.state.promise) {
            return;
        }

        let promise = Promise.resolve().then(() => {
            return axios.get("/api/user/timelines", {
                params: {
                    user_id: localStorage.getItem("user_id"),
                    credentials_key: localStorage.getItem("credentials_key")
                }
            });
        }).then((res) => {
            let timelines = res.data.timelines.map((item) => {
                return {
                    id: item.id,
                    timeline: new model.Timeline(item.timeline, {parse: true})
                };
            });
            this.setState({
                timelines
            });
        }).catch((err) => {
            swal({
                title: "Erreur réseau",
                text: "Erreur lors de la récupération des timelines : " + err.statusText,
                type: "error"
            });
        }).finally(() => {
            this.setState({
                promise: null
            });
        });

        this.setState({promise});
        return promise;
    },

    componentDidMount() {
        this.refreshTimelines();
    },

    componentWillUnmount() {
        if (this.state.promise) {
            this.state.promise.cancel();
        }
    },

    deleteTimeline(id, e) {
        Promise.resolve().then(() => {
            return axios.delete("/api/timeline/" + id, {
                data: {
                    user_id: localStorage.getItem("user_id"),
                    credentials_key: localStorage.getItem("credentials_key")
                }
            });
        }).then(() => {
            if (localStorage.getItem("current_timeline") == id) {
                localStorage.removeItem("current_timeline");
            }
            return this.refreshTimelines();
        }).catch((err) => {
            swal({
                title: "Erreur réseau",
                text: "Erreur lors de la suppression : " + err.statusText,
                type: "error"
            });
        });

        e.stopPropagation();
    },

    getPreviews() {
        let t = this.state.timelines.map((item) => {
            return <TimelinePreview timeline={item.timeline}
                                    timelineid={item.id}
                                    key={item.id}
                                    onDelete={this.deleteTimeline.bind(null, item.id)}
                                    onSelect={this.props.handleSelect}/>;
        });
        return (
            <div className="select_timeline_previews">
                {t}
            </div>
        );
    },

    newTimeline() {
        Promise.resolve().then(() => {
            return axios.post("/api/timeline/", {
                user_id: localStorage.getItem("user_id"),
                credentials_key: localStorage.getItem("credentials_key"),
                timeline: JSON.stringify((new model.Timeline()).toJSON())
            });
        }).then(() => {
            return this.refreshTimelines();
        }).catch((err) => {
            swal({
                title: "Erreur réseau",
                text: "Erreur lors de la création : " + err.statusText,
                type: "error"
            });
        });
    },

    render() {
        return (
            <div className="selecttimeline">
                <div>
                    <button className="button main red fright"
                        name="close_select_timeline"
                        type="button"
                        onClick={this.props.handleClose}>
                        Fermer
                    </button>
                    <button className="button main blue fright"
                        name="close_select_timeline"
                        type="button"
                        onClick={this.newTimeline}>
                        Nouvelle timeline
                    </button>
                </div>
                {this.getPreviews()}
            </div>
        );
    }
});
