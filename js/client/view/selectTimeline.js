import React from "react";
import Promise from "bluebird";
import axios from "axios";
import model from "model/model.js";

const TimelinePreview = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
    },

    propTypes: {
        timeline: React.PropTypes.objectOf(model.Timeline).isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onSelect: React.PropTypes.func.isRequired
    },

    render() {
        return (
            <div>
                <p onClick={() => this.props.onSelect(this.props.timeline)}>
                    {this.props.timeline.get("title").get("text").headline || "pooooote"}
                </p>
                <button onClick={this.props.onDelete}>
                    Supprimer
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
            alert("Erreur lors de la récupération des timelines : " + err.statusText);
        }).finally(() => {
            this.setState({
                promise: null
            });
        });

        this.setState({promise});
    },

    componentDidMount() {
        this.refreshTimelines();
    },

    componentWillUnmount() {
        if (this.state.promise) {
            this.state.promise.cancel();
        }
    },

    deleteTimeline(id) {
        Promise.resolve().then(() => {
            return axios.delete("/api/timeline/" + id);
        }).then(() => {
            this.refreshTimelines();
        }).catch((err) => {
            alert("Erreur lors de la suppression : " + err.statusText);
        });
    },

    getPreviews() {
        let t = this.state.timelines.map((item) => {
            return <TimelinePreview timeline={item.timeline}
                                    onDelete={this.deleteTimeline.bind(null, item.id)}
                                    onSelect={this.props.handleSelect}/>;
        });
        return (
            <div>
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
            this.refreshTimelines();
        }).catch((err) => {
            alert("Erreur lors de la création : " + err.statusText);
        });
    },

    render() {
        return (
            <div className="selecttimeline">
                {this.getPreviews()}
                <button className="button main red fright"
                        name="close_select_timeline"
                        type="button"
                        onClick={this.newTimeline}>
                    Nouvelle timeline
                </button>
                <button className="button main red fright"
                        name="close_select_timeline"
                        type="button"
                        onClick={this.props.handleClose}>
                    Fermer
                </button>
            </div>
        );
    }
});
