var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.generateId()', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should generate different ids', function() {
        btr.match('button', function(ctx) {
            ctx.generateId().should.not.equal(ctx.generateId());
        });
        btr.apply({ block: 'button' });
    });
});
