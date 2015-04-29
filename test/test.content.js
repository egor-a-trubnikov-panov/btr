var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.setContent()', function () {
    var btr;
    beforeEach(function () {
        btr = new BTR();
    });
    it('should set bemjson content', function () {
        btr.match('button', function (ctx) {
            ctx.setContent({elem: 'text'});
        });
        btr.apply({block: 'button'}).should.equal(
            '<div class="button" data-block="button" data-uniq="root"><div class="button__text" data-uniq=".0"></div></div>'
        );
    });
    it('should set bemjson array content', function () {
        btr.match('button', function (ctx) {
            ctx.setContent([{elem: 'text1'}, {elem: 'text2'}]);
        });
        btr.apply({block: 'button'}).should.equal(
            '<div class="button" data-block="button" data-uniq="root">' +
            '<div class="button__text1" data-uniq=".0"></div>' +
            '<div class="button__text2" data-uniq=".1"></div>' +
            '</div>'
        );
    });
    it('should set bemjson string content', function () {
        btr.match('button', function (ctx) {
            ctx.setContent('Hello World');
        });
        btr.apply({block: 'button'}).should.equal('<div class="button" data-block="button" data-uniq="root">Hello World</div>');
    });
    it('should set bemjson numeric content', function () {
        btr.match('button', function (ctx) {
            ctx.setContent(123);
        });
        btr.apply({block: 'button'}).should.equal('<div class="button" data-block="button" data-uniq="root">123</div>');
    });
    it('should set bemjson zero-numeric content', function () {
        btr.match('button', function (ctx) {
            ctx.setContent(0);
        });
        btr.apply({block: 'button'}).should.equal('<div class="button" data-block="button" data-uniq="root">0</div>');
    });
});
