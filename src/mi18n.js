/**
 * Main mi18n class.
 */
class I18N {
  /**
   * Process options and start the module
   * @param {Object} options
   */
  constructor(options) {
    let defaultConfig = {
        extension: '.lang',
        // local or remote directory containing language files
        location: 'assets/lang/',
        // list of available locales, handy for populating selector.
        langs: [
          'en-US'
        ],
        locale: 'en-US', // init with user's preferred language
        preloaded: {}
      };

    /**
     * Load language and set default
     * @param  {Object} options
     * @return {Promise}        resolves language
     */
    this.init = options => {
      this.config = Object.assign({}, defaultConfig, options);

      this.langs = Object.assign({}, this.config.preloaded);
      this.locale = this.config.locale || this.config.langs[0];

      return this.setCurrent(this.locale);
    };
  }


  /**
   * get a string from a loaded language file
   * @param  {String} key  - the key for the string we are trying to retrieve
   * @return {String}      - correct language string
   */
  getValue(key) {
    return (this.current && this.current[key]) || key;
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
      '|': '\\|'
    };

    str = str.replace(/\{|\}|\|/g, matched => mapObj[matched]);

    return new RegExp(str, 'g');
  }

  /**
  * Temporarily put a string into the currently loaded language
  * @param  {String} key
  * @param  {String} string
  * @return {String} string in current language
  */
  put(key, string) {
    return this.current[key] = string;
  }

  /**
   * Parse arguments for the requested string
   * @param  {String} key  the key we use to lookup our translation
   * @param  {multi}  args  string, number or object containing our arguments
   * @return {String}      updated string translation
   */
  get(key, args) {
    let _this = this;
    let value = this.getValue(key);
    let tokens = value.match(/\{[^\}]+?\}/g);
    let token;

    if (args && tokens) {
      if ('object' === typeof args) {
        for (let i = 0; i < tokens.length; i++) {
          token = tokens[i].substring(1, tokens[i].length - 1);
          value = value.replace(_this.makeSafe(tokens[i]), args[token] || '');
        }
      } else {
        value = value.replace(/\{[^\}]+?\}/g, args);
      }
    }

    return value;
  }

  /**
   * Turn raw text from the language files into fancy JSON
   * @param  {String} rawText
   * @return {Object} converted language file
   */
  fromFile(rawText) {
    const lines = rawText.split('\n');
    let lang = {};

    for (let matches, i = 0; i < lines.length; i++) {
      matches = lines[i].match(/^(.+?) *?= *?([^\n]+)/);
      if (matches) {
        let value = matches[2].replace(/^\s+|\s+$/, '');
        lang[matches[1]] = value;
      }
    }

    return lang;
  }

  /**
   * Remove double carriage returns
   * @param  {Object} response
   * @return {Object}          processed language
   */
  processFile(response) {
    let rawText = response.replace(/\n\n/g, '\n');
    return this.fromFile(rawText);
  }

  /**
   * Load a remotely stored language file
   * @param  {String} locale
   * @return {Promise}       resolves response
   */
  loadLang(locale) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      if (_this.langs[locale]) {
        resolve(_this.langs[locale]);
      } else {
        let xhr = new XMLHttpRequest();
        let langFile = _this.config.location + locale + _this.config.extension;
        xhr.open('GET', langFile, true);
        xhr.onload = function() {
          if (this.status <= 304) {
            let processedFile = _this.processFile(xhr.responseText);
            _this.langs[locale] = processedFile;
            resolve(processedFile);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function() {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
        xhr.send();
      }
    });
  }

  /**
   * return currently available languages
   * @return {Object} all configured languages
   */
  get getLangs() {
    return this.config.langs;
  }

  /**
   * Attempt to set the current language to the local provided
   * @param {String}   locale
   * @return {Promise} language
   */
  async setCurrent(locale = 'en-US') {
    await this.loadLang(locale);

    this.locale = locale;
    this.current = this.langs[locale];

    return this.current;
  }

}

export default new I18N();
