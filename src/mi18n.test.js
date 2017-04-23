import 'babel-regenerator-runtime';
import {expect} from 'chai';
import mi18n from './mi18n';

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

  describe('should have methods', () => {
    describe('init()', () => {
      it('shall exist', () =>
        expect(mi18n.init).to.exist
      );

      it('shall initialize the module with options', async () => {
        await mi18n.init(testOpts).then(user => {
          expect(mi18n).to.have.property('current');
          expect(mi18n.get).to.exist;
        });
      });
    });
  });

  describe('get()', () => {
    before(async () => {
      await mi18n.init(testOpts);
    });
    it('shall exist', () =>
      expect(mi18n.get).to.exist
    );

    it('shall return a string', async () => {
      const str = mi18n.get('testString');
      expect(str).to.equal('Teeesst');
    });
  });
});
