import {deep_override_object,uuid4} from "utils.js" ;
import Backbone from "backbone";

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

        let props_to_override_toJSON = ["start_date",
                                        "end_date",
                                        "text",
                                        "media"];

        for (let prop of props_to_override_toJSON){
            if (this[prop] != null){
                json[prop] = this[prop].toJSON();
            }
        }

        let props_to_override = ["group",
                                 "display_date",
                                 "background",
                                 "autolink",
                                 "unique_id"];
        deep_override_object(this,json,props_to_override)

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
            unique_id: json.unique_id || uuid4(),
        };
    }
});

export const Slides = Backbone.Collection.extend({
    model: Slide,
});
