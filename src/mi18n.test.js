const { expect } = require("chai");
const i18n = require("./mi18n.js");

const { default: mi18n, I18N } = i18n;

describe("I18N", () => {
  const locale = "te-ST";
  const testOpts = {
    locale,
    override: {
      "te-ST": {
        testKey: "Teeesst",
        testVars: "I saw {count} {animals}"
      }
    }
  };

  it("should exist", () => {
    expect(mi18n).to.exist;
  });

  describe("should have methods", () => {
    mi18n.init(testOpts).then(() => {
      describe("init()", () => {
        it("should exist", () => {
          expect(typeof mi18n.init).to.equal("function");
        });
        it("should set locale", () => {
          expect(mi18n.config.locale).to.equal(locale);
        });
        it("should set current language", () => {
          expect(mi18n.current).to.exist;
          expect(Object.keys(mi18n.current)).to.contain("testKey");
        });
      });
    });
  });

  describe("should have methods after init", () => {
    mi18n.init(testOpts).then(() => {
      describe("get()", () => {
        it("shall exist", () => expect(mi18n.get).to.exist);

        it("shall return a string", () => {
          const str = mi18n.get("testKey");
          expect(str).to.equal("Teeesst");
        });

        it("shall return a string with vars", () => {
          const str = mi18n.get("testVars", {
            count: 3,
            animals: "chickens"
          });
          expect(str).to.equal("I saw 3 chickens");
        });
      });
    });
  });

  describe("loadLang", () => {
    const location = "https://formbuilder.online/assets/lang/";
    const i18n = new I18N({ location });
    it("should load de-DE", done => {
      i18n.loadLang("de-DE").then(lang => {
        expect(lang).to.be.an("object");
        expect(Object.keys(i18n.langs)[0]).to.equal("de-DE");
        done();
      });
    });
  });

  describe("addLanguage", () => {
    const locale = "te-ST";
    const i18n = new I18N();
    it("should load te-ST", done => {
      i18n.addLanguage(locale, {
        myKey: "one thing",
        yourKey: "shouldn't change"
      });
      i18n.setCurrent(locale).then(() => {
        expect(i18n.locale).to.equal(locale);
        expect(i18n.get("myKey")).to.equal("one thing");
        expect(i18n.get("yourKey")).to.equal("shouldn't change");
        done();
      });
    });
  });
});
