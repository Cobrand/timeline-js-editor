import React from "react";

export const EnableButton = React.createClass({
    handleChange(event){
        if (this.props.handleChange){
            this.props.handleChange(event);
        } else {
            console.warn("EnableButton : no callback has been defined, you are probably doing something wrong");
        }
    },

    render(){
        let isEnabled = (this.props.enabled != null) ? !!this.props.enabled : true ;
        // default is "Enabled";
        if (isEnabled){
            return (<button className={(this.props.className || "") + " enable_button enable_button_enabled"}
                            onClick={this.handleChange}>
                Activé
            </button>)
        } else {
            return (<button className={(this.props.className || "") + " enable_button enable_button_disabled"}
                            onClick={this.handleChange}>
                Désactivé
            </button>)
        }
    }
})
