var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.stop()', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should prevent base matching', function() {
        btr.match('button', function(ctx) {
            ctx.setTag('button');
        });
        btr.match('button', function(ctx) {
            ctx.setTag('span');
            ctx.stop();
        });
        btr.apply({ block: 'button' }).should.equal(
            '<span class="button" data-block="button" data-uniq="root"></span>'
        );
    });
});
