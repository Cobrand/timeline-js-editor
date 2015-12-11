import {deep_override_object,uuid4} from "utils.js" ;
import {MDate} from "model/structs/time.js";
import {Text} from "model/structs/text.js";
import {Media} from "model/structs/media.js";
import Backbone from "backbone";

export const Slide = Backbone.Model.extend({
    defaults() {
        return {
            start_date: new MDate(),
            end_date: null,
            text: new Text(),
            media: null,
            group: null,
            display_date: null,
            background: null,
            autolink: true,
            unique_id: uuid4()
        };
    },

    toJSON() {
        const json = {};
        let props_to_override_toJSON = ["start_date",
                                        "end_date",
                                        "text",
                                        "media"];

        for (let prop of props_to_override_toJSON){
            if (this.attributes[prop] != null){
                json[prop] = this.attributes[prop].toJSON();
            }
        }

        let props_to_override = ["group",
                                 "display_date",
                                 "background",
                                 "autolink",
                                 "unique_id"];
        deep_override_object(this.attributes,json,props_to_override);

        return json;
    },

    parse(json) {
        if (json == null) {
            throw new TypeError("expected JSON object, got null");
        }

        return {
            start_date: MDate.from_object(json.start_date),
            end_date: MDate.from_object(json.end_date),
            text: json.text ? Text.from_object(json.text) : null ,
            media: json.media ? Media.from_object(json.media) : null ,
            group: json.group,
            display_date: json.display_date,
            background: json.background,
            autolink: json.autolink,
            unique_id: json.unique_id
        };
    }
});

export const Slides = Backbone.Collection.extend({
    model: Slide
});
