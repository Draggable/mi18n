const {expect} = require('chai');
const mi18n = require('../dist/mi18n.min.js').default;

describe('I18N', () => {
  const locale = 'te-ST';
  const testOpts = {
    locale,
    preloaded: {
      'te-ST': {
        testKey: 'Teeesst'
      }
    }
  };

  it('should exist', () => {
    expect(mi18n).to.exist;
  });

  describe('should have methods', () => {
    mi18n.init(testOpts).then(() => {
      describe('init()', () => {
        it('should exist', () => {
          expect(mi18n.init).to.exist;
          expect(typeof mi18n.init).to.equal('function');
        });
        it('should set locale', () => {
          expect(mi18n.config.locale).to.equal(locale);
        });
        it('should set current language', () => {
          expect(mi18n.current).to.exist;
          expect(Object.keys(mi18n.current)).to.contain('testKey');
        });
      });
    });
  });

  describe('should have methods after init', () => {
    mi18n.init(testOpts).then(() => {
      describe('get()', () => {
        it('shall exist', () =>
          expect(mi18n.get).to.exist
        );

        it('shall return a string', () => {
          const str = mi18n.get('testKey');
          expect(str).to.equal('Teeesst');
        });
      });
    });
  });
});
