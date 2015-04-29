var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.getAttr()', function () {
    var btr;
    beforeEach(function () {
        btr = new BTR();
    });
    it('should return attr', function () {
        btr.match('button', function (ctx) {
            ctx.setAttr('type', 'button');
            ctx.getAttr('type').should.equal('button');
        });
        btr.apply({block: 'button'});
    });
});

describe('ctx.setAttr()', function () {
    var btr;
    beforeEach(function () {
        btr = new BTR();
    });
    it('should set attr', function () {
        btr.match('button', function (ctx) {
            ctx.setAttr('type', 'button');
        });
        btr.apply({block: 'button'}).should.equal('<div class="button" data-block="button" type="button" data-uniq="root"></div>');
    });
    it('should set a hash of attrs', function () {
        btr.match('button', function (ctx) {
            ctx.setAttr({'type': 'button'});
        });
        btr.apply({block: 'button'}).should.equal('<div class="button" data-block="button" type="button" data-uniq="root"></div>');
    });
    it('should render non-value attrs', function () {
        btr.match('button', function (ctx) {
            ctx.setTag('button');
            ctx.setAttr('disabled', true);
        });
        btr.apply({block: 'button'}).should.equal('<button class="button" data-block="button" disabled data-uniq="root"></button>');
    });
});
