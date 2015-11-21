export const Slide = Backbone.Model.extend({
    defaults: {
        start_date: null,
        end_date: null,
        text: null,
        media: null,
        group: null,
        display_date: null,
        background: null,
        autolink: null,
        unique_id: null
    },

    toJSON() {
        const json = {};

        if (this.start_date) {
            json.start_date = this.start_date.toJSON();
        }
        if (this.end_date) {
            json.end_date = this.end_date.toJSON();
        }
        if (this.text) {
            json.text = this.text.toJSON();
        }
        if (this.media) {
            json.media = this.media.toJSON();
        }
        set_if(this, json, "group");
        set_if(this, json, "display_date");
        set_if(this, json, "background");
        set_if(this, json, "autolink");
        json.unique_id = this.unique_id;

        return json;
    },

    parse(json) {
        if (json == null) {
            throw new TypeError("expected JSON object, got null");
        }

        return {
            start_date: MDate.from_object(json.start_date),
            end_date: MDate.from_object(json.end_date),
            text: Text.from_object(json.text),
            media: Media.from_object(json.media),
            group: json.group,
            display_date: json.display_date,
            background: json.background,
            autolink: json.autolink,
            unique_id: json.unique_id || utils.uuid4(),
        };
    }
});

export const Slides = Backbone.Collection.extend({
    model: Slide,
});
