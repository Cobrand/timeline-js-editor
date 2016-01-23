/**
 * Models for the application.
 *
 * Matches https://timeline.knightlab.com/docs/json-format.html
 */

import {Timeline} from "model/timeline.js";
import {Slide,Slides} from "model/slide.js";
import {Media} from "model/structs/media.js";
import {Text} from "model/structs/text.js";
import {MDate,Era} from "model/structs/time.js";

export default {
    Timeline,
    Slide,
    Slides,
    Media,
    Text,
    MDate,
    Era
};
