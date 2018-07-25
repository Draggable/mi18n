import { get as fetch } from 'axios'

const DEFAULT_CONFIG = {
  extension: '.lang',
  // local or remote directory containing language files
  location: 'assets/lang/',
  // list of available locales, handy for populating selector.
  langs: ['en-US'],
  locale: 'en-US', // init with user's preferred language
  override: {},
}

/**
 * Main mi18n class.
 */
export class I18N {
  /**
   * Process options and start the module
   * @param {Object} options
   */
  constructor(options = DEFAULT_CONFIG) {
    this.processConfig(options)
  }

  /**
   * parse and format config
   * @param {Object} options
   */
  processConfig(options) {
    const { location, override, ...restOptions } = Object.assign({}, DEFAULT_CONFIG, options)
    const parsedLocation = location.replace(/\/?$/, '/')
    this.config = Object.assign({}, { location: parsedLocation }, { override }, restOptions)
    this.langs = Object.entries(override).reduce((acc, [locale, lang]) => {
      acc[locale] = Object.assign({}, this.langs && this.langs[locale], lang)
      return acc
    }, {})
    this.locale = this.config.locale || this.config.langs[0]
  }

  /**
   * Adds a language to the list of available languages
   * @param {String} locale
   * @param {String|Object} lang
   */
  addLanguage(locale, lang = {}) {
    lang = typeof lang === 'string' ? this.processFile.call(this, lang) : lang
    this.applyLanguage.call(this, locale, lang)
    this.config.langs.push('locale')
  }

  /**
   * Load language and set default
   * @param  {Object} options
   * @return {Promise}        resolves language
   */
  init(options) {
    this.processConfig.call(this, Object.assign({}, this.config, options))
    return this.setCurrent(this.locale)
  }

  /**
   * get a string from a loaded language file
   * @param  {String} key  - the key for the string we are trying to retrieve
   * @return {String}      - correct language string
   */
  getValue(key) {
    return this.current && this.current[key]
  }

  /**
   * Escape variable syntax
   * @param  {String} str
   * @return {String}     escaped str
   */
  makeSafe(str) {
    const mapObj = {
      '{': '\\{',
      '}': '\\}',
      '|': '\\|',
    }

    str = str.replace(/\{|\}|\|/g, matched => mapObj[matched])

    return new RegExp(str, 'g')
  }

  /**
   * Temporarily put a string into the currently loaded language
   * @param  {String} key
   * @param  {String} string
   * @return {String} string in current language
   */
  put(key, string) {
    return (this.current[key] = string)
  }

  /**
   * Parse arguments for the requested string
   * @param  {String} key  the key we use to lookup our translation
   * @param  {multi}  args  string, number or object containing our arguments
   * @return {String}      updated string translation
   */
  get(key, args) {
    const _this = this
    let value = this.getValue(key)
    if (!value) {
      return
    }
    const tokens = value.match(/\{[^\}]+?\}/g)
    let token

    if (args && tokens) {
      if ('object' === typeof args) {
        for (let i = 0; i < tokens.length; i++) {
          token = tokens[i].substring(1, tokens[i].length - 1)
          value = value.replace(_this.makeSafe(tokens[i]), args[token] || '')
        }
      } else {
        value = value.replace(/\{[^\}]+?\}/g, args)
      }
    }

    return value
  }

  /**
   * Turn raw text from the language files into fancy JSON
   * @param  {String} rawText
   * @return {Object} converted language file
   */
  fromFile(rawText) {
    const lines = rawText.split('\n')
    const lang = {}

    for (let matches, i = 0; i < lines.length; i++) {
      matches = lines[i].match(/^(.+?) *?= *?([^\n]+)/)
      if (matches) {
        lang[matches[1]] = matches[2].replace(/^\s+|\s+$/, '')
      }
    }

    return lang
  }

  /**
   * Remove double carriage returns
   * @param  {Object} response
   * @return {Object}          processed language
   */
  processFile(response) {
    return this.fromFile(response.replace(/\n\n/g, '\n'))
  }

  /**
   * Load a remotely stored language file
   * @param  {String} locale
   * @return {Promise}       resolves response
   */
  loadLang(locale) {
    const _this = this
    return new Promise(function(resolve, reject) {
      if (_this.langs[locale]) {
        _this.applyLanguage.call(_this, _this.langs[locale])
        resolve(_this.langs[locale])
      } else {
        const langFile = [_this.config.location, locale, _this.config.extension].join('')
        fetch(langFile)
          .then(({ data: lang }) => {
            const processedFile = _this.processFile(lang)
            _this.applyLanguage.call(_this, locale, processedFile)
            resolve(_this.langs[locale])
          })
          .catch(({ response: { config: { url }, status, statusText } }) => {
            return reject(new Error(`${status}: ${statusText}\n ${url}`))
          })
      }
    })
  }

  /**
   * applies overrides form config
   * @param {String} locale
   * @param {Object} lang
   */
  applyLanguage(locale, lang = {}) {
    const override = this.config.override[locale] || {}
    this.langs[locale] = Object.assign({}, this.langs && this.langs[locale], lang, override)
  }

  /**
   * return currently available languages
   * @return {Object} all configured languages
   */
  get getLangs() {
    return this.config.langs
  }

  /**
   * Attempt to set the current language to the local provided
   * @param {String}   locale
   * @return {Promise} language
   */
  setCurrent(locale = 'en-US') {
    return this.loadLang(locale)
      .then(language => {
        this.locale = locale
        this.current = this.langs[locale]
        return language
      })
      .catch(err => console.error(err))
  }
}

export default new I18N()
