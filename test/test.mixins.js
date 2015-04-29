var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.getMixins()', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should return mix', function() {
        var mix = [{ block: 'mix' }];
        btr.match('button', function(ctx) {
            ctx.getMixins().should.equal(mix);
        });
        btr.apply({ block: 'button', mixins: mix });
    });
});

describe('ctx.addMixin()', function() {
    var bt;
    beforeEach(function() {
        bt = new BTR();
    });
    it('should set mix', function() {
        bt.match('button', function(ctx) {
            ctx.addMixin({block: 'mix', param: 1});
        });
        bt.apply({ block: 'button' }).should.equal(
            '<div class="button _init" data-block="button" data-uniq="root" ' +
            'data-options="{&quot;mixins&quot;:[{&quot;block&quot;:&quot;mix&quot;,&quot;param&quot;:1}]}"' +
            '></div>'
        );
    });
    it('should extend user mix', function() {
        bt.match('button', function(ctx) {
            ctx.addMixin({block: 'mix'});
        });
        bt.apply({ block: 'button', mixins: [{block: 'user-mix'}] }).should.equal(
            '<div class="button _init" data-block="button" data-uniq="root" data-options="' +
                '{&quot;mixins&quot;:[' +
                    '{&quot;block&quot;:&quot;user-mix&quot;},' +
                    '{&quot;block&quot;:&quot;mix&quot;}' +
                ']}' +
            '"></div>'
        );
    });
});
