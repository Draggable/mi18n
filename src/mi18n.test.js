require('babel-regenerator-runtime');
const {expect} = require('chai');
const mi18n = require('../dist/mi18n.min.js').default;

describe('I18N', () => {
  const testOpts = {
    locale: 'te-ST',
    preloaded: {
      'te-ST': {
        testString: 'Teeesst'
      }
    }
  };

  it('shall exist', () => {
    expect(mi18n).to.exist;
  });

  describe('should have methods', async () => {
    describe('init()', async () => {
      // const i18n = await new mi18n(testOpts).init(testOpts);
      it('should exist', () => {
        expect(mi18n.init).to.exist;
        expect(typeof mi18n.init).to.equal('function');
      });
      it('should set locale', async () => {
        await new mi18n.init(testOpts);
        expect(mi18n.config.locale).to.equal('te-ST');
      });
    });
  });

  describe('should have methods after init', async () => {
    await new mi18n.init(testOpts);

    describe('get()', () => {
      it('shall exist', () =>
        expect(mi18n.get).to.exist
      );

      it('shall return a string', async () => {
        const str = mi18n.get('testString');
        expect(str).to.equal('Teeesst');
      });
    });
  });
});
