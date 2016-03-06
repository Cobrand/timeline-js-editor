function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

import sha512 from "sha512" ;

// uuid generator
// source : http://stackoverflow.com/a/105074
export function uuid4() {
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
        s4() + "-" + s4() + s4() + s4();
}


export function deep_override_object(object,objectToOverride,props_to_override = null){
    if (props_to_override == null ){
        for (let key in object){
            objectToOverride[key] = deep_copy(object[key]);
        }
    }else if (props_to_override instanceof Array){
        for (let key of props_to_override){
            objectToOverride[key] = deep_copy(object[key]);
        }
    }else{
        throw new TypeError("expected array in propos_to_override");
    }
}

function deep_copy(object,props_to_copy){
    let return_value ;
    if(typeof object === "object" ){
        return_value = {};
        if (props_to_copy == null){
            for (let key in object){
                return_value[key] = deep_copy(object[key]);
            }
        }else if(props_to_copy instanceof Array){
            for (let key of props_to_copy){
                return_value[key] = deep_copy(object[key]);
            }
        }else{
            throw new TypeError("props_to_copy is not an Array !");
        }
    }else{
        return_value = object ;
    }
    return return_value ;
}

export function hash_password(unhashed_password){
    return sha512(unhashed_password).toString("hex").substr(0,32);
}

import React from "react";
import Backbone from "backbone";

// Use react instead of Backbone.View.
// https://leoasis.github.io/posts/2014/03/22/from_backbone_views_to_react/
React.Backbone = {
    listenToProps: function(props) {
        for (let propName in this.updateOnProps){
            let events = this.updateOnProps[propName];
            switch(events) {
            case "collection":
                events = "add remove reset sort";
                break;
            case "model":
                events = "change";
            }
            this.listenTo(props[propName], events, function() {
                this.forceUpdate();
            });
        }
    },

    componentDidMount: function() {
        this.listenToProps(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        this.stopListening();
        this.listenToProps(nextProps);
    },

    componentWillUnmount: function() {
        this.stopListening();
    }
};

Object.assign(React.Backbone, Backbone.Events);
