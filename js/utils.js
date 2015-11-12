export function override_object(object,objectToOverride){
    for (let key in object){
        if (typeof object === "object" ){
            deep_copy(object[key],objectToOverride[key])
        }else{
            objectToOverride = object[key] ;
        }
    }
}

export function deep_copy(object){
    let return_value ;
    if(typeof object === "object" ){
        return_value = new Object() ;
        for (let key in object){
            if (typeof object[key] === "object"){
                return_value[key] = deep_copy(object[key]);
            }else{
                return_value[key] = object[key] ;
            }
        }
    }else{
        throw new TypeError("expected objet, got "+typeof object);
    }
    return return_value ;
}
