export class Text {
    constructor(headline,content){
        this.headline = headline ;
        this.content = content ;
    }
    static from_object(json) {
        if (json == null) {
            throw new TypeError("expected JSON object, got null");
        }

        return new Text(json.headline, json.text);
    }
    toJSON() {
        return {
            headline:this.headline,
            text:this.content
        };
    }
}
