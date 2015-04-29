var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.getParam()', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should return param', function() {
        btr.match('button', function(ctx) {
            ctx.getParam('type').should.equal('button');
        });
        btr.apply({ block: 'button', type: 'button' });
    });
});
