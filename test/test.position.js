var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.isFirst() / ctx.isLast() / ctx.getPosition', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should calc isFirst/isLast', function() {
        btr.match('button', function (ctx) {
            ctx.setContent([
                { elem: 'inner' },
                { elem: 'inner' },
                { elem: 'inner' }
            ]);
        });
        btr.match('button__inner', function(ctx) {
            if (ctx.isFirst()) {
                ctx.setState('first', 'yes');
            }
            if (ctx.isLast()) {
                ctx.setState('last', 'yes');
            }
        });
        btr.apply({ block: 'button' }).should.equal(
            '<div class="button" data-block="button" data-uniq="root">' +
            '<div class="button__inner _first_yes" data-uniq=".0"></div>' +
            '<div class="button__inner" data-uniq=".1"></div>' +
            '<div class="button__inner _last_yes" data-uniq=".2"></div>' +
            '</div>'
        );
    });
    it('should calc pos', function() {
        btr.match('button', function (ctx) {
            ctx.setContent([
                { elem: 'inner' },
                { elem: 'inner' },
                { elem: 'inner' }
            ]);
        });
        btr.match('button__inner', function(ctx) {
            ctx.setState('pos', ctx.getPosition());
        });
        btr.apply({ block: 'button' }).should.equal(
            '<div class="button" data-block="button" data-uniq="root">' +
            '<div class="button__inner _pos_1" data-uniq=".0"></div>' +
            '<div class="button__inner _pos_2" data-uniq=".1"></div>' +
            '<div class="button__inner _pos_3" data-uniq=".2"></div>' +
            '</div>'
        );
    });
    it('should calc isFirst/isLast with array mess', function() {
        btr.match('button', function (ctx) {
            ctx.setContent([
                [ { elem: 'inner' } ],
                [ { elem: 'inner' }, [ { elem: 'inner' } ] ]
            ]);
        });
        btr.match('button__inner', function(ctx) {
            if (ctx.isFirst()) {
                ctx.setState('first', 'yes');
            }
            if (ctx.isLast()) {
                ctx.setState('last', 'yes');
            }
        });
        btr.apply({ block: 'button' }).should.equal(
            '<div class="button" data-block="button" data-uniq="root">' +
            '<div class="button__inner _first_yes" data-uniq=".0"></div>' +
            '<div class="button__inner" data-uniq=".1"></div>' +
            '<div class="button__inner _last_yes" data-uniq=".2"></div>' +
            '</div>'
        );
    });
    it('should calc isFirst/isLast for single element', function() {
        btr.match('button', function (ctx) {
            ctx.setContent({ elem: 'inner' });
        });
        btr.match('button__inner', function(ctx) {
            if (ctx.isFirst()) {
                ctx.setState('first', 'yes');
            }
            if (ctx.isLast()) {
                ctx.setState('last', 'yes');
            }
        });
        btr.apply({ block: 'button' }).should.equal(
            '<div class="button" data-block="button" data-uniq="root">' +
            '<div class="button__inner _first_yes _last_yes" data-uniq=".0"></div>' +
            '</div>'
        );
    });
});
