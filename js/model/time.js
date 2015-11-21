export const Text = {
    from_object(json) {
        if (!json) {
            return null;
        }

        return make_Text(json.headline, json.text);
    }
};

export function make_Text(headline=null, text=null) {
    return {
        __proto__: Text.prototype,

        headline,
        text,

        toJSON() {
            const json = {};

            set_if(this, json, "headline");
            set_if(this, json, "text");

            return json;
        }
    };
}

const units = [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
];

export const MDate = {
    from_object(json_false_month) {
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

        return make_MDate(moment(json),
                          precision,
                          json.display_date);
    }
}

const date_formats = {
    "year": "YYYY",
    "month": "YYYY MMMM",
    "day": "LL",
    "hour": "LLL",
    "minute": "LLL",
    "second": "LL LTS",
    "millisecond": "LL HH:mm:ss.SSS"
};

export function make_MDate(date, precision, display_date=null) {
    return {
        __proto__: MDate.prototype,

        date,
        precision,
        display_date,

        toString() {
            return display_date || date.format(date_formats[precision]);
        },

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
    };
}

export const Era = {
    from_object(json) {
        if (!json) {
            return null;
        }

        return make_Era(MDate.from_object(json.start_date),
                        MDate.from_object(json.end_date),
                        json.text);
    }
};

export function make_Era(start_date, end_date, text=null) {
    return {
        __proto__: Era.prototype,

        start_date,
        end_date,
        text,

        toJSON() {
            const json = {
                start_date: this.start_date.toJSON(),
                end_date: this.end_date.toJSON()
            };

            set_if(this, json, "text");

            return json;
        }
    };
}
