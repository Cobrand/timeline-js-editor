import moment from "moment";
import * from "utils.js" ;
var locale = window.navigator.userLanguage || window.navigator.language ;
moment.locale(locale);

export class TextSlide {
    constructor(headline,content){
        this.headline = headline ;
        this.content = content ;
    }
    static from_object(json) {
        if (json == null) {
            throw new TypeError("expected JSON object, got null");
        }

        return new TextSlide(json.headline, json.text);
    }
    toJSON() {
        return {
            headline:this.headline,
            text:this.content
        }
    }
};

const units = [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
];

const date_formats = {
    "year": "YYYY",
    "month": "MMMM YYYY",
    "day": "LL",
    "hour": "LLL",
    "minute": "LLL",
    "second": "LL LTS",
    "millisecond": "LL HH:mm:ss.SSS"
};

export class MDate {
    constructor(moment_date,precision="day",display_date=null){
        this.date = moment_date ;
        this.precision = precision ;
        this.display_date = display_date ;
    }
    static from_object(json_false_month) {
        if (!json_false_month) {
            return null;
        }

        let json = Object.assign({}, json_false_month);
        json["month"] -= 1;

        let precision = "millisecond";
        for (let unit of units) {
            if (json[unit] === undefined) {
                break;
            }
            precision = unit;
        }

        return new MDate(moment(json),
                          precision,
                          json.display_date);
    }
    toJSON() {
        let obj = {"display_date": display_date};

        for (let unit in units) {
            obj[unit] = date.get(unit);
            if (json[unit] === precision) {
                break;
            }
        }
        obj["month"] += 1;

        return obj;
    }
}

export class Era {
    constructor(start_date,end_date,text=null){
        this.start_date = start_date ;
        this.end_date = end_date ;
        this.text = text ;
    }
    static from_object(json) {
        if (json == null) {
            throw new TypeError("expected JSON object, got null");
        }

        const era = new Era(MDate.from_object(json.start_date),
                            MDate.from_object(json.end_date),
                            json.text)
        return era ;
    }
    toJSON() {
        return {
            start_date: this.start_date.toJSON(),
            end_date: this.end_date.toJSON(),
            text: this.text,
        };
    }
};
