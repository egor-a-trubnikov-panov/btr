var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.applyTemplates()', function () {
    var btr;
    beforeEach(function () {
        btr = new BTR();
    });
    it('should apply templates new mod', function () {
        btr.match('button', function (ctx) {
            ctx.applyTemplates();
            ctx.setTag('span');
        });
        btr.match('button', function (ctx) {
            ctx.setTag('button');
        });
        btr.apply({block: 'button'}).should.equal(
            '<span class="button" data-block="button" data-uniq="root"></span>'
        );
    });
});
