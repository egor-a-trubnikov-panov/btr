var BTR = require('../lib/btr');
require('chai').should();

describe('options', function() {
    describe('jsAttr', function() {
        var btr;
        beforeEach(function() {
            btr = new BTR();
        });
        it('should render options', function() {
            btr.match('button', function (ctx) {
                ctx.setInitOption('x', 1);
            });
            btr.apply({ block: 'button' }).should.equal(
                '<div class="button" data-block="button" data-uniq="root" data-options="{&quot;options&quot;:{&quot;x&quot;:1}}">' +
                '</div>'
            );
        });
    });
});
