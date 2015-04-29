var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.getTag() / ctx.setTag()', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should not return tag value', function() {
        btr.match('button', function(ctx) {
            (ctx.getTag() === undefined).should.equal(true);
        });
        btr.apply({ block: 'button', tag: 'button' });
    });
    it('should set html tag', function() {
        btr.match('button', function(ctx) {
            ctx.setTag('button');
        });
        btr.apply({ block: 'button' }).should.equal('<button class="button" data-block="button" data-uniq="root"></button>');
    });
});
