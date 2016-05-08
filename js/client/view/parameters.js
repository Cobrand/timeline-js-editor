import React from "react";
import "utils.js";
import Promise from "bluebird";
import axios from "axios";
import {hash_password} from "utils.js";
import swal from "sweetalert";

export const Parameters = React.createClass({
    mixins: [React.Backbone],

    propTypes: {
        handleCloseParameters: React.PropTypes.func
    },

    getInitialState(){
        return {
            oldPassword:"",
            newPassword:"",
            newPassword_repeat:""
        };
    },

    changeOldPassword(event){
        this.setState({
            oldPassword:event.target.value
        });
    },

    changeNewPassword(event){
        this.setState({
            newPassword:event.target.value
        });
    },

    changeNewPasswordRepeat(event){
        this.setState({
            newPassword_repeat:event.target.value
        });
    },

    changePassword(){
        if (this.state.newPassword_repeat === this.state.newPassword){
            let oldPassword = hash_password(this.state.oldPassword);
            let newPassword = hash_password(this.state.newPassword);
            Promise.resolve().then(() => {
                return axios.post("/api/user/changePassword", { // wrap ES6 promise inside bluebird
                    user_id: localStorage.getItem("user_id"),
                    oldPassword: oldPassword,
                    newPassword: newPassword
                });
            }).then((response) => {
                swal({
                    "title":"Mot de passe changé !",
                    "text":"Votre mot de passe a été changé avec succès !",
                });
                localStorage.setItem("credentials_key",response.data.credentials_key);
            }).catch((response) => {
                if (reponse.status === 401){
                    swal({
                        "title":"Mauvais mot de passe actuel",
                        "text":"Le mot de passe original n'est pas correct, impossible de changer le mot de passe",
                        "type":"error"
                    });
                } else {
                    swal({
                        "title":"Une erreur inconnue est survenue",
                        "text":"ERROR:"+response.statusText,
                        "type":"error"
                    });
                }
            });
        } else {
            swal({
                "title":"Confirmation invalide",
                "text":"La confirmation du nouveau mot de passe n'est pas la même que le mot de passe voulu",
                "type":"error"
            });
        }

    },

    render() {
        return (
            <div className="parameters_popup">
                <button className="closepopup"
                        name="close_parameters"
                        type="button"
                        onClick={this.props.handleClose}>
                    ×
                </button>
                <h1> Paramètres </h1>
                <div className="change_password_form">
                    <h2> Changer votre mot de passe </h2>
                    <input type="password"
                           value={this.state.oldPassword}
                           onChange={this.changeOldPassword}
                           placeholder="Mot de passe actuel" >
                    </input>
                    <input type="password"
                           value={this.state.newPassword}
                           onChange={this.changeNewPassword}
                           placeholder="Nouveau mot de passe" ></input>
                    <input type="password"
                           value={this.state.newPassword_repeat}
                           onChange={this.changeNewPasswordRepeat}
                           placeholder="Répéter le nouveau mot de passe" >
                    </input>
                    <button type="button"
                            className="button big wide blue"
                            onClick={this.changePassword}>
                        Changer le mot de passe
                    </button>
                </div>
            </div>
        );
    }
});
