var BTR = require('../lib/btr');
require('chai').should();

describe('matching', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should accept array replacement', function () {
        btr.match('page', function(ctx) {
            ctx.setTag('html');
            ctx.disableCssClassGeneration();
            ctx.disableDataAttrGeneration();
            return [
                {raw: '<!DOCTYPE>'},
                ctx.getJson()
            ];
        });
        btr.apply({ block: 'page' }).should.equal(
            '<!DOCTYPE><html data-uniq="root"></html>'
        );
    });
    it('should accept string replacement', function () {
        btr.match('page', function() {
            return 'Hello';
        });
        btr.apply({ block: 'page' }).should.equal('Hello');
    });
    it('should accept numeric replacement', function () {
        btr.match('page', function() {
            return 0;
        });
        btr.apply({ block: 'page' }).should.equal('0');
    });
    it('should match block and child', function () {
        btr.match('button', function(ctx) {
            ctx.setTag('span');
            ctx.disableDataAttrGeneration();
            ctx.setContent({ elem: 'text' });
        });
        btr.match('button__text', function(ctx) {
            ctx.setTag('i');
        });
        btr.apply({ block: 'button' }).should.equal('<span class="button" data-uniq="root"><i class="button__text" data-uniq=".0"></i></span>');
    });
    it('should multiple match block and child', function () {
        btr.match('button', function(ctx) {
            ctx.setTag('span');
            ctx.disableDataAttrGeneration();
            ctx.setContent([{ elem: 'icon' }, { elem: 'text' }]);
        });
        btr.match(['button__text', 'button__icon'], function(ctx) {
            ctx.setTag('i');
        });
        btr.apply({ block: 'button' }).should.equal(
            '<span class="button" data-uniq="root"><i class="button__icon" data-uniq=".0"></i><i class="button__text" data-uniq=".1"></i></span>'
        );
    });
    it('should match block and child using view', function () {
        btr.match('button_def', function(ctx) {
            ctx.setTag('span');
            ctx.disableDataAttrGeneration();
            ctx.setContent({ elem: 'text' });
        });
        btr.match('button_def__text', function(ctx) {
            ctx.setTag('i');
        });
        btr.apply({ block: 'button', view: 'def' }).should.equal(
            '<span class="button_def" data-uniq="root"><i class="button_def__text" data-uniq=".0"></i></span>'
        );
    });
    it('should match block and child using view ns', function () {
        btr.match('button_def*', function(ctx) {
            ctx.setTag('span');
            ctx.disableDataAttrGeneration();
            ctx.setContent({ elem: 'text' });
        });
        btr.match('button_def*__text', function(ctx) {
            ctx.setTag('i');
        });
        btr.apply({ block: 'button', view: 'def' }).should.equal(
            '<span class="button_def" data-uniq="root"><i class="button_def__text" data-uniq=".0"></i></span>'
        );
    });
    it('should match block and child using view ns', function () {
        btr.match('button_def*', function(ctx) {
            ctx.setTag('span');
            ctx.disableDataAttrGeneration();
            ctx.setContent({ elem: 'text' });
        });
        btr.match('button_def*__text', function(ctx) {
            ctx.setTag('i');
        });
        btr.apply({ block: 'button', view: 'def-xxx' }).should.equal(
            '<span class="button_def-xxx" data-uniq="root"><i class="button_def-xxx__text" data-uniq=".0"></i></span>'
        );
    });

    describe('block*', function () {
        beforeEach(function () {
            btr.match('button*', function (ctx) {
                ctx.setTag('span');
                ctx.disableDataAttrGeneration();
                ctx.setContent({elem: 'text'});
            });

            btr.match('button*__text', function (ctx) {
                ctx.setTag('i');
            });
        });

        it('should match block and element without view', function () {
            btr.apply({block: 'button'}).should.eq(
                '<span class="button" data-uniq="root"><i class="button__text" data-uniq=".0"></i></span>'
            );
        });

        it('should match block and element with view', function () {
            btr.apply({block: 'button', view: 'foo'}).should.eq(
                '<span class="button_foo" data-uniq="root"><i class="button_foo__text" data-uniq=".0"></i></span>'
            );

            btr.apply({block: 'button', view: 'foo-bar'}).should.eq(
                '<span class="button_foo-bar" data-uniq="root"><i class="button_foo-bar__text" data-uniq=".0"></i></span>'
            );
        });

        it('should match on most relevant matcher', function () {
            btr.match('button_foo*', function (ctx) {
                ctx.setTag('button');
                ctx.disableDataAttrGeneration();
                ctx.setContent({elem: 'text'});
            });
            btr.apply({block: 'button', view: 'foo-bar'}).should.eq(
                '<button class="button_foo-bar" data-uniq="root"><i class="button_foo-bar__text" data-uniq=".0"></i></button>'
            );
        });

        it('should match on most relevant matcher using strict match', function () {
            btr.match('button_foo*', function (ctx) {
                ctx.setTag('button');
                ctx.disableDataAttrGeneration();
                ctx.setContent({elem: 'text'});
            });
            btr.match('button_foo-bar', function (ctx) {
                ctx.setTag('div');
                ctx.disableDataAttrGeneration();
                ctx.setContent({elem: 'text'});
            });
            btr.apply({block: 'button', view: 'foo-bar'}).should.eq(
                '<div class="button_foo-bar" data-uniq="root"><i class="button_foo-bar__text" data-uniq=".0"></i></div>'
            );
        });

        it('should apply returned content', function () {
            btr.match('button', function (ctx) {
                ctx.setTag('button');
                ctx.disableDataAttrGeneration();
                ctx.setContent({elem: 'text'});
            });

            btr.match('button__text', function () {
                return 'Hello';
            });

            btr.apply({block: 'button'}).should.eq(
                '<button class="button" data-uniq="root">Hello</button>'
            );
        });
    });
});
