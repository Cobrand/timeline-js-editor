export class Text {
    constructor(headline="", text=""){
        this.headline = headline;
        this.text = text;
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
            text:this.text
        };
    }
}
