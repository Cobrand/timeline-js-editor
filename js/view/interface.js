import React from "react";
import view from "view/view.js";
import model from "model/model.js";

export const Interface = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model"
    },

    propTypes: {
        timeline: React.PropTypes.objectOf(model.Timeline).isRequired
    },

    getInitialState() {
        return {
            current_slide: this.props.timeline.get("title"),
            json: null,
            preview: null
        };
    },

    handleChangeTab(slide) {
        this.setState({
            current_slide: slide
        });
    },

    handleRemoveSlide(tab) {
        const tabs = this.props.timeline.get("events");

        if (tabs.size() < 2) {
            this.handleChangeTab(this.props.timeline.get("title"));
            tabs.reset();
        } else {
            if (tab == this.state.current_slide) {
                let idx = tabs.indexOf(tab);

                // On prends le suivant sauf si c'est le dernier
                if (idx == tabs.size() - 1) {
                    idx -= 1;
                } else {
                    idx += 1;
                }

                this.handleChangeTab(tabs.at(idx));
            }

            tabs.remove(tab);
        }
    },

    handleAddSlide() {
        const slide = new model.Slide();
        const tabs = this.props.timeline.get("events");

        if (!this.state.current_slide) {
            tabs.add(slide);
        } else {
            const idx_new = 1 + tabs.indexOf(this.state.current_slide);
            tabs.add(slide, {at: idx_new});
        }

        this.handleChangeTab(slide);
    },

    showJSON() {
        this.setState({
            json: <view.Export timeline={this.props.timeline}
                             handleCloseJSON={this.handleCloseJSON}/>
        });
    },

    handleCloseJSON() {
        this.setState({
            json: null
        });
    },

    onChangeScale(event) {
        this.props.timeline.set("scale", event.target.value);
    },

    showPreview() {
        this.setState({
            preview: <view.Preview handleClosePreview={this.handleClosePreview}/>
        });
    },

    handleClosePreview() {
        this.setState({
            preview: null
        });
    },

    getSlide() {
        if (this.state.current_slide) {
            return <view.Slide slide={this.state.current_slide}/>;
        }
    },

    getMask() {
        if (this.state.preview || this.state.json) {
            return <div className="mask"></div>;
        }
    },

    importJSON(event) {
        const file = event.target.files[0];
        if (!file) {
            alert("Aucun fichier sélectionné");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => this.props
                                   .timeline
                                   .resetFromJson(e.target.result);
        reader.readAsText(file);
    },

    render() {
        const t = this.props.timeline;
        return (
            <div className="interface">
                <div className="menu">
                    <button className="button main blue"
                            type="button"
                            onClick={() => document.getElementById("importPicker")
                                                   .click()}>
                        Import
                    </button>
                    <input id="importPicker"
                           type="file"
                           onChange={this.importJSON}
                           style={{display: "none"}} />
                    <button className="button main blue"
                            name="show_json"
                            type="button"
                            onClick={this.showJSON}>
                        Export
                    </button>
                    <button className="button main lightblue"
                            name="preview"
                            type="button"
                            onClick={this.showPreview}>
                        Apercu timeline
                    </button>
                    <div className="selectscaletext">
                        Échelle temporelle :
                        <select name="scale"
                            value={this.props.timeline.get("scale")}
                            onChange={this.onChangeScale}
                            className="select_option">
                            <option value="human">Humaine</option>
                            <option value="cosmological">Cosmologique</option>
                        </select>
                    </div>
                </div>
                <div className="content">
                    <view.Tabs title={t.get("title")}
                               tabs={t.get("events")}
                               focused_tab={this.state.current_slide}
                               handleAddSlide={this.handleAddSlide}
                               handleChangeTab={this.handleChangeTab}
                               handleRemoveSlide={this.handleRemoveSlide}
                               />
                    {this.getSlide()}
                </div>
                {this.getMask()}
                {this.state.json}
                {this.state.preview}
            </div>
        );
    }
});
