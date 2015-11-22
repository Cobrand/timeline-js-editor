export class Media {
    constructor(url, caption=null, credit=null, thumbnail=null){
        this.url = url ;
        this.caption = caption ;
        this.credit = credit ;
        this.thumbnail = thumbnail ;
    }
    static from_object(json) {
        if (json == null) {
            throw new TypeError("expected JSON object, got null");
        }
        return new Media(json.url, json.caption, json.credit, json.thumbnail);
    }
    toJSON(){
        // TODO
        throw new Error("not implemented");
    }
}
