import React from "react";

export function embed_media(link){
    let match ;
    if (typeof link === "string"){
        if ( (match = link.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)(&(amp;)?[\w\?=]*)?/)) != null ){
            // YOUTUBE
            return (<iframe src={"https://www.youtube.com/embed/"+match[1]} className="media_preview"></iframe>);
        }else if ((match = link.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpg|gif|jpeg|png))(?:\?([^#]*))?(?:#(.*))?/)) != null ){
            return (<img src={match[0]} alt="media preview" className="media_preview" />);
        }else{
            return (<div className="media_preview empty">Aucune prévisualisation disponible</div>);
        }
    }else{
        throw Error("Expected string, got "+typeof link+" instead");
    }
}
