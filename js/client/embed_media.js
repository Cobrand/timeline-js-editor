import React from "react";

export function embed_media(link){
    let match ;
    if (typeof link === "string"){
        if ( (match = link.match(/^(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)(&(amp;)?[\w\?=]*)?$/)) != null ){
            // YOUTUBE
            return (<iframe src={"https://www.youtube.com/embed/"+match[1]} className="media_preview"></iframe>);
        }else if ((match = link.match(/^(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpg|gif|jpeg|png))(?:\?([^#]*))?(?:#(.*))?$/)) != null ){
            return (<img src={match[0]} alt="media preview" className="media_preview" />);
        }else if ((match = link.match(/^https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)$/))){
            return (<iframe src={"//player.vimeo.com/video/"+match[3]} className="media_preview" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>);
        }else if ((match = link.match(/^http(?:s?):\/\/(?:www\.)?vine\.co\/v\/([a-zA-Z0-9]{1,13})(?:\/embed(?:\/simple\/?)?)?$/))){
            return (<iframe src='https://vine.co/v/MjpK9pmKvzu/embed/simple' className="media_preview" frameborder='0' scrolling='no' allowtransparency='true'></iframe>);
        }else{
            return (<div className="media_preview empty">Aucune prévisualisation disponible</div>);
        }
    }else{
        throw Error("Expected string, got "+typeof link+" instead");
    }
}
