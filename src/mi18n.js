class I18N {
  constructor() {
    var defaultConfig = {
        // local or remote directory containing language files
        location: 'assets/lang/',
        // list of available locales, handy for populating selector.
        langs: [
          'en-US',
          'es-ES'
        ],
        default: 'en-US', // fallback locale
        current: 'en-US', // init with user's preferred language
        preloaded: {}
      },
      _this = this;

    this.init = function(options) {
      _this.config = Object.assign({}, defaultConfig, options);

      _this.langs = Object.assign({}, this.config.preloaded);
      _this.default = _this.config.default || _this.config.langs[0];
      _this.current = _this.config.current || _this.config.default || _this.config.langs[0];

      return _this.setCurrent(_this.current);
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
   * Temporarily put a string into the currently loaded language
   * @param  {string} key
   * @param  {string} string
   * @return {string}
   */
  put(key, string) {
    return this.langs[this.current][key] = string;
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
      rawText = response.replace(/\n\n/g, '\n');
    return _this.langs[_this.current] = _this.fromFile(rawText);
  }

  loadLang(locale) {
    let _this = this;
    return new window.Promise(function(resolve, reject) {
      if (_this.langs[_this.current]) {
        resolve(_this.langs[_this.current]);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _this.config.location + locale + '.lang', true);
        xhr.onload = function() {
          if (this.status <= 304) {
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
      }
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
    this.current = locale;
    let lang = this.loadLang(locale);

    window.sessionStorage.setItem('locale', locale);
    return lang;
  }

}

export default new I18N();
