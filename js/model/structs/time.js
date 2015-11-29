import moment from "moment";

var locale = (typeof window !== 'undefined') ?
(window.navigator.userLanguage || window.navigator.language) : 'en' ;
moment.locale(locale);

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
    toString() {
        return this.display_date || this.date.format(date_formats[this.precision]) ;
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
        let obj = {"display_date": this.display_date};

        for (let unit of units) {
            obj[unit] = this.date.get(unit);
            if (unit === this.precision) {
                break;
            }
        }
        if (obj["month"] != null){
            obj["month"] += 1;
        }

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
                            json.text);
        return era ;
    }
    toJSON() {
        return {
            start_date: this.start_date.toJSON(),
            end_date: this.end_date.toJSON(),
            text: this.text
        };
    }
}
