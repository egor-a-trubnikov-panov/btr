var BTR = require('../lib/btr');
require('chai').should();

describe('raw', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should escape content', function() {
        btr.match('button', function(ctx) {
            ctx.setContent('<text>');
        });
        btr.apply({ block: 'button' }).should.equal(
            '<div class="button" data-block="button" data-uniq="root">&lt;text&gt;</div>'
        );
    });
    it('should escape array content', function() {
        btr.match('button', function(ctx) {
            ctx.setContent([
                '<text1>',
                '<text2>'
            ]);
        });
        btr.apply({ block: 'button' }).should.equal(
            '<div class="button" data-block="button" data-uniq="root">&lt;text1&gt;&lt;text2&gt;</div>'
        );
    });
    it('should not escape raw content', function() {
        btr.match('button', function(ctx) {
            ctx.setContent({raw: '<text>'});
        });
        btr.apply({ block: 'button' }).should.equal(
            '<div class="button" data-block="button" data-uniq="root"><text></div>'
        );
    });
    it('should not escape raw array item', function() {
        btr.match('button', function(ctx) {
            ctx.setContent([
                {raw: '<text1>'},
                '<text2>'
            ]);
        });
        btr.apply({ block: 'button' }).should.equal(
            '<div class="button" data-block="button" data-uniq="root"><text1>&lt;text2&gt;</div>'
        );
    });
});
