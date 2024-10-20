# mi18n [![npm version](https://badge.fury.io/js/mi18n.svg)](https://badge.fury.io/js/mi18n)

Add multi-lingual support to any JavaScript app or module with this light-weight package.

### Features:

- Isomorphic/Universal
- easy translation of static text files
  - benefits: anyone can translate, no more xliff
  - reduced margin of error.
- Variable support
- Dependency free
- Fast

## Usage

```javascript
import { I18n } from 'mi18n'

const i18nOptions = {
  extension: '.lang', // extnsion used by your language files, defaults to ".lang"
  location: 'https://location.of/language/files/', // absolute or relative url to language files
  langs: [
    // locales you would like to be active
    'en-US',
    'pt-BR',
    'de-DE', // will attempt to load `https://location.of/language/files/de-DE.lang` with current config
  ],
  locale: 'en-US', // default locale
  override: {
    'en-US': {
      autocomplete: 'Autofinish', // override individual keys or provide entire language definition
    },
  },
}
const i18n = new I18n(i18nOptions)
```

... then in your app

```jsx
<label>{i18n.get('addOption')}</label>
```

### Add a Language after initialization

```javascript
i18n.addLanguage('fr-FR', {
  addOption: 'Ajouter une option',
})
```

### Process a confige file

```javascript
i18n.processConfig(configFileString)
```

### Example `.lang` file

```txt
de-DE = Deutsch
en-US = German

addOption = Option hinzufügen
allFieldsRemoved = Alle Felder wurden entfernt.
allowMultipleFiles = Upload mehrerer Dateien erlauben
autocomplete = Autovervollständigung
```
