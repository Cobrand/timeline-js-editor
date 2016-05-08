"use strict";
let krouter_timeline = require("koa-router")();
let db = require("../db.js");
let sha512 = require("sha512");
let utils =  require("../utils.js") ;
let winston = require("winston");

const EXPORT = `<div class="timeline">
    <div class="timeline-js-embed" id="timeline-embed-RANDOMID"></div>

    <link title="timeline-styles"
          rel="stylesheet"
          href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css">
    </link>
    <style>
        html, body, #timeline-js-embed {
            width: 100%;
            height: 100%;
            margin: 0;
        }
    </style>
    <script src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js">
    </script>
    <script>
        (function() {
            "use strict";
            var options = {};
            window.timelinejs = new TL.Timeline("timeline-embed-RANDOMID",
                                                TIMELINE,
                                                options);
        }());
    </script>
</div>`;

module.exports = function(){
    krouter_timeline.get("/:timeline_guid",function* (next){
        let timeline_id = this.params.timeline_guid ;
        winston.debug("Received GET /timeline/"+this.params.timeline_guid+" request");
        // this.params.timeline_guid
        let timeline = yield db.Timeline.findOne({where :{'id':timeline_id}});
        if (timeline){
            let timeline_object = timeline.timeline ;
            const random_id = (Math.floor(Math.random() * 100000)).toString();
            this.body = EXPORT.replace(/RANDOMID/g, random_id)
                              .replace(/TIMELINE/, timeline_object); ;
        } // no body will leave a 404 "not found" ;
    })
    return krouter_timeline;
};
