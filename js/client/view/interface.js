import React from "react";
import view from "view/view.js";
import model from "model/model.js";
import Promise from "bluebird";
import axios from "axios";
import swal from "sweetalert";

export const Interface = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model",
        "login": "model",
        "signup": "model",
    },

    propTypes: {
        login: React.PropTypes.objectOf(model.Login).isRequired,
        signup: React.PropTypes.objectOf(model.SignUp).isRequired,
    },

    getInitialState() {
        let timeline = new model.Timeline();
        timeline.get("events").add(new model.Slide());
        if (localStorage.getItem("credentials_key")) {
            let id = localStorage.getItem("current_timeline");
            if (id && id !== "undefined") {
                Promise.resolve().then(() => {
                    return axios.get("/api/timeline/" + id, {
                        params: {
                            user_id: localStorage.getItem("user_id"),
                            credentials_key: localStorage.getItem("credentials_key"),
                            timeline_id: id
                        }
                    });
                }).then((res) => {
                    let timeline = new model.Timeline(res.data.timeline,
                                                      {parse: true});
                    this.handleSelectTimeline(id, timeline);
                }).catch((err) => {
                    swal({
                        title: "Erreur serveur",
                        text: "Erreur de sauvegarde : " + err.statusText,
                        type: "error"
                    });
                });
            }
        } else {
            const json = require("example_json.json");
            timeline = new model.Timeline(json, {parse: true});
        }
        return {
            current_slide: timeline.get("title"),
            timeline,
            json: null,
            preview: null,
            loginScreen: null,
            signupScreen: null,
            selectTimelineScreen: null,
            isConnected:(!!localStorage.getItem("credentials_key"))
        };
    },

    handleChangeTab(slide) {
        this.setState({
            current_slide: slide
        });
    },

    handleRemoveSlide(tab) {
        const tabs = this.state.timeline.get("events");

        if (tabs.size() < 2) {
            this.handleChangeTab(this.state.timeline.get("title"));
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
        const tabs = this.state.timeline.get("events");

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
            json: <view.Export timeline={this.state.timeline}
                             handleCloseJSON={this.handleCloseJSON}/>
        });
    },

    handleCloseJSON() {
        this.setState({
            json: null
        });
    },

    onChangeScale(event) {
        this.state.timeline.set("scale", event.target.value);
    },

    showPreview() {
        window.timeline = this.state.timeline;
        this.setState({
            preview: <view.Preview handleClosePreview={this.handleClosePreview}/>
        });
    },

    handleClosePreview() {
        console.log("mdr");
        this.setState({
            preview: null
        });
    },

    saveTimeline() {
        let credentials_key = localStorage.getItem("credentials_key") ;
        let user_id = localStorage.getItem("user_id") ;

        Promise.resolve().then(() => {
            let timelineid = localStorage.getItem("current_timeline");
            let url = "/api/timeline/";
            if (timelineid && timelineid !== "undefined") {
                url += timelineid;
            }

            return axios.post(url, {
                credentials_key,
                user_id,
                timeline: JSON.stringify(this.state.timeline.toJSON()),
                timeline_id: timelineid
            });
        }).then((msg) => {
            const timelineid = msg.data.timelineid;
            if (timelineid && timelineid !== "undefined") {
                localStorage.setItem("current_timeline", timelineid);
            }
        }).catch((err) => {
            swal({
                title:"Erreur serveur",
                text:"Erreur de sauvegarde : "+ err.statusText,
                type:"error"
            });
            console.error(err);
        }).catch((err) => {
            swal({
                title: "Erreur réseau",
                text: "Unexpected error : " + err.name,
                type: "error"
            });
            throw err ;
        });
    },

    disconnect(){
        localStorage.removeItem("current_timeline");
        localStorage.removeItem("user_id");
        localStorage.removeItem("credentials_key");
        this.setState({
            isConnected:false
        })
    },

    getUserInterface(){
        let credentials_key = localStorage.getItem("credentials_key") ;
        let user_id = localStorage.getItem("user_id") ;

        if ( credentials_key && user_id ){
            return (
                <div style={{display:"inline"}}>
                    <button className="topnav_element"
                            id="save_timeline"
                            onClick={this.saveTimeline}>
                        Mettre à jour
                    </button>
                    <button className="topnav_element"
                            id="select_timeline_button"
                            onClick={this.showSelectTimelineScreen}>
                        Mes timelines
                    </button>
                    <button className="topnav_element red fright"
                            id="disconnect"
                            onClick={this.disconnect}>
                        Déconnexion
                    </button>
                </div>
            );
        } else {
            return (<div style={{display:"inline"}}>
                <button className="topnav_element fright"
                        id="open_login"
                        type="button"
                        onClick={this.showLoginScreen}>
                    Connexion
                </button>
                <button className="topnav_element fright"
                        id="open_signup"
                        type="button"
                        onClick={this.showSignupScreen}>
                    Inscription
                </button>
            </div>);
            // user is not connected, show him the login + sign up buttons
        }
    },

    showLoginScreen() {
        this.setState({
            loginScreen: <view.LoginScreen handleClose={this.handleCloseLoginScreen}
                                           login={this.props.login}
                                           onConnect={this.onConnect}/>
        });
    },

    handleCloseLoginScreen() {
        this.setState({
            loginScreen: null
        });
    },

    showSignupScreen() {
        this.setState({
            signupScreen: <view.SignUpScreen handleClose={this.handleCloseSignupScreen}
                                             signup={this.props.signup}/>
        });
    },

    handleCloseSignupScreen() {
        this.setState({
            signupScreen: null
        });
    },

    showSelectTimelineScreen() {
        this.setState({
            selectTimelineScreen: <view.SelectTimeline handleClose={this.handleCloseSelectTimelineScreen}
                                                       handleSelect={this.handleSelectTimeline} />
        });
    },

    handleCloseSelectTimelineScreen() {
        this.setState({
            selectTimelineScreen: null
        });
    },

    handleSelectTimeline(id, timeline) {
        this.handleCloseSelectTimelineScreen();
        this.setState({
            timeline,
            current_slide: timeline.get("title")
        });
        if (id) {
            localStorage.setItem("current_timeline", id);
        }
    },

    getSlide() {
        if (this.state.current_slide) {
            return <view.Slide slide={this.state.current_slide}/>;
        }
    },

    closeAllPopups(){
        this.handleCloseJSON();
        this.handleClosePreview();
        this.handleCloseLoginScreen();
        this.handleCloseSignupScreen();
        this.handleCloseSelectTimelineScreen();
    },

    getMask() {
        if (this.state.preview || this.state.json
            || this.state.loginScreen || this.state.signupScreen
            || this.state.selectTimelineScreen ) {
            return <div className="popup-background" onClick={this.closeAllPopups}></div>;
        }
    },

    onConnect(){
        this.setState({
            isConnected:true
        })
    },

    importJSON(event) {
        const file = event.target.files[0];
        if (!file) {
            swal({
                title: "Erreur d'import",
                text: "Aucun fichier sélectionné",
                type: "error"
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            let timeline = new model.Timeline();
            timeline.resetFromJson(e.target.result);
            this.handleSelectTimeline(null, timeline);
        };
        reader.readAsText(file);
    },

    render() {
        const t = this.state.timeline;
        // <div className="selectscaletext">
        //     Échelle temporelle :
        //     <select name="scale"
        //             className="select_option">
        //             value={this.state.timeline.get("scale")}
        //             onChange={this.onChangeScale}>
        //         <option value="human">Humaine</option>
        //         <option value="cosmological">Cosmologique</option>
        //     </select>
        // </div> // useless for now , TODO : add it and make it functionnal ?
        return (
            <div className="interface">
                <div className="menu">
                    <button className="topnav_element"
                            type="button"
                            onClick={() => document.getElementById("importPicker")
                                                   .click()}>
                        Ouvrir
                    </button>
                    <input id="importPicker"
                           type="file"
                           onChange={this.importJSON}
                           style={{display: "none"}} />
                    <button className="topnav_element"
                            name="show_json"
                            type="button"
                            onClick={this.showJSON}>
                        Partager
                    </button>
                    <button className="topnav_element"
                            name="preview"
                            type="button"
                            onClick={this.showPreview}>
                        Aperçu timeline
                    </button>

                    {this.getUserInterface()}

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
                {this.state.loginScreen}
                {this.state.signupScreen}
                {this.state.selectTimelineScreen}
            </div>
        );
    }
});
