import * as Time from "../../../../js/client/model/structs/time.js"
import {assert,expect} from "chai" ;
import moment from "moment" ;
describe("Time structs",() => {
    describe("MDate",() => {
        let o = {"year":2011,"month":12,"day":1};
        let mdate = Time.MDate.from_object(o);
        it("from_object should return an instance of MDate",() => {
            expect(mdate).instanceof(Time.MDate);
        });
        it("should have a Moment as date",() => {
            assert(moment.isMoment(mdate.date));
        });
        it("should export a copy object of the original one",() => {
            expect(mdate.toJSON()).deep.equal(o);
        })
    })
})
