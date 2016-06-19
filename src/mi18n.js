class I18N {
  constructor() {
    var defaultConfig = {
        // local or remote directory containing language files
        langsDir: 'assets/lang/',
        // locale property should match language filenames
        langs: [
          'en-US',
          'es-ES'
        ]
      },
      _this = this;

    this.init = function(options) {
      _this.config = Object.assign({}, defaultConfig, options);

      _this.langs = {};
      _this.default = _this.config.langs[0];
      _this.current = _this.config.langs[0];
      _this.loaded = [];

      return _this.loadLang(_this.current);
    };

  }

  /**
   * get a string from a loaded language file
   * @param  {string} key  - the key for the string we are trying to retrieve
   * @return {string}      - correct language string
   */
  getValue(key) {
    var string = (this.langs[this.current] && this.langs[this.current][key]) || (this.langs[this.default] && this.langs[this.default][key]) || key;
    return string;
  }

  makeSafe(str) {
    var mapObj = {
      '{': '\\{',
      '}': '\\}',
      '|': '\\|'
    };
    return str.replace(/\{|\}|\|/g, function(matched) {
      return mapObj[matched];
    });
  }

  /**
   * Parse arguments for the requested string
   * @param  {string} key  the key we use to lookup our translation
   * @param  {multi}  args  string, number or object containing our arguments
   * @return {string}      updated string translation
   */
  get(key, args) {
    var _this = this,
      value = this.getValue(key),
      tokens = value.match(/\{[^\}]+?\}/g),
      token;

    if (args && tokens) {
      if ('object' === typeof args) {
        for (var i = 0; i < tokens.length; i++) {
          token = tokens[i].substring(1, tokens[i].length - 1);
          value = value.replace(new RegExp(_this.makeSafe(tokens[i]), 'g'), args[token] || '');
        }
      } else {
        value = value.replace(/\{[^\}]+?\}/g, args);
      }
    }

    return value;
  }

  /**
   * Turn raw text from the language files into fancy JSON
   * @param  {string} rawText
   * @return {object}
   */
  fromFile(rawText) {
    var lines = rawText.split('\n'),
      json = {};
    for (let matches, i = 0; i < lines.length; i++) {
      matches = lines[i].match(/^(.+?) *?= *?([^\n]+)/);
      if (matches) {
        json[matches[1]] = matches[2].replace(/^\s+|\s+$/, '');
      }
    }

    return json;
  }

  processFile(response) {
    let _this = this,
      rawText = response.replace(/\n\n/g, '\n'),
      json = _this.fromFile(rawText),
      locale = _this.current;

    if (!_this.langs[locale]) {
      _this.langs[locale] = json;
      _this.loaded.push(locale);
    }

  }

  loadLang(locale) {
    let _this = this;
    return new window.Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', _this.config.langsDir + locale, true);
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          _this.setCurrent(locale);
          _this.processFile(xhr.responseText);

          resolve(xhr.response);
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
    });
  }

  /**
   * return currently available languages
   * @return {object}
   */
  get getLangs() {
    return this.config.langs;
  }

  /**
   * attempt to set the current language to the local provided
   * @param {string}   locale
   */
  setCurrent(locale = 'en-US') {
    let current = locale || this.current;
    this.current = locale;
    window.sessionStorage.setItem('locale', current);
  }

}

export default new I18N();
