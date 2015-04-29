var BTR = require('../lib/btr');
require('chai').should();

describe('ctx.getState()', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should return state', function() {
        btr.match('component', function(ctx) {
            ctx.setState('focused', 'yes');
            ctx.getState('focused').should.equal('yes');
        });
        btr.apply({ block: 'component' });
    });
});

describe('ctx.setState()', function() {
    var btr;
    beforeEach(function() {
        btr = new BTR();
    });
    it('should return state', function() {
        btr.match('component', function(ctx) {
            ctx.setState('focused');
            ctx.getState('focused').should.equal(true);
        });
        btr.apply({ block: 'component', states: {type: 'button'} });
    });
    it('should set string state', function() {
        btr.match('component', function(ctx) {
            ctx.setState('focused', 'yes');
            ctx.getState('focused').should.equal('yes');
        });
        btr.apply({ block: 'component' }).should.equal(
            '<div class="component _focused_yes" data-block="component" data-uniq="root"></div>'
        );
    });
    it('should set boolean state', function() {
        btr.match('component', function(ctx) {
            ctx.setState('is-focused');
            ctx.getState('is-focused').should.equal(true);
        });
        btr.apply({ block: 'component' }).should.equal(
            '<div class="component _is-focused" data-block="component" data-uniq="root"></div>'
        );
    });
});
