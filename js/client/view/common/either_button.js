import React from "react";

export const EitherButton = React.createClass({
    handleChange(event){
        if (this.props.handleChange){
            this.props.handleChange(event);
        } else {
            console.warn("EitherButton : no callback has been defined, you are probably doing something wrong");
        }
    },

    render(){
        let option = (this.props.option != null) ? this.props.option : 0 ;
        // default is "Enabled";
        if (option == 0){
            return (<button className={(this.props.commonClassName || "") + " " + (this.props.option1className || "")}
                            onClick={this.handleChange}>
                {this.props.option1text || "OPTION1_DEFAULT"}
            </button>)
        } else {
            return (<button className={(this.props.commonClassName || "") + " "+(this.props.option2className || "")}
                            onClick={this.handleChange}>
                {this.props.option2text || "OPTION2_DEFAULT"}
            </button>)
        }
    }
})
