/**
 * Models for the application.
 *
 * Matches https://timeline.knightlab.com/docs/json-format.html
 */

import Backbone from "backbone";

import * as utils from "utils.js";

export class Media {
    from_object(json) {
        if (!json) {
            return null;
        }

        return make_Media(json.url, json.caption, json.credit, json.thumbnail);
    }
}

export function make_Media(url, caption=null, credit=null, thumbnail=null) {
    return {
        __proto__: Media.prototype,

        url,
        caption,
        credit,
        thumbnail,

        toJSON() {
            const json = {};

            set_if(this, json, "url");
            set_if(this, json, "caption");
            set_if(this, json, "credit");
            set_if(this, json, "thumbnail");

            return json;
        }
    };
}
