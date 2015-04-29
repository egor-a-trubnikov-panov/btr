var BTR = require('../lib/btr');
require('chai').should();

describe('btr.toHtml()', function() {
    describe('attrs', function() {
        var btr;
        beforeEach(function() {
            btr = new BTR();
        });
        it('should ignore null attrs', function() {
            btr.match('button', function(ctx) {
                ctx.setTag('a');
            });
            btr.match('button', function(ctx) {
                ctx.setAttr('href', null);
            });
            btr.apply({ block: 'button' }).should.equal(
                '<a class="button" data-block="button" data-uniq="root"></a>'
            );
        });
        it('should not ignore empty attrs', function() {
            btr.match('button', function(ctx) {
                ctx.setTag('a');
            });
            btr.match('button', function(ctx) {
                ctx.setAttr('href', '');
            });
            btr.apply({ block: 'button' }).should.equal(
                '<a class="button" data-block="button" href="" data-uniq="root"></a>'
            );
        });
    });
    describe('states', function() {
        var bt;
        beforeEach(function() {
            bt = new BTR();
        });
        it('should render states', function() {
            bt.match('button', function(ctx) {
                ctx.setTag('a');
                ctx.setContent({elem: 'text'});
            });
            bt.match('button', function(ctx) {
                ctx.setState('is-pressed');
            });
            bt.match('button__text', function(ctx) {
                ctx.setState('is-hovered');
            });
            bt.apply({ block: 'button' }).should.equal(
                '<a class="button _is-pressed" data-block="button" data-uniq="root"><div class="button__text _is-hovered" data-uniq=".0"></div></a>'
            );
        });
        it('should ignore null states', function() {
            bt.match('button', function(ctx) {
                ctx.setTag('a');
                ctx.setContent({elem: 'text'});
            });
            bt.match('button', function(ctx) {
                ctx.setState('type', null);
            });
            bt.match('button__text', function(ctx) {
                ctx.setState('is-focused', null);
            });
            bt.apply({ block: 'button' }).should.equal(
                '<a class="button" data-block="button" data-uniq="root"><div class="button__text" data-uniq=".0"></div></a>'
            );
        });
        it('should ignore empty states', function() {
            bt.match('button', function(ctx) {
                ctx.setTag('a');
            });
            bt.match('button', function(ctx) {
                ctx.setState('type', '');
            });
            bt.apply({ block: 'button' }).should.equal(
                '<a class="button" data-block="button" data-uniq="root"></a>'
            );
        });
    });
    describe('views', function() {
        var bt;
        beforeEach(function() {
            bt = new BTR();
        });
        it('should render views', function() {
            bt.match('button_def*', function(ctx) {
                ctx.setTag('a');
                ctx.setContent([{elem: 'right'}]);
            });
            bt.match('button_def*__right', function(ctx) {
                ctx.setTag('span');
            });
            bt.apply({ block: 'button', view: 'def-xxx-yyy' }).should.equal(
                '<a class="button_def-xxx-yyy" data-block="button" data-uniq="root"><span class="button_def-xxx-yyy__right" data-uniq=".0"></span></a>'
            );
        });
    });
});
