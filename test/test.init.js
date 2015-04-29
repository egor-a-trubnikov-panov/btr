var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.enableAutoInit() / ctx.setInitOption()', function () {
    var btr;
    beforeEach(function () {
        btr = new BTR();
    });
    it('should return autoInit', function () {
        btr.match('button', function (ctx) {
            ctx.isAutoInitEnabled().should.equal(true);
        });
        btr.apply({block: 'button', autoInit: true});
    });
    it('should set autoInit', function () {
        btr.match('button', function (ctx) {
            ctx.enableAutoInit();
        });
        btr.apply({block: 'button', autoInit: true}).should.equal(
            '<div class="button _init" data-block="button" data-uniq="root"></div>'
        );
    });
    it('should set init options', function () {
        btr.match('button', function (ctx) {
            ctx.setInitOption('x', 1);
        });
        btr.apply({block: 'button'}).should.equal(
            '<div class="button" data-block="button" data-uniq="root" data-options="{&quot;options&quot;:{&quot;x&quot;:1}}">' +
            '</div>'
        );
    });
    it('should set elem init options', function () {
        btr.match('button', function (ctx) {
            ctx.setContent({elem: 'text'});
        });
        btr.match('button__text', function (ctx) {
            ctx.setInitOption('x', 1);
        });
        btr.apply({block: 'button'}).should.equal(
            '<div class="button" data-block="button" data-uniq="root">' +
            '<div class="button__text" data-uniq=".0" data-options="{&quot;options&quot;:{&quot;x&quot;:1}}"></div>' +
            '</div>'
        );
    });
});


