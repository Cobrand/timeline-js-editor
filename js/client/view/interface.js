import React from "react";
import view from "view/view.js";
import model from "model/model.js";
import Promise from "bluebird";
import axios from "axios";

export const Interface = React.createClass({
    mixins: [React.Backbone],

    updateOnProps: {
        "timeline": "model",
        "login": "model",
        "signup": "model",
    },

    propTypes: {
        timeline: React.PropTypes.objectOf(model.Timeline).isRequired,
        login: React.PropTypes.objectOf(model.Login).isRequired,
        signup: React.PropTypes.objectOf(model.SignUp).isRequired,
    },

    getInitialState() {
        return {
            current_slide: this.props.timeline.get("title"),
            json: null,
            preview: null,
            loginScreen: null,
            signupScreen: null,
            isConnected:(!!localStorage.getItem("credentials_key"))
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

    saveTimeline() {
        let credentials_key = localStorage.getItem("credentials_key") ;
        let user_id = localStorage.getItem("user_id") ;

        Promise.resolve().then(() => {
            let timelineid = localStorage.getItem("current_timeline");
            let url = "/api/timeline/";
            if (timelineid !== "undefined") {
                url += timelineid;
            }

            return axios.post(url, {
                credentials_key,
                user_id,
                timeline: JSON.stringify(this.props.timeline.toJSON()),
                timeline_id: timelineid
            });
        }).then((msg) => {
            localStorage.setItem("current_timeline", msg.data.timelineid);
        }).catch((err) => {
            alert("Erreur de sauvegarde : " + err.statusText);
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
                    <button className="button main blue"
                            id="save_timeline"
                            onClick={this.saveTimeline}>
                        Sauvegarder
                    </button>
                    <button className="button main red fright"
                            id="disconnect"
                            onClick={this.disconnect}>
                        Déconnexion
                    </button>
                </div>
            );
        } else {
            return (<div style={{display:"inline"}}>
                <button className="button main blue fright"
                        id="open_login"
                        type="button"
                        onClick={this.showLoginScreen}>
                    Connexion
                </button>
                <button className="button main green fright"
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

    onConnect(){
        this.setState({
            isConnected:true
        })
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
        // <div className="selectscaletext">
        //     Échelle temporelle :
        //     <select name="scale"
        //             className="select_option">
        //             value={this.props.timeline.get("scale")}
        //             onChange={this.onChangeScale}>
        //         <option value="human">Humaine</option>
        //         <option value="cosmological">Cosmologique</option>
        //     </select>
        // </div> // useless for now , TODO : add it and make it functionnal ?
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
            </div>
        );
    }
});
