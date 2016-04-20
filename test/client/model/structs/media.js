import {Media} from "../../../../js/client/model/structs/media.js"
import {assert,expect} from "chai" ;
describe("Misc structs",() => {
    describe("Media",() => {
        let o = {"url":"http://google.fr/","credit":"Rebort Mérie"};
        let media = Media.from_object(o);
        it("from_object should return an instance of Media",() => {
            expect(media).instanceof(Media);
        });
        it("should export a copy object of the original one",() => {
            expect(media.toJSON()).deep.equal(o);
        })
    })
})
