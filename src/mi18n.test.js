import { test, describe } from 'node:test'
import assert from 'assert'
import mi18n, { I18N } from './mi18n.js'

// @todo add more tests for getValue and getFallbackValue

describe('I18N', () => {
  const locale = 'te-ST'
  const testOpts = {
    locale,
    override: {
      'te-ST': {
        testKey: 'Teeesst',
        testVars: 'I saw {count} {animals}',
      },
    },
  }

  test('should exist', () => {
    assert.ok(mi18n)
  })

  describe('should have methods', async () => {
    await mi18n.init(testOpts)

    describe('init()', () => {
      test('should exist', () => {
        assert.strictEqual(typeof mi18n.init, 'function')
      })
      test('should set locale', () => {
        assert.strictEqual(mi18n.config.locale, locale)
      })
      test('should set current language', () => {
        assert.ok(mi18n.current)
        assert.ok(Object.keys(mi18n.current).includes('testKey'))
      })
    })
  })

  describe('should have methods after init', async () => {
    await mi18n.init(testOpts)

    describe('get()', () => {
      test('shall exist', () => {
        assert.ok(mi18n.get)
      })

      test('shall return a string', () => {
        const str = mi18n.get('testKey')
        assert.strictEqual(str, 'Teeesst')
      })

      test('shall return a string with vars', () => {
        const str = mi18n.get('testVars', {
          count: 3,
          animals: 'chickens',
        })
        assert.strictEqual(str, 'I saw 3 chickens')
      })
    })
  })

  describe('loadLang', () => {
    const location = 'https://formbuilder.online/assets/lang/'
    const i18n = new I18N({ location })
    test('should load de-DE', async () => {
      const lang = await i18n.loadLang('de-DE')
      assert.strictEqual(typeof lang, 'object')
      assert.strictEqual(Object.keys(i18n.langs)[0], 'de-DE')
    })
  })

  describe('addLanguage', () => {
    const locale = 'te-ST'
    const i18n = new I18N()
    test('should load te-ST', async () => {
      i18n.addLanguage(locale, {
        myKey: 'one thing',
        yourKey: "shouldn't change",
      })
      await i18n.setCurrent(locale)
      assert.strictEqual(i18n.locale, locale)
      assert.strictEqual(i18n.get('myKey'), 'one thing')
      assert.strictEqual(i18n.get('yourKey'), "shouldn't change")
    })
  })
})
