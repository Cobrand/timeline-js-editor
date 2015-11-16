function checkCopyType(type){
    if (type !== "deep" && type !== "shallow"){
        throw new TypeError("wrong copy type");
    }else{
        return true ;
    }
}

export function override_object(object,objectToOverride,props_to_override = null,copy_type="deep"){
    checkCopyType(copy_type);
    if (props_to_override == null ){
        for (let key in object){
            objectToOverride[key] = copy(object[key],copy_type);
        }
    }else if (props_to_override instanceof Array){
        for (let key of props_to_override){
            objectToOverride[key] = copy(object[key],copy_type);
        }
    }else{
        throw new TypeError("expected array in propos_to_override");
    }
}
// type can be either "shallow" or "deep" ;
function copy(object,props_to_copy,copy_type = "deep"){
    checkCopyType(copy_type);
    let return_value ;
    if(typeof object === "object" ){
        return_value = new Object() ;
        if (props_to_copy == null){
            for (let key in object){
                return_value[key] = (copy_type === "deep") ? deep_copy(object[key]): object[key];
            }
        }else if(props_to_copy instanceof Array){
            for (let key of props_to_copy){
                return_value[key] = (copy_type === "deep") ? deep_copy(object[key]): object[key];
            }
        }else{
            throw new TypeError("props_to_copy is not an Array !");
        }
    }else{
        return_value = object ;
    }
    return return_value ;
}

export function deep_copy(object,props_to_copy = null){
    return copy(object,props_to_copy,"deep");
}

export function shallow_copy(object,props_to_copy ){
    return copy(object,props_to_copy,"shallow");
}


// Use react instead of Backbone.View.
// https://leoasis.github.io/posts/2014/03/22/from_backbone_views_to_react/
React.Backbone = {
    listenToProps: function(props) {
        _.each(this.updateOnProps, function(events, propName) {
            switch(events) {
                case 'collection':
                    events = 'add remove reset sort';
                    break;
                case 'model':
                    events = 'change';
            }
            this.listenTo(props[propName], events, function() {
                this.forceUpdate();
            });
        }, this);
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
}

_.extend(React.Backbone, Backbone.Events);
