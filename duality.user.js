// ==UserScript==
// @name         Duality
// @version      1.1
// @description  A fusion of KxsClient and Surplus, adding many extra features and cheats.
// @author       plazmascripts, mahdi, noam, Kisakay
// @run-at       document-start
// @grant        none
// @namespace    https://github.com/Kisakay/KxsClient
// @author       Kisakay
// @license      AGPL-3.0
// @run-at       document-end
// @icon         https://files.catbox.moe/onhbvw.png
// @match        *://survev.io/*
// @match        *://66.179.254.36/*
// @match        *://zurviv.io/*
// @match        *://resurviv.biz/*
// @match        *://leia-uwu.github.io/survev/*
// @match        *://survev.leia-is.gay/*
// @match        *://survivx.org
// @match        *://kxs.rip/*
// @grant        none
// @downloadURL none
// ==/UserScript==
;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 123:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 229:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.A = void 0;
;
class SimplifiedSteganoDB {
    data;
    options;
    database;
    constructor(options) {
        this.database = options?.database || "stegano.db";
        this.data = {};
        this.fetchDataFromFile();
    }
    read() { return localStorage.getItem(this.database) || this.data; }
    write() { return localStorage.setItem(this.database, JSON.stringify(this.data)); }
    setNestedProperty = (object, key, value) => {
        const properties = key.split('.');
        let currentObject = object;
        for (let i = 0; i < properties.length - 1; i++) {
            const property = properties[i];
            if (typeof currentObject[property] !== 'object' || currentObject[property] === null) {
                currentObject[property] = {};
            }
            currentObject = currentObject[property];
        }
        currentObject[properties[properties.length - 1]] = value;
    };
    getNestedProperty = (object, key) => {
        const properties = key.split('.');
        let index = 0;
        for (; index < properties.length; ++index) {
            object = object && object[properties[index]];
        }
        return object;
    };
    fetchDataFromFile() {
        try {
            const content = this.read();
            this.data = JSON.parse(content);
        }
        catch (error) {
            this.data = {};
        }
    }
    updateNestedProperty(key, operation, value) {
        const [id, ...rest] = key.split('.');
        const nestedPath = rest.join('.');
        if (!this.data[id] && operation !== 'get') {
            this.data[id] = nestedPath ? {} : undefined;
        }
        if (this.data[id] === undefined && operation === 'get') {
            return undefined;
        }
        switch (operation) {
            case 'get':
                return nestedPath ? this.getNestedProperty(this.data[id], nestedPath) : this.data[id];
            case 'set':
                if (nestedPath) {
                    if (typeof this.data[id] !== 'object' || this.data[id] === null) {
                        this.data[id] = {};
                    }
                    this.setNestedProperty(this.data[id], nestedPath, value);
                }
                else {
                    this.data[id] = value;
                }
                this.write();
                break;
            case 'add':
                if (!nestedPath) {
                    this.data[id] = (typeof this.data[id] === 'number' ? this.data[id] : 0) + value;
                }
                else {
                    if (typeof this.data[id] !== 'object' || this.data[id] === null) {
                        this.data[id] = {};
                    }
                    const existingValue = this.getNestedProperty(this.data[id], nestedPath);
                    if (typeof existingValue !== 'number' && existingValue !== undefined) {
                        throw new TypeError('The existing value is not a number.');
                    }
                    this.setNestedProperty(this.data[id], nestedPath, (typeof existingValue === 'number' ? existingValue : 0) + value);
                }
                this.write();
                break;
            case 'sub':
                if (!nestedPath) {
                    this.data[id] = (typeof this.data[id] === 'number' ? this.data[id] : 0) - value;
                }
                else {
                    if (typeof this.data[id] !== 'object' || this.data[id] === null) {
                        this.data[id] = {};
                    }
                    const existingValue = this.getNestedProperty(this.data[id], nestedPath);
                    if (typeof existingValue !== 'number' && existingValue !== undefined && existingValue !== null) {
                        throw new TypeError('The existing value is not a number.');
                    }
                    this.setNestedProperty(this.data[id], nestedPath, (typeof existingValue === 'number' ? existingValue : 0) - value);
                }
                this.write();
                break;
            case 'delete':
                if (nestedPath) {
                    if (typeof this.data[id] !== 'object' || this.data[id] === null) {
                        return;
                    }
                    const properties = nestedPath.split('.');
                    let currentObject = this.data[id];
                    for (let i = 0; i < properties.length - 1; i++) {
                        const property = properties[i];
                        if (!currentObject[property]) {
                            return;
                        }
                        currentObject = currentObject[property];
                    }
                    delete currentObject[properties[properties.length - 1]];
                }
                else {
                    delete this.data[id];
                }
                this.write();
                break;
            case 'pull':
                const existingArray = nestedPath ?
                    this.getNestedProperty(this.data[id], nestedPath) :
                    this.data[id];
                if (!Array.isArray(existingArray)) {
                    throw new Error('The stored value is not an array');
                }
                const newArray = existingArray.filter((item) => item !== value);
                if (nestedPath) {
                    this.setNestedProperty(this.data[id], nestedPath, newArray);
                }
                else {
                    this.data[id] = newArray;
                }
                this.write();
                break;
        }
    }
    get(key) {
        return this.updateNestedProperty(key, 'get');
    }
    set(key, value) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        this.updateNestedProperty(key, 'set', value);
    }
    pull(key, value) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        this.updateNestedProperty(key, 'pull', value);
    }
    add(key, count) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }
        this.updateNestedProperty(key, 'add', count);
    }
    sub(key, count) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }
        this.updateNestedProperty(key, 'sub', count);
    }
    delete(key) {
        this.updateNestedProperty(key, 'delete');
    }
    cache(key, value, time) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null ou contain a space.");
        }
        if (!time || isNaN(time)) {
            throw new SyntaxError("The time needs to be a number. (ms)");
        }
        this.updateNestedProperty(key, 'set', value);
        setTimeout(() => {
            this.updateNestedProperty(key, 'delete');
        }, time);
    }
    push(key, element) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        const [id, ...rest] = key.split('.');
        const nestedPath = rest.join('.');
        if (!this.data[id]) {
            this.data[id] = nestedPath ? {} : [];
        }
        if (nestedPath) {
            const existingArray = this.getNestedProperty(this.data[id], nestedPath);
            if (!existingArray) {
                this.setNestedProperty(this.data[id], nestedPath, [element]);
            }
            else if (!Array.isArray(existingArray)) {
                throw new Error('The stored value is not an array');
            }
            else {
                existingArray.push(element);
                this.setNestedProperty(this.data[id], nestedPath, existingArray);
            }
        }
        else {
            if (!Array.isArray(this.data[id])) {
                this.data[id] = [];
            }
            this.data[id].push(element);
        }
        this.write();
    }
    has(key) {
        return Boolean(this.get(key));
    }
    deleteAll() {
        this.data = {};
        this.write();
    }
    all() {
        return this.data;
    }
}
exports.A = SimplifiedSteganoDB;


/***/ }),

/***/ 272:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 560:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(908)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 580:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(560)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 587:
/***/ ((module) => {

// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({ })
const parseOptions = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
module.exports = parseOptions


/***/ }),

/***/ 686:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.w = void 0;
;
class SteganoDB {
    data;
    currentTable;
    options;
    database;
    constructor(options) {
        this.currentTable = options?.tableName || "json";
        this.database = options.database || "stegano.db";
        this.data = {
            [this.currentTable]: []
        };
        this.fetchDataFromFile();
    }
    read() { return localStorage.getItem(this.database) || this.data; }
    write() { return localStorage.setItem(this.database, JSON.stringify(this.data)); }
    setNestedProperty = (object, key, value) => {
        const properties = key.split('.');
        let currentObject = object;
        for (let i = 0; i < properties.length - 1; i++) {
            const property = properties[i];
            if (typeof currentObject[property] !== 'object' || currentObject[property] === null) {
                currentObject[property] = {};
            }
            currentObject = currentObject[property];
        }
        currentObject[properties[properties.length - 1]] = value;
    };
    getNestedProperty = (object, key) => {
        const properties = key.split('.');
        let index = 0;
        for (; index < properties.length; ++index) {
            object = object && object[properties[index]];
        }
        return object;
    };
    fetchDataFromFile() {
        try {
            const content = this.read();
            this.data = JSON.parse(content);
        }
        catch (error) {
            this.data = { [this.currentTable]: [] };
        }
    }
    updateNestedProperty(key, operation, value) {
        const [id, ...rest] = key.split('.');
        const nestedPath = rest.join('.');
        let currentValue = this.data[this.currentTable].find((entry) => entry.id === id);
        if (!currentValue && operation !== 'get') {
            currentValue = { id, value: {} };
            this.data[this.currentTable].push(currentValue);
        }
        if (!currentValue && operation === 'get') {
            return undefined;
        }
        switch (operation) {
            case 'get':
                return nestedPath ? this.getNestedProperty(currentValue.value, nestedPath) : currentValue.value;
            case 'set':
                if (nestedPath) {
                    this.setNestedProperty(currentValue.value, nestedPath, value);
                }
                else {
                    currentValue.value = value;
                }
                this.write();
                break;
            case 'add':
                if (!nestedPath) {
                    currentValue.value = (typeof currentValue.value === 'number' ? currentValue.value : 0) + value;
                }
                else {
                    const existingValue = this.getNestedProperty(currentValue.value, nestedPath);
                    if (typeof existingValue !== 'number' && existingValue !== undefined) {
                        throw new TypeError('The existing value is not a number.');
                    }
                    this.setNestedProperty(currentValue.value, nestedPath, (typeof existingValue === 'number' ? existingValue : 0) + value);
                }
                this.write();
                break;
            case 'sub':
                if (!nestedPath) {
                    currentValue.value = (typeof currentValue.value === 'number' ? currentValue.value : 0) - value;
                }
                else {
                    const existingValue = this.getNestedProperty(currentValue.value, nestedPath);
                    if (typeof existingValue !== 'number' && existingValue !== undefined && existingValue !== null) {
                        throw new TypeError('The existing value is not a number.');
                    }
                    this.setNestedProperty(currentValue.value, nestedPath, (typeof existingValue === 'number' ? existingValue : 0) - value);
                }
                this.write();
                break;
            case 'delete':
                if (nestedPath) {
                    const properties = nestedPath.split('.');
                    let currentObject = currentValue.value;
                    for (let i = 0; i < properties.length - 1; i++) {
                        const property = properties[i];
                        if (!currentObject[property]) {
                            return;
                        }
                        currentObject = currentObject[property];
                    }
                    delete currentObject[properties[properties.length - 1]];
                }
                else {
                    const index = this.data[this.currentTable].findIndex((entry) => entry.id === id);
                    if (index !== -1) {
                        this.data[this.currentTable].splice(index, 1);
                    }
                }
                this.write();
                break;
            case 'pull':
                const existingArray = nestedPath ? this.getNestedProperty(currentValue.value, nestedPath) : currentValue.value;
                if (!Array.isArray(existingArray)) {
                    throw new Error('The stored value is not an array');
                }
                const newArray = existingArray.filter((item) => item !== value);
                if (nestedPath) {
                    this.setNestedProperty(currentValue.value, nestedPath, newArray);
                }
                else {
                    currentValue.value = newArray;
                }
                this.write();
                break;
        }
    }
    table(tableName) {
        if (tableName.includes(" ") || !tableName || tableName === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        if (!this.data[tableName]) {
            this.data[tableName] = [];
        }
        return new SteganoDB(this.options);
    }
    get(key) {
        return this.updateNestedProperty(key, 'get');
    }
    set(key, value) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        this.updateNestedProperty(key, 'set', value);
    }
    pull(key, value) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        this.updateNestedProperty(key, 'pull', value);
    }
    add(key, count) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }
        this.updateNestedProperty(key, 'add', count);
    }
    sub(key, count) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        if (isNaN(count)) {
            throw new SyntaxError("The value is NaN.");
        }
        this.updateNestedProperty(key, 'sub', count);
    }
    delete(key) {
        this.updateNestedProperty(key, 'delete');
    }
    cache(key, value, time) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null ou contain a space.");
        }
        if (!time || isNaN(time)) {
            throw new SyntaxError("The time needs to be a number. (ms)");
        }
        this.updateNestedProperty(key, 'set', value);
        setTimeout(() => {
            this.updateNestedProperty(key, 'delete');
        }, time);
    }
    push(key, element) {
        if (key.includes(" ") || !key || key === "") {
            throw new SyntaxError("Key can't be null or contain a space.");
        }
        const [id, ...rest] = key.split('.');
        const nestedPath = rest.join('.');
        let currentValue = this.data[this.currentTable].find((entry) => entry.id === id);
        if (!currentValue) {
            currentValue = { id, value: nestedPath ? {} : [] };
            this.data[this.currentTable].push(currentValue);
        }
        if (nestedPath) {
            const existingArray = this.getNestedProperty(currentValue.value, nestedPath);
            if (!existingArray) {
                this.setNestedProperty(currentValue.value, nestedPath, [element]);
            }
            else if (!Array.isArray(existingArray)) {
                throw new Error('The stored value is not an array');
            }
            else {
                existingArray.push(element);
                this.setNestedProperty(currentValue.value, nestedPath, existingArray);
            }
        }
        else {
            if (!Array.isArray(currentValue.value)) {
                currentValue.value = [];
            }
            currentValue.value.push(element);
        }
        this.write();
    }
    has(key) {
        return Boolean(this.get(key));
    }
    deleteAll() {
        this.data[this.currentTable] = [];
        this.write();
    }
    all() {
        return this.data[this.currentTable];
    }
}
exports.w = SteganoDB;


/***/ }),

/***/ 718:
/***/ ((module, exports, __webpack_require__) => {

const {
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_LENGTH,
} = __webpack_require__(874)
const debug = __webpack_require__(272)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const safeSrc = exports.safeSrc = []
const t = exports.t = {}
let R = 0

const LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
]

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`)
  }
  return value
}

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value)
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  safeSrc[index] = safe
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '\\d+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`)

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`)

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCEPLAIN', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`)
createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`)
createToken('COERCEFULL', src[t.COERCEPLAIN] +
              `(?:${src[t.PRERELEASE]})?` +
              `(?:${src[t.BUILD]})?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)
createToken('COERCERTLFULL', src[t.COERCEFULL], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 746:
/***/ (() => {

"use strict";

// --- HOOK GLOBAL WEBSOCKET POUR INTERCEPTION gameId & PTC monitoring ---
(function () {
    const OriginalWebSocket = window.WebSocket;
    function HookedWebSocket(url, protocols) {
        const ws = protocols !== undefined
            ? new OriginalWebSocket(url, protocols)
            : new OriginalWebSocket(url);
        if (typeof url === "string" && url.includes("gameId=")) {
            const gameId = url.split("gameId=")[1];
            globalThis.kxsClient.kxsNetwork.sendGameInfoToWebSocket(gameId);
        }
        return ws;
    }
    // Copie le prototype
    HookedWebSocket.prototype = OriginalWebSocket.prototype;
    // Copie les propriétés statiques (CONNECTING, OPEN, etc.)
    Object.defineProperties(HookedWebSocket, {
        CONNECTING: { value: OriginalWebSocket.CONNECTING, writable: false },
        OPEN: { value: OriginalWebSocket.OPEN, writable: false },
        CLOSING: { value: OriginalWebSocket.CLOSING, writable: false },
        CLOSED: { value: OriginalWebSocket.CLOSED, writable: false },
    });
    // Remplace le constructeur global
    window.WebSocket = HookedWebSocket;
})();


/***/ }),

/***/ 874:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}


/***/ }),

/***/ 908:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const debug = __webpack_require__(272)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __webpack_require__(874)
const { safeRe: re, safeSrc: src, t } = __webpack_require__(718)

const parseOptions = __webpack_require__(587)
const { compareIdentifiers } = __webpack_require__(123)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
        version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('build compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    if (release.startsWith('pre')) {
      if (!identifier && identifierBase === false) {
        throw new Error('invalid increment argument: identifier is empty')
      }
      // Avoid an invalid semver results
      if (identifier) {
        const r = new RegExp(`^${this.options.loose ? src[t.PRERELEASELOOSE] : src[t.PRERELEASE]}$`)
        const match = `-${identifier}`.match(r)
        if (!match || match[1] !== identifier) {
          throw new Error(`invalid identifier: ${identifier}`)
        }
      }
    }

    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier, identifierBase)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier, identifierBase)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier, identifierBase)
        this.inc('pre', identifier, identifierBase)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase)
        }
        this.inc('pre', identifier, identifierBase)
        break
      case 'release':
        if (this.prerelease.length === 0) {
          throw new Error(`version ${this.raw} is not a prerelease`)
        }
        this.prerelease.length = 0
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0

        if (this.prerelease.length === 0) {
          this.prerelease = [base]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base]
          if (identifierBase === false) {
            prerelease = [identifier]
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease
            }
          } else {
            this.prerelease = prerelease
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format()
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`
    }
    return this
  }
}

module.exports = SemVer


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./src/UTILS/websocket-hook.ts
var websocket_hook = __webpack_require__(746);
// EXTERNAL MODULE: ../../GitLab/SteganoDB2/lib/simplified_browser.js
var simplified_browser = __webpack_require__(229);
;// ./config.json
const config_namespaceObject = /*#__PURE__*/JSON.parse('{"base_url":"https://kxs.rip","api_url":"https://network.kxs.rip","fileName":"KxsClient.user.js","match":["*://survev.io/*","*://66.179.254.36/*","*://zurviv.io/*","*://resurviv.biz/*","*://leia-uwu.github.io/survev/*","*://survev.leia-is.gay/*","*://survivx.org","*://kxs.rip/*"],"grant":["none"]}');
;// ./src/UTILS/vars.ts


const background_song = config_namespaceObject.base_url + "/assets/Stranger_Things_Theme_Song_C418_REMIX.mp3";
const kxs_logo = "https://files.catbox.moe/onhbvw.png";
const full_logo = "https://files.catbox.moe/1yu9ii.png";
const background_image = config_namespaceObject.base_url + "/assets/background.jpg";
const win_sound = config_namespaceObject.base_url + "/assets/win.m4a";
const death_sound = config_namespaceObject.base_url + "/assets/dead.m4a";
const survev_settings = new simplified_browser/* SimplifiedSteganoDB */.A({
    database: "surviv_config",
});
const kxs_settings = new simplified_browser/* SimplifiedSteganoDB */.A({
    database: "userSettings"
});

;// ./src/MECHANIC/intercept.ts
function intercept(link, targetUrl) {
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url.includes(link)) {
            arguments[1] = targetUrl;
        }
        open.apply(this, arguments);
    };
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        if (url.includes(link)) {
            url = targetUrl;
        }
        return originalFetch.apply(this, arguments);
    };
}


;// ./src/HUD/MOD/HealthWarning.ts
class HealthWarning {
    constructor(kxsClient) {
        this.isDraggable = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.POSITION_KEY = 'lowHpWarning';
        this.menuCheckInterval = null;
        this.warningElement = null;
        this.kxsClient = kxsClient;
        this.createWarningElement();
        this.setFixedPosition();
        this.setupDragAndDrop();
        this.startMenuCheckInterval();
    }
    createWarningElement() {
        const warning = document.createElement("div");
        const uiTopLeft = document.getElementById("ui-top-left");
        warning.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ff0000;
            border-radius: 5px;
            padding: 10px 15px;
            color: #ff0000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            display: none;
            backdrop-filter: blur(5px);
            pointer-events: none;
            transition: border-color 0.3s ease;
        `;
        const content = document.createElement("div");
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        const icon = document.createElement("div");
        icon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        `;
        const text = document.createElement("span");
        text.textContent = "LOW HP!";
        if (uiTopLeft) {
            content.appendChild(icon);
            content.appendChild(text);
            warning.appendChild(content);
            uiTopLeft.appendChild(warning);
        }
        this.warningElement = warning;
        this.addPulseAnimation();
    }
    setFixedPosition() {
        if (!this.warningElement)
            return;
        // Récupérer la position depuis le localStorage ou les valeurs par défaut
        const storageKey = `position_${this.POSITION_KEY}`;
        const savedPosition = localStorage.getItem(storageKey);
        let position;
        if (savedPosition) {
            try {
                // Utiliser la position sauvegardée
                const { x, y } = JSON.parse(savedPosition);
                position = { left: x, top: y };
            }
            catch (error) {
                // En cas d'erreur, utiliser la position par défaut
                position = this.kxsClient.defaultPositions[this.POSITION_KEY];
                this.kxsClient.logger.error('Erreur lors du chargement de la position LOW HP:', error);
            }
        }
        else {
            // Utiliser la position par défaut
            position = this.kxsClient.defaultPositions[this.POSITION_KEY];
        }
        // Appliquer la position
        if (position) {
            this.warningElement.style.top = `${position.top}px`;
            this.warningElement.style.left = `${position.left}px`;
        }
    }
    addPulseAnimation() {
        const keyframes = `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        const style = document.createElement("style");
        style.textContent = keyframes;
        document.head.appendChild(style);
        if (this.warningElement) {
            this.warningElement.style.animation = "pulse 1.5s infinite";
        }
    }
    show(health) {
        if (!this.warningElement)
            return;
        this.warningElement.style.display = "block";
        const span = this.warningElement.querySelector("span");
        if (span) {
            span.textContent = `LOW HP: ${health}%`;
        }
    }
    hide() {
        if (!this.warningElement)
            return;
        // Ne pas masquer si en mode placement
        // if (this.isDraggable) return;
        this.warningElement.style.display = "none";
    }
    update(health) {
        // Si le mode placement est actif (isDraggable), on ne fait rien pour maintenir l'affichage
        if (this.isDraggable) {
            return;
        }
        // Sinon, comportement normal
        if (health <= 30 && health > 0) {
            this.show(health);
        }
        else {
            this.hide();
        }
    }
    setupDragAndDrop() {
        // Nous n'avons plus besoin d'écouteurs pour RSHIFT car nous utilisons maintenant
        // l'état du menu secondaire pour déterminer quand activer/désactiver le mode placement
        // Écouteurs d'événements de souris pour le glisser-déposer
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
    enableDragging() {
        if (!this.warningElement)
            return;
        this.isDraggable = true;
        this.warningElement.style.pointerEvents = 'auto';
        this.warningElement.style.cursor = 'move';
        this.warningElement.style.borderColor = '#00ff00'; // Feedback visuel quand déplaçable
        // Force l'affichage de l'avertissement LOW HP, peu importe la santé actuelle
        this.warningElement.style.display = 'block';
        const span = this.warningElement.querySelector("span");
        if (span) {
            span.textContent = 'LOW HP: Placement Mode';
        }
    }
    disableDragging() {
        if (!this.warningElement)
            return;
        this.isDraggable = false;
        this.isDragging = false;
        this.warningElement.style.pointerEvents = 'none';
        this.warningElement.style.cursor = 'default';
        this.warningElement.style.borderColor = '#ff0000'; // Retour à la couleur normale
        // Remet le texte original si l'avertissement est visible
        if (this.warningElement.style.display === 'block') {
            const span = this.warningElement.querySelector("span");
            if (span) {
                span.textContent = 'LOW HP';
            }
        }
        // Récupérer la santé actuelle à partir de l'élément UI de santé du jeu
        const healthBars = document.querySelectorAll("#ui-health-container");
        if (healthBars.length > 0) {
            const bar = healthBars[0].querySelector("#ui-health-actual");
            if (bar) {
                const currentHealth = Math.round(parseFloat(bar.style.width));
                // Forcer une mise à jour immédiate en fonction de la santé actuelle
                this.update(currentHealth);
            }
        }
    }
    handleMouseDown(event) {
        if (!this.isDraggable || !this.warningElement)
            return;
        // Check if click was on the warning element
        if (this.warningElement.contains(event.target)) {
            this.isDragging = true;
            // Calculate offset from mouse position to element corner
            const rect = this.warningElement.getBoundingClientRect();
            this.dragOffset = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            // Prevent text selection during drag
            event.preventDefault();
        }
    }
    handleMouseMove(event) {
        if (!this.isDragging || !this.warningElement)
            return;
        // Calculate new position
        const newX = event.clientX - this.dragOffset.x;
        const newY = event.clientY - this.dragOffset.y;
        // Update element position
        this.warningElement.style.left = `${newX}px`;
        this.warningElement.style.top = `${newY}px`;
    }
    handleMouseUp() {
        if (this.isDragging && this.warningElement) {
            this.isDragging = false;
            // Récupérer les positions actuelles
            const left = parseInt(this.warningElement.style.left);
            const top = parseInt(this.warningElement.style.top);
            // Sauvegarder la position
            const storageKey = `position_${this.POSITION_KEY}`;
            localStorage.setItem(storageKey, JSON.stringify({ x: left, y: top }));
        }
    }
    startMenuCheckInterval() {
        // Créer un intervalle qui vérifie régulièrement l'état du menu RSHIFT
        this.menuCheckInterval = window.setInterval(() => {
            var _a;
            // Vérifier si le menu secondaire est ouvert
            const isMenuOpen = ((_a = this.kxsClient.secondaryMenu) === null || _a === void 0 ? void 0 : _a.isOpen) || false;
            // Si le menu est ouvert et que nous ne sommes pas en mode placement, activer le mode placement
            if (isMenuOpen && this.kxsClient.isHealthWarningEnabled && !this.isDraggable) {
                this.enableDragging();
            }
            // Si le menu est fermé et que nous sommes en mode placement, désactiver le mode placement
            else if (!isMenuOpen && this.isDraggable) {
                this.disableDragging();
            }
        }, 100); // Vérifier toutes les 100ms
    }
}


;// ./src/MECHANIC/KillLeaderTracking.ts
class KillLeaderTracker {
    constructor(kxsClient) {
        this.offsetX = 20;
        this.offsetY = 20;
        this.lastKnownKills = 0;
        this.wasKillLeader = false;
        this.MINIMUM_KILLS_FOR_LEADER = 3;
        this.kxsClient = kxsClient;
        this.warningElement = null;
        this.encouragementElement = null;
        this.killLeaderKillCount = 0;
        this.wasKillLeader = false;
        this.createEncouragementElement();
        this.initMouseTracking();
    }
    createEncouragementElement() {
        const encouragement = document.createElement("div");
        encouragement.style.cssText = `
            position: fixed;
            background: rgba(0, 255, 0, 0.1);
            border: 2px solid #00ff00;
            border-radius: 5px;
            padding: 10px 15px;
            color: #00ff00;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            display: none;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            pointer-events: none;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
        `;
        const content = document.createElement("div");
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        const icon = document.createElement("div");
        icon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
        `;
        const text = document.createElement("span");
        text.textContent = "Nice Kill!";
        content.appendChild(icon);
        content.appendChild(text);
        encouragement.appendChild(content);
        document.body.appendChild(encouragement);
        this.encouragementElement = encouragement;
        this.addEncouragementAnimation();
    }
    initMouseTracking() {
        document.addEventListener("mousemove", (e) => {
            this.updateElementPosition(this.warningElement, e);
            this.updateElementPosition(this.encouragementElement, e);
        });
    }
    updateElementPosition(element, e) {
        if (!element || element.style.display === "none")
            return;
        const x = e.clientX + this.offsetX;
        const y = e.clientY + this.offsetY;
        const rect = element.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        const finalX = Math.min(Math.max(0, x), maxX);
        const finalY = Math.min(Math.max(0, y), maxY);
        element.style.transform = `translate(${finalX}px, ${finalY}px)`;
    }
    addEncouragementAnimation() {
        const keyframes = `
            @keyframes encouragementPulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        const style = document.createElement("style");
        style.textContent = keyframes;
        document.head.appendChild(style);
        if (this.encouragementElement) {
            this.encouragementElement.style.animation = "fadeInOut 3s forwards";
        }
    }
    showEncouragement(killsToLeader, isDethrone = false, noKillLeader = false) {
        if (!this.encouragementElement)
            return;
        let message;
        if (isDethrone && killsToLeader !== 0) {
            message = "Oh no! You've been dethroned!";
            this.encouragementElement.style.borderColor = "#ff0000";
            this.encouragementElement.style.color = "#ff0000";
            this.encouragementElement.style.background = "rgba(255, 0, 0, 0.1)";
        }
        else if (noKillLeader) {
            const killsNeeded = this.MINIMUM_KILLS_FOR_LEADER - this.lastKnownKills;
            message = `Nice Kill! Get ${killsNeeded} more kills to become the first Kill Leader!`;
        }
        else {
            message =
                killsToLeader <= 0
                    ? "You're the Kill Leader! 👑"
                    : `Nice Kill! ${killsToLeader} more to become Kill Leader!`;
        }
        const span = this.encouragementElement.querySelector("span");
        if (span)
            span.textContent = message;
        this.encouragementElement.style.display = "block";
        this.encouragementElement.style.animation = "fadeInOut 3s forwards";
        setTimeout(() => {
            if (this.encouragementElement) {
                this.encouragementElement.style.display = "none";
                // Reset colors
                this.encouragementElement.style.borderColor = "#00ff00";
                this.encouragementElement.style.color = "#00ff00";
                this.encouragementElement.style.background = "rgba(0, 255, 0, 0.1)";
            }
        }, 7000);
    }
    isKillLeader() {
        const killLeaderNameElement = document.querySelector("#ui-kill-leader-name");
        return this.kxsClient.getPlayerName() === (killLeaderNameElement === null || killLeaderNameElement === void 0 ? void 0 : killLeaderNameElement.textContent);
    }
    update(myKills) {
        if (!this.kxsClient.isKillLeaderTrackerEnabled)
            return;
        const killLeaderElement = document.querySelector("#ui-kill-leader-count");
        this.killLeaderKillCount = parseInt((killLeaderElement === null || killLeaderElement === void 0 ? void 0 : killLeaderElement.textContent) || "0", 10);
        if (myKills > this.lastKnownKills) {
            if (this.killLeaderKillCount === 0) {
                // Pas encore de kill leader, encourager le joueur à atteindre 3 kills
                this.showEncouragement(0, false, true);
            }
            else if (this.killLeaderKillCount < this.MINIMUM_KILLS_FOR_LEADER) {
                // Ne rien faire si le kill leader n'a pas atteint le minimum requis
                return;
            }
            else if (this.isKillLeader()) {
                this.showEncouragement(0);
                this.wasKillLeader = true;
            }
            else {
                const killsNeeded = this.killLeaderKillCount + 1 - myKills;
                this.showEncouragement(killsNeeded);
            }
        }
        else if (this.wasKillLeader && !this.isKillLeader()) {
            // Détroné
            this.showEncouragement(0, true);
            this.wasKillLeader = false;
        }
        this.lastKnownKills = myKills;
    }
}


;// ./src/HUD/GridSystem.ts
class GridSystem {
    constructor() {
        this.gridSize = 20; // Size of each grid cell
        this.snapThreshold = 15; // Distance in pixels to trigger snap
        this.gridVisible = false;
        this.magneticEdges = true;
        this.counterElements = {};
        this.gridContainer = this.createGridOverlay();
        this.setupKeyBindings();
    }
    createGridOverlay() {
        const container = document.createElement("div");
        container.id = "grid-overlay";
        Object.assign(container.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: "9999",
            display: "none",
            opacity: "0.2",
        });
        // Create vertical lines
        for (let x = this.gridSize; x < window.innerWidth; x += this.gridSize) {
            const vLine = document.createElement("div");
            Object.assign(vLine.style, {
                position: "absolute",
                left: `${x}px`,
                top: "0",
                width: "1px",
                height: "100%",
                backgroundColor: "#4CAF50",
            });
            container.appendChild(vLine);
        }
        // Create horizontal lines
        for (let y = this.gridSize; y < window.innerHeight; y += this.gridSize) {
            const hLine = document.createElement("div");
            Object.assign(hLine.style, {
                position: "absolute",
                left: "0",
                top: `${y}px`,
                width: "100%",
                height: "1px",
                backgroundColor: "#4CAF50",
            });
            container.appendChild(hLine);
        }
        document.body.appendChild(container);
        return container;
    }
    setupKeyBindings() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "g" && e.altKey) {
                this.toggleGrid();
            }
        });
    }
    toggleGrid() {
        this.gridVisible = !this.gridVisible;
        this.gridContainer.style.display = this.gridVisible ? "block" : "none";
    }
    registerCounter(id, element) {
        if (element) {
            this.counterElements[id] = element;
        }
        else {
            delete this.counterElements[id];
        }
    }
    areElementsAdjacent(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        const tolerance = 5;
        const isLeftAdjacent = Math.abs((rect1.left + rect1.width) - rect2.left) < tolerance;
        const isRightAdjacent = Math.abs((rect2.left + rect2.width) - rect1.left) < tolerance;
        const isTopAdjacent = Math.abs((rect1.top + rect1.height) - rect2.top) < tolerance;
        const isBottomAdjacent = Math.abs((rect2.top + rect2.height) - rect1.top) < tolerance;
        const overlapVertically = (rect1.top < rect2.bottom && rect1.bottom > rect2.top) ||
            (rect2.top < rect1.bottom && rect2.bottom > rect1.top);
        const overlapHorizontally = (rect1.left < rect2.right && rect1.right > rect2.left) ||
            (rect2.left < rect1.right && rect2.right > rect1.left);
        let position = "";
        if (isLeftAdjacent && overlapVertically)
            position = "left";
        else if (isRightAdjacent && overlapVertically)
            position = "right";
        else if (isTopAdjacent && overlapHorizontally)
            position = "top";
        else if (isBottomAdjacent && overlapHorizontally)
            position = "bottom";
        return {
            isAdjacent: (isLeftAdjacent || isRightAdjacent) && overlapVertically ||
                (isTopAdjacent || isBottomAdjacent) && overlapHorizontally,
            position
        };
    }
    updateCounterCorners() {
        const counterIds = Object.keys(this.counterElements);
        counterIds.forEach(id => {
            const container = this.counterElements[id];
            const counter = container.querySelector('div');
            if (counter) {
                counter.style.borderRadius = '5px';
            }
        });
        for (let i = 0; i < counterIds.length; i++) {
            for (let j = i + 1; j < counterIds.length; j++) {
                const container1 = this.counterElements[counterIds[i]];
                const container2 = this.counterElements[counterIds[j]];
                const counter1 = container1.querySelector('div');
                const counter2 = container2.querySelector('div');
                if (counter1 && counter2) {
                    const { isAdjacent, position } = this.areElementsAdjacent(container1, container2);
                    if (isAdjacent) {
                        switch (position) {
                            case "left":
                                counter1.style.borderTopRightRadius = '0';
                                counter1.style.borderBottomRightRadius = '0';
                                counter2.style.borderTopLeftRadius = '0';
                                counter2.style.borderBottomLeftRadius = '0';
                                break;
                            case "right":
                                counter1.style.borderTopLeftRadius = '0';
                                counter1.style.borderBottomLeftRadius = '0';
                                counter2.style.borderTopRightRadius = '0';
                                counter2.style.borderBottomRightRadius = '0';
                                break;
                            case "top":
                                counter1.style.borderBottomLeftRadius = '0';
                                counter1.style.borderBottomRightRadius = '0';
                                counter2.style.borderTopLeftRadius = '0';
                                counter2.style.borderTopRightRadius = '0';
                                break;
                            case "bottom":
                                counter1.style.borderTopLeftRadius = '0';
                                counter1.style.borderTopRightRadius = '0';
                                counter2.style.borderBottomLeftRadius = '0';
                                counter2.style.borderBottomRightRadius = '0';
                                break;
                        }
                    }
                }
            }
        }
    }
    snapToGrid(element, x, y) {
        const rect = element.getBoundingClientRect();
        const elementWidth = rect.width;
        const elementHeight = rect.height;
        // Snap to grid
        let snappedX = Math.round(x / this.gridSize) * this.gridSize;
        let snappedY = Math.round(y / this.gridSize) * this.gridSize;
        // Edge snapping
        if (this.magneticEdges) {
            const screenEdges = {
                left: 0,
                right: window.innerWidth - elementWidth,
                center: (window.innerWidth - elementWidth) / 2,
                top: 0,
                bottom: window.innerHeight - elementHeight,
                middle: (window.innerHeight - elementHeight) / 2,
            };
            // Snap to horizontal edges
            if (Math.abs(x - screenEdges.left) < this.snapThreshold) {
                snappedX = screenEdges.left;
            }
            else if (Math.abs(x - screenEdges.right) < this.snapThreshold) {
                snappedX = screenEdges.right;
            }
            else if (Math.abs(x - screenEdges.center) < this.snapThreshold) {
                snappedX = screenEdges.center;
            }
            // Snap to vertical edges
            if (Math.abs(y - screenEdges.top) < this.snapThreshold) {
                snappedY = screenEdges.top;
            }
            else if (Math.abs(y - screenEdges.bottom) < this.snapThreshold) {
                snappedY = screenEdges.bottom;
            }
            else if (Math.abs(y - screenEdges.middle) < this.snapThreshold) {
                snappedY = screenEdges.middle;
            }
        }
        setTimeout(() => this.updateCounterCorners(), 10);
        return { x: snappedX, y: snappedY };
    }
    highlightNearestGridLine(x, y) {
        if (!this.gridVisible)
            return;
        // Remove existing highlights
        const highlights = document.querySelectorAll(".grid-highlight");
        highlights.forEach((h) => h.remove());
        // Create highlight for nearest vertical line
        const nearestX = Math.round(x / this.gridSize) * this.gridSize;
        if (Math.abs(x - nearestX) < this.snapThreshold) {
            const vHighlight = document.createElement("div");
            Object.assign(vHighlight.style, {
                position: "absolute",
                left: `${nearestX}px`,
                top: "0",
                width: "2px",
                height: "100%",
                backgroundColor: "#FFD700",
                zIndex: "10000",
                pointerEvents: "none",
            });
            vHighlight.classList.add("grid-highlight");
            this.gridContainer.appendChild(vHighlight);
        }
        // Create highlight for nearest horizontal line
        const nearestY = Math.round(y / this.gridSize) * this.gridSize;
        if (Math.abs(y - nearestY) < this.snapThreshold) {
            const hHighlight = document.createElement("div");
            Object.assign(hHighlight.style, {
                position: "absolute",
                left: "0",
                top: `${nearestY}px`,
                width: "100%",
                height: "2px",
                backgroundColor: "#FFD700",
                zIndex: "10000",
                pointerEvents: "none",
            });
            hHighlight.classList.add("grid-highlight");
            this.gridContainer.appendChild(hHighlight);
        }
    }
}


;// ./src/SERVER/DiscordTracking.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const stuff_emojis = {
    main_weapon: "🔫",
    secondary_weapon: "🔫",
    grenades: "💣",
    melees: "🔪",
    soda: "🥤",
    medkit: "🩹",
    bandage: "🩹",
    pills: "💊",
    backpack: "🎒",
    chest: "📦",
    helmet: "⛑️"
};
class WebhookValidator {
    static isValidWebhookUrl(url = '') {
        return url.startsWith("https://");
    }
    static isWebhookAlive(webhookUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First check if the URL format is valid
                if (!this.isValidWebhookUrl(webhookUrl)) {
                    throw new Error("Invalid webhook URL format");
                }
                // Test the webhook with a GET request (Discord allows GET on webhooks)
                const response = yield fetch(webhookUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                // Discord returns 200 for valid webhooks
                return response.status === 200;
            }
            catch (error) {
                return false;
            }
        });
    }
    static testWebhook(webhookUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!webhookUrl) {
                    return {
                        isValid: false,
                        message: "Please enter a webhook URL",
                    };
                }
                if (!this.isValidWebhookUrl(webhookUrl)) {
                    return {
                        isValid: false,
                        message: "Invalid Discord webhook URL format",
                    };
                }
                const isAlive = yield this.isWebhookAlive(webhookUrl);
                return {
                    isValid: isAlive,
                    message: isAlive
                        ? "Webhook is valid and working!"
                        : "Webhook is not responding or has been deleted",
                };
            }
            catch (error) {
                return {
                    isValid: false,
                    message: "Error testing webhook connection",
                };
            }
        });
    }
}
class DiscordTracking {
    constructor(kxsClient, webhookUrl) {
        this.kxsClient = kxsClient;
        this.webhookUrl = webhookUrl;
    }
    setWebhookUrl(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
    validateCurrentWebhook() {
        return __awaiter(this, void 0, void 0, function* () {
            return WebhookValidator.isWebhookAlive(this.webhookUrl);
        });
    }
    sendWebhookMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!WebhookValidator.isValidWebhookUrl(this.webhookUrl)) {
                return;
            }
            this.kxsClient.nm.showNotification("Sending Discord message...", "info", 2300);
            try {
                const response = yield fetch(this.webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(message),
                });
                if (!response.ok) {
                    throw new Error(`Discord Webhook Error: ${response.status}`);
                }
            }
            catch (error) {
                this.kxsClient.logger.error("Error sending Discord message:", error);
            }
        });
    }
    getEmbedColor(isWin) {
        return isWin ? 0x2ecc71 : 0xe74c3c; // Green for victory, red for defeat
    }
    trackGameEnd(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = result.isWin
                ? "🏆 VICTORY ROYALE!"
                : `${result.position} - Game Over`;
            const embed = {
                title,
                description: `${result.username}'s Match`,
                color: this.getEmbedColor(result.isWin),
                fields: [
                    {
                        name: "💀 Eliminations",
                        value: result.kills.toString(),
                        inline: true,
                    },
                ],
            };
            if (result.duration) {
                embed.fields.push({
                    name: "⏱️ Duration",
                    value: result.duration,
                    inline: true,
                });
            }
            if (result.damageDealt) {
                embed.fields.push({
                    name: "💥 Damage Dealt",
                    value: Math.round(result.damageDealt).toString(),
                    inline: true,
                });
            }
            if (result.damageTaken) {
                embed.fields.push({
                    name: "💢 Damage Taken",
                    value: Math.round(result.damageTaken).toString(),
                    inline: true,
                });
            }
            if (result.username) {
                embed.fields.push({
                    name: "📝 Username",
                    value: result.username,
                    inline: true,
                });
            }
            if (result.stuff) {
                for (const [key, value] of Object.entries(result.stuff)) {
                    if (value) {
                        embed.fields.push({
                            name: `${stuff_emojis[key]} ${key.replace("_", " ").toUpperCase()}`,
                            value,
                            inline: true,
                        });
                    }
                }
            }
            const message = {
                username: "DualityClient",
                avatar_url: kxs_logo,
                content: result.isWin ? "🎉 New Victory!" : "Match Ended",
                embeds: [embed],
            };
            yield this.sendWebhookMessage(message);
        });
    }
}


;// ./src/FUNC/StatsParser.ts
class StatsParser {
    static cleanNumber(str) {
        return parseInt(str.replace(/[^\d.-]/g, "")) || 0;
    }
    /**
     * Extract the full duration string including the unit
     */
    static extractDuration(str) {
        const match = str.match(/(\d+\s*[smh])/i);
        return match ? match[1].trim() : "0s";
    }
    static parse(statsText, rankContent) {
        let stats = {
            username: "Player",
            kills: 0,
            damageDealt: 0,
            damageTaken: 0,
            duration: "",
            position: "#unknown",
        };
        // Handle developer format
        const devPattern = /Developer.*?Kills(\d+).*?Damage Dealt(\d+).*?Damage Taken(\d+).*?Survived(\d+\s*[smh])/i;
        const devMatch = statsText.match(devPattern);
        if (devMatch) {
            return {
                username: "Player",
                kills: this.cleanNumber(devMatch[1]),
                damageDealt: this.cleanNumber(devMatch[2]),
                damageTaken: this.cleanNumber(devMatch[3]),
                duration: devMatch[4].trim(), // Keep the full duration string with unit
                position: rankContent.replace("##", "#"),
            };
        }
        // Handle template format
        const templatePattern = /%username%.*?Kills%kills_number%.*?Dealt%number_dealt%.*?Taken%damage_taken%.*?Survived%duration%/;
        const templateMatch = statsText.match(templatePattern);
        if (templateMatch) {
            const parts = statsText.split(/Kills|Dealt|Taken|Survived/);
            if (parts.length >= 5) {
                return {
                    username: parts[0].trim(),
                    kills: this.cleanNumber(parts[1]),
                    damageDealt: this.cleanNumber(parts[2]),
                    damageTaken: this.cleanNumber(parts[3]),
                    duration: this.extractDuration(parts[4]), // Extract full duration with unit
                    position: rankContent.replace("##", "#"),
                };
            }
        }
        // Generic parsing as fallback
        const usernameMatch = statsText.match(/^([^0-9]+)/);
        if (usernameMatch) {
            stats.username = usernameMatch[1].trim();
        }
        const killsMatch = statsText.match(/Kills[^0-9]*(\d+)/i);
        if (killsMatch) {
            stats.kills = this.cleanNumber(killsMatch[1]);
        }
        const dealtMatch = statsText.match(/Dealt[^0-9]*(\d+)/i);
        if (dealtMatch) {
            stats.damageDealt = this.cleanNumber(dealtMatch[1]);
        }
        const takenMatch = statsText.match(/Taken[^0-9]*(\d+)/i);
        if (takenMatch) {
            stats.damageTaken = this.cleanNumber(takenMatch[1]);
        }
        // Extract survival time with unit
        const survivalMatch = statsText.match(/Survived[^0-9]*(\d+\s*[smh])/i);
        if (survivalMatch) {
            stats.duration = survivalMatch[1].trim();
        }
        stats.position = rankContent.replace("##", "#");
        return stats;
    }
}


// EXTERNAL MODULE: ./node_modules/semver/functions/gt.js
var gt = __webpack_require__(580);
var gt_default = /*#__PURE__*/__webpack_require__.n(gt);
;// ./package.json
const package_namespaceObject = {"rE":"2.1.24"};
;// ./src/FUNC/UpdateChecker.ts
var UpdateChecker_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class UpdateChecker {
    constructor(kxsClient) {
        this.remoteScriptUrl = config_namespaceObject.api_url + "/getLatestVersion";
        this.kxsClient = kxsClient;
        if (this.kxsClient.isAutoUpdateEnabled) {
            this.checkForUpdate();
        }
    }
    copyScriptToClipboard() {
        return UpdateChecker_awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.remoteScriptUrl, {
                    method: "GET",
                    headers: {
                        "cache-control": "no-cache, no-store, must-revalidate",
                        "pragma": "no-cache",
                        "expires": "0"
                    }
                });
                if (!response.ok) {
                    throw new Error("Error retrieving script: " + response.statusText);
                }
                const scriptContent = yield response.text();
                yield navigator.clipboard.writeText(scriptContent);
                this.kxsClient.nm.showNotification("Script copied to clipboard!", "success", 2300);
            }
            catch (error) {
                throw new Error("Error copying script to clipboard: " + error);
            }
        });
    }
    getNewScriptVersion() {
        return UpdateChecker_awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.remoteScriptUrl, {
                    method: "GET",
                    headers: {
                        "cache-control": "no-cache, no-store, must-revalidate",
                        "pragma": "no-cache",
                        "expires": "0"
                    }
                });
                if (!response.ok) {
                    throw new Error("Error retrieving remote script: " + response.statusText);
                }
                const scriptContent = yield response.text();
                const versionMatch = scriptContent.match(/\/\/\s*@version\s+([\d.]+)/);
                if (versionMatch && versionMatch[1]) {
                    return versionMatch[1];
                }
                else {
                    throw new Error("Script version was not found in the file.");
                }
            }
            catch (error) {
                throw new Error("Error retrieving remote script: " + error);
            }
        });
    }
    checkForUpdate() {
        return UpdateChecker_awaiter(this, void 0, void 0, function* () {
            const localScriptVersion = yield this.getCurrentScriptVersion();
            const hostedScriptVersion = yield this.getNewScriptVersion();
            this.hostedScriptVersion = hostedScriptVersion;
            // Vérifie si la version hébergée est supérieure à la version locale
            if (gt_default()(hostedScriptVersion, localScriptVersion)) {
                this.displayUpdateNotification();
            }
            else {
                this.kxsClient.nm.showNotification("Client is up to date", "success", 2300);
            }
        });
    }
    displayUpdateNotification() {
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.backgroundColor = "rgb(250, 250, 250)";
        modal.style.borderRadius = "10px";
        modal.style.padding = "20px";
        modal.style.width = "500px";
        modal.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
        modal.style.border = "1px solid rgb(229, 229, 229)";
        modal.style.zIndex = "10000";
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.marginBottom = "15px";
        const title = document.createElement("h3");
        title.textContent = "Update Available";
        title.style.margin = "0";
        title.style.fontSize = "18px";
        title.style.fontWeight = "600";
        header.appendChild(title);
        const closeButton = document.createElement("button");
        closeButton.innerHTML = "×";
        closeButton.style.marginLeft = "auto";
        closeButton.style.border = "none";
        closeButton.style.background = "none";
        closeButton.style.fontSize = "24px";
        closeButton.style.cursor = "pointer";
        closeButton.style.padding = "0 5px";
        closeButton.onclick = () => modal.remove();
        header.appendChild(closeButton);
        const content = document.createElement("div");
        content.innerHTML = `<div style="margin-bottom: 20px;">
			<p style="margin-bottom: 10px; font-weight: 500;">A new version of KxsClient is available!</p>
			<p style="margin-bottom: 10px;">
				Current version: <span style="font-weight: 500;">${this.getCurrentScriptVersion()}</span> |
				New version: <span style="font-weight: 500; color: #4f46e5;">${this.hostedScriptVersion}</span>
			</p>
			<p style="margin-bottom: 15px;">To update, follow these steps:</p>
			<ol style="margin-left: 20px; margin-bottom: 15px;">
				<li style="margin-bottom: 8px;">Click "Copy Script" below</li>
				<li style="margin-bottom: 8px;">Open your script manager (Tampermonkey, Violentmonkey, etc.)</li>
				<li style="margin-bottom: 8px;">Overwrite the current script with the new one and paste the content</li>
				<li style="margin-bottom: 8px;">Save the script (Ctrl+S or Cmd+S)</li>
				<li>Reload the game page</li>
			</ol>
		</div>`;
        content.style.color = "rgb(75, 85, 99)";
        content.style.fontSize = "14px";
        content.style.lineHeight = "1.5";
        const updateButton = document.createElement("button");
        updateButton.textContent = "Copy Script";
        updateButton.style.backgroundColor = "rgb(79, 70, 229)";
        updateButton.style.color = "white";
        updateButton.style.padding = "10px 16px";
        updateButton.style.borderRadius = "6px";
        updateButton.style.border = "none";
        updateButton.style.cursor = "pointer";
        updateButton.style.width = "100%";
        updateButton.style.fontWeight = "500";
        updateButton.style.fontSize = "15px";
        updateButton.style.transition = "background-color 0.2s ease";
        updateButton.onmouseover = () => updateButton.style.backgroundColor = "rgb(67, 56, 202)";
        updateButton.onmouseout = () => updateButton.style.backgroundColor = "rgb(79, 70, 229)";
        updateButton.onclick = () => UpdateChecker_awaiter(this, void 0, void 0, function* () {
            try {
                yield this.copyScriptToClipboard();
                updateButton.textContent = "Script copied!";
                updateButton.style.backgroundColor = "rgb(16, 185, 129)";
                setTimeout(() => {
                    if (updateButton.isConnected) {
                        updateButton.textContent = "Copy Script";
                        updateButton.style.backgroundColor = "rgb(79, 70, 229)";
                    }
                }, 3000);
            }
            catch (error) {
                this.kxsClient.nm.showNotification("Error: " + error.message, "error", 5000);
            }
        });
        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(updateButton);
        document.body.appendChild(modal);
    }
    getCurrentScriptVersion() {
        return package_namespaceObject.rE;
    }
}


;// ./src/SERVER/DiscordRichPresence.ts

class DiscordWebSocket {
    constructor(kxsClient, token) {
        this.ws = null;
        this.heartbeatInterval = 0;
        this.sequence = null;
        this.isAuthenticated = false;
        this.kxsClient = kxsClient;
    }
    connect() {
        if (this.kxsClient.discordToken === ""
            || this.kxsClient.discordToken === null
            || this.kxsClient.discordToken === undefined) {
            return;
        }
        this.ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
        this.ws.onopen = () => { };
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
        this.ws.onerror = (error) => { };
        this.ws.onclose = () => {
            clearInterval(this.heartbeatInterval);
            this.isAuthenticated = false;
        };
    }
    identify() {
        const payload = {
            op: 2,
            d: {
                token: this.kxsClient.discordToken,
                properties: {
                    $os: 'linux',
                    $browser: 'chrome',
                    $device: 'chrome'
                },
                presence: {
                    activities: [{
                            name: "DualityClient",
                            type: 0,
                            application_id: "1321193265533550602",
                            assets: {
                                large_image: "mp:app-icons/1321193265533550602/bccd2479ec56ed7d4e69fa2fdfb47197.png?size=512",
                                large_text: "DualityClient v" + package_namespaceObject.rE,
                            }
                        }],
                    status: 'online',
                    afk: false
                }
            }
        };
        this.send(payload);
    }
    handleMessage(data) {
        switch (data.op) {
            case 10: // Hello
                const { heartbeat_interval } = data.d;
                this.startHeartbeat(heartbeat_interval);
                this.identify();
                break;
            case 11: // Heartbeat ACK
                this.kxsClient.logger.log('[RichPresence] Heartbeat acknowledged');
                break;
            case 0: // Dispatch
                this.sequence = data.s;
                if (data.t === 'READY') {
                    this.isAuthenticated = true;
                    this.kxsClient.nm.showNotification('Started Discord RPC', 'success', 3000);
                }
                break;
        }
    }
    startHeartbeat(interval) {
        this.heartbeatInterval = setInterval(() => {
            this.send({
                op: 1,
                d: this.sequence
            });
        }, interval);
    }
    send(data) {
        var _a;
        if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
    disconnect() {
        if (this.ws) {
            clearInterval(this.heartbeatInterval);
            this.ws.close();
        }
    }
}


;// ./src/HUD/MOD/NotificationManager.ts
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.NOTIFICATION_HEIGHT = 65; // Height + margin
        this.NOTIFICATION_MARGIN = 10;
        this.addGlobalStyles();
    }
    static getInstance() {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }
    addGlobalStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
        @keyframes slideIn {
          0% { transform: translateX(-120%); opacity: 0; }
          50% { transform: translateX(10px); opacity: 0.8; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
          0% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(10px); opacity: 0.8; }
          100% { transform: translateX(-120%); opacity: 0; }
        }

        @keyframes slideLeft {
          from { transform-origin: right; transform: scaleX(1); }
          to { transform-origin: right; transform: scaleX(0); }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `;
        document.head.appendChild(styleSheet);
    }
    updateNotificationPositions() {
        this.notifications.forEach((notification, index) => {
            const topPosition = 20 + (index * this.NOTIFICATION_HEIGHT);
            notification.style.top = `${topPosition}px`;
        });
    }
    removeNotification(notification) {
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
            this.notifications.splice(index, 1);
            this.updateNotificationPositions();
        }
    }
    getIconConfig(type) {
        const configs = {
            success: {
                color: '#4CAF50',
                svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>`
            },
            error: {
                color: '#F44336',
                svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                </svg>`
            },
            info: {
                color: '#FFD700',
                svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>`
            }
        };
        return configs[type];
    }
    showNotification(message, type, duration = 5000) {
        const notification = document.createElement("div");
        // Base styles
        Object.assign(notification.style, {
            position: "fixed",
            top: "20px",
            left: "20px",
            padding: "12px 20px",
            backgroundColor: "#333333",
            color: "white",
            zIndex: "9999",
            minWidth: "200px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transform: "translateX(-120%)",
            opacity: "0",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        });
        // Create icon
        const icon = document.createElement("div");
        Object.assign(icon.style, {
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "bounce 0.5s ease-in-out"
        });
        const iconConfig = this.getIconConfig(type);
        icon.style.color = iconConfig.color;
        icon.innerHTML = iconConfig.svg;
        // Create message
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.flex = "1";
        // Create progress bar
        const progressBar = document.createElement("div");
        Object.assign(progressBar.style, {
            height: "4px",
            backgroundColor: "#e6f3ff",
            width: "100%",
            position: "absolute",
            bottom: "0",
            left: "0",
            animation: `slideLeft ${duration}ms linear forwards`
        });
        // Assemble notification
        notification.appendChild(icon);
        notification.appendChild(messageDiv);
        notification.appendChild(progressBar);
        document.body.appendChild(notification);
        // Add to stack and update positions
        this.notifications.push(notification);
        this.updateNotificationPositions();
        // Entrance animation
        requestAnimationFrame(() => {
            notification.style.transition = "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            notification.style.animation = "slideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards";
        });
        // Exit animation and cleanup
        setTimeout(() => {
            notification.style.animation = "slideOut 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards";
            setTimeout(() => {
                this.removeNotification(notification);
                notification.remove();
            }, 500);
        }, duration);
    }
}


;// ./src/HUD/ClientSecondaryMenu.ts


const category = ["ALL", "HUD", "SERVER", "MECHANIC", "MISC"];
class KxsClientSecondaryMenu {
    constructor(kxsClient) {
        this.searchTerm = '';
        // Fonction pour fermer un sous-menu
        this.closeSubMenu = () => { };
        this.shiftListener = (event) => {
            if (event.key === "Shift" && event.location == 2) {
                this.clearMenu();
                this.toggleMenuVisibility();
                // Ensure options are displayed after loading
                this.filterOptions();
            }
        };
        this.mouseMoveListener = (e) => {
            if (this.isDragging) {
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;
                this.menu.style.transform = 'none';
                this.menu.style.left = `${x}px`;
                this.menu.style.top = `${y}px`;
            }
        };
        this.mouseUpListener = () => {
            this.isDragging = false;
            this.menu.style.cursor = "grab";
        };
        this.kxsClient = kxsClient;
        this.isClientMenuVisible = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.sections = [];
        this.allOptions = [];
        this.activeCategory = "ALL";
        this.isOpen = false;
        this.menu = document.createElement("div");
        this.initMenu();
        this.addShiftListener();
        this.addDragListeners();
        this.loadOption();
    }
    initMenu() {
        this.menu.id = "kxsClientMenu";
        this.applyMenuStyles();
        this.createHeader();
        this.createGridContainer();
        document.body.appendChild(this.menu);
        this.menu.style.display = "none";
        // Empêcher la propagation des événements souris (clics et molette) vers la page web
        // Utiliser la phase de bouillonnement (bubbling) au lieu de la phase de capture
        // pour permettre aux éléments enfants de recevoir les événements d'abord
        this.menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        this.menu.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });
        // Nous ne gérons pas mousedown et mouseup ici car ils sont gérés dans addDragListeners()
    }
    applyMenuStyles() {
        // Styles par défaut (desktop/tablette)
        const defaultStyles = {
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
            zIndex: "10001",
            width: "800px",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: "#fff",
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden", // Prevent horizontal scrolling
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "none",
            boxSizing: "border-box", // Include padding in width calculation
        };
        // Styles réduits pour mobile
        const mobileStyles = {
            padding: "6px",
            borderRadius: "7px",
            width: "78vw",
            maxWidth: "84vw",
            fontSize: "10px",
            maxHeight: "60vh",
            top: "4%",
            left: "50%",
        };
        Object.assign(this.menu.style, defaultStyles);
        if (this.kxsClient.isMobile && this.kxsClient.isMobile()) {
            Object.assign(this.menu.style, mobileStyles);
        }
    }
    blockMousePropagation(element, preventDefault = true) {
        ['click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'wheel'].forEach(eventType => {
            element.addEventListener(eventType, (e) => {
                e.stopPropagation();
                if (preventDefault && (eventType === 'contextmenu' || eventType === 'wheel' || element.tagName !== 'INPUT')) {
                    e.preventDefault();
                }
            }, false);
        });
    }
    createHeader() {
        const header = document.createElement("div");
        // Détection mobile pour styles réduits
        const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
        const logoSize = isMobile ? 20 : 30;
        const titleFontSize = isMobile ? 12 : 20;
        const headerGap = isMobile ? 4 : 10;
        const headerMarginBottom = isMobile ? 8 : 20;
        const closeBtnPadding = isMobile ? 2 : 6;
        const closeBtnFontSize = isMobile ? 12 : 18;
        header.style.marginBottom = `${headerMarginBottom}px`;
        header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${isMobile ? 7 : 15}px; width: 100%; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: ${headerGap}px;">
                <img src="${kxs_logo}"
                    alt="Logo" style="width: ${logoSize}px; height: ${logoSize}px;">
                <span style="font-size: ${titleFontSize}px; font-weight: bold;">DUALITY CLIENT <span style="
                 font-size: ${isMobile ? 10 : 14}px;
                 font-weight: 700;
                 color: #3B82F6;
                 opacity: 0.95;
                 position: relative;
                 top: ${isMobile ? -1 : -2}px;
                 margin-left: ${isMobile ? 2 : 3}px;
                 letter-spacing: 0.5px;
               ">v${package_namespaceObject.rE}</span></span>
            </div>
            <div style="display: flex; gap: ${headerGap}px;">
              <button style="
                padding: ${closeBtnPadding}px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: ${closeBtnFontSize}px;
              ">×</button>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px; width: 100%; box-sizing: border-box;">
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 5px;">
              ${category.map(cat => `
                <button class="category-btn" data-category="${cat}" style="
                  padding: ${isMobile ? '2px 6px' : '6px 16px'};
                  background: ${this.activeCategory === cat ? '#3B82F6' : 'rgba(55, 65, 81, 0.8)'};
                  border: none;
                  border-radius: ${isMobile ? '3px' : '6px'};
                  color: white;
                  cursor: pointer;
                  font-size: ${isMobile ? '9px' : '14px'};
                  transition: background 0.2s;
                ">${cat}</button>
              `).join('')}
            </div>
            <div style="display: flex; width: 100%; box-sizing: border-box;">
              <div style="position: relative; width: 100%; box-sizing: border-box;">
                <input type="text" id="kxsSearchInput" placeholder="Search options..." style="
                  width: 100%;
                  padding: ${isMobile ? '3px 5px 3px 20px' : '8px 12px 8px 32px'};
                  background: rgba(55, 65, 81, 0.8);
                  border: none;
                  border-radius: ${isMobile ? '3px' : '6px'};
                  color: white;
                  font-size: ${isMobile ? '9px' : '14px'};
                  outline: none;
                  box-sizing: border-box;
                ">
                <div style="
                  position: absolute;
                  left: ${isMobile ? '4px' : '10px'};
                  top: 50%;
                  transform: translateY(-50%);
                  width: ${isMobile ? '9px' : '14px'};
                  height: ${isMobile ? '9px' : '14px'};
                ">
                  <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        `;
        header.querySelectorAll('.category-btn').forEach(btn => {
            this.blockMousePropagation(btn);
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                if (category) {
                    this.setActiveCategory(category);
                }
            });
        });
        const closeButton = header.querySelector('button');
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', () => {
            this.toggleMenuVisibility();
        });
        const searchInput = header.querySelector('#kxsSearchInput');
        if (searchInput) {
            this.blockMousePropagation(searchInput, false);
            // Gestionnaire pour mettre à jour la recherche
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterOptions();
            });
            // Prevent keys from being interpreted by the game
            // We only block the propagation of keyboard events, except for special keys
            ['keydown', 'keyup', 'keypress'].forEach(eventType => {
                searchInput.addEventListener(eventType, (e) => {
                    const keyEvent = e;
                    // Don't block special keys (Escape, Shift)
                    if (keyEvent.key === 'Escape' || (keyEvent.key === 'Shift' && keyEvent.location === 2)) {
                        return; // Let the event propagate normally
                    }
                    // Block propagation for all other keys
                    e.stopPropagation();
                });
            });
            // Éviter que la barre de recherche ne reprenne automatiquement le focus
            // lorsque l'utilisateur interagit avec un autre champ de texte
            searchInput.addEventListener('blur', (e) => {
                // Ne pas reprendre le focus si l'utilisateur clique sur un autre input
                const newFocusElement = e.relatedTarget;
                if (newFocusElement && (newFocusElement.tagName === 'INPUT' || newFocusElement.tagName === 'TEXTAREA')) {
                    // L'utilisateur a cliqué sur un autre champ de texte, ne pas reprendre le focus
                    return;
                }
                // Pour les autres cas, seulement si aucun autre élément n'a le focus
                setTimeout(() => {
                    const activeElement = document.activeElement;
                    if (this.isClientMenuVisible &&
                        activeElement &&
                        activeElement !== searchInput &&
                        activeElement.tagName !== 'INPUT' &&
                        activeElement.tagName !== 'TEXTAREA') {
                        searchInput.focus();
                    }
                }, 100);
            });
        }
        this.menu.appendChild(header);
    }
    clearMenu() {
        const gridContainer = document.getElementById('kxsMenuGrid');
        if (gridContainer) {
            gridContainer.innerHTML = '';
        }
        // Reset search term when clearing menu
        this.searchTerm = '';
        const searchInput = document.getElementById('kxsSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
    }
    loadOption() {
        // Clear existing options to avoid duplicates
        this.allOptions = [];
        let HUD = this.addSection("HUD", 'HUD');
        let MECHANIC = this.addSection("MECHANIC", 'MECHANIC');
        let SERVER = this.addSection("SERVER", 'SERVER');
        let MISC = this.addSection("MISC", 'MISC');
        this.addOption(SERVER, {
            label: "Kxs Network",
            value: true,
            category: "SERVER",
            type: "sub",
            icon: '<svg fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>network</title> <path d="M27 21.75c-0.795 0.004-1.538 0.229-2.169 0.616l0.018-0.010-2.694-2.449c0.724-1.105 1.154-2.459 1.154-3.913 0-1.572-0.503-3.027-1.358-4.212l0.015 0.021 3.062-3.062c0.57 0.316 1.249 0.503 1.971 0.508h0.002c2.347 0 4.25-1.903 4.25-4.25s-1.903-4.25-4.25-4.25c-2.347 0-4.25 1.903-4.25 4.25v0c0.005 0.724 0.193 1.403 0.519 1.995l-0.011-0.022-3.062 3.062c-1.147-0.84-2.587-1.344-4.144-1.344-0.868 0-1.699 0.157-2.467 0.443l0.049-0.016-0.644-1.17c0.726-0.757 1.173-1.787 1.173-2.921 0-2.332-1.891-4.223-4.223-4.223s-4.223 1.891-4.223 4.223c0 2.332 1.891 4.223 4.223 4.223 0.306 0 0.605-0.033 0.893-0.095l-0.028 0.005 0.642 1.166c-1.685 1.315-2.758 3.345-2.758 5.627 0 0.605 0.076 1.193 0.218 1.754l-0.011-0.049-0.667 0.283c-0.78-0.904-1.927-1.474-3.207-1.474-2.334 0-4.226 1.892-4.226 4.226s1.892 4.226 4.226 4.226c2.334 0 4.226-1.892 4.226-4.226 0-0.008-0-0.017-0-0.025v0.001c-0.008-0.159-0.023-0.307-0.046-0.451l0.003 0.024 0.667-0.283c1.303 2.026 3.547 3.349 6.1 3.349 1.703 0 3.268-0.589 4.503-1.574l-0.015 0.011 2.702 2.455c-0.258 0.526-0.41 1.144-0.414 1.797v0.001c0 2.347 1.903 4.25 4.25 4.25s4.25-1.903 4.25-4.25c0-2.347-1.903-4.25-4.25-4.25v0zM8.19 5c0-0.966 0.784-1.75 1.75-1.75s1.75 0.784 1.75 1.75c0 0.966-0.784 1.75-1.75 1.75v0c-0.966-0.001-1.749-0.784-1.75-1.75v-0zM5 22.42c-0.966-0.001-1.748-0.783-1.748-1.749s0.783-1.749 1.749-1.749c0.966 0 1.748 0.782 1.749 1.748v0c-0.001 0.966-0.784 1.749-1.75 1.75h-0zM27 3.25c0.966 0 1.75 0.784 1.75 1.75s-0.784 1.75-1.75 1.75c-0.966 0-1.75-0.784-1.75-1.75v0c0.001-0.966 0.784-1.749 1.75-1.75h0zM11.19 16c0-0.001 0-0.002 0-0.003 0-2.655 2.152-4.807 4.807-4.807 1.328 0 2.53 0.539 3.4 1.409l0.001 0.001 0.001 0.001c0.87 0.87 1.407 2.072 1.407 3.399 0 2.656-2.153 4.808-4.808 4.808s-4.808-2.153-4.808-4.808c0-0 0-0 0-0v0zM27 27.75c-0.966 0-1.75-0.784-1.75-1.75s0.784-1.75 1.75-1.75c0.966 0 1.75 0.784 1.75 1.75v0c-0.001 0.966-0.784 1.749-1.75 1.75h-0z"></path> </g></svg>',
            fields: [
                {
                    label: "Spoof Nickname",
                    category: "SERVER",
                    icon: '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>hacker-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="Q3_icons" data-name="Q3 icons"> <g> <path d="M24,30a60.3,60.3,0,0,1-13-1.3L7,27.6V40.2a1.9,1.9,0,0,0,1.5,1.9l12,2.9a2.4,2.4,0,0,0,2.1-.8L24,42.5l1.4,1.7A2.1,2.1,0,0,0,27,45h.5l12-2.9A1.9,1.9,0,0,0,41,40.2V27.6l-4,1.1A60.3,60.3,0,0,1,24,30Zm-7,8c-2,0-4-1.9-4-3s2-1,4-1,4,.9,4,2S19,38,17,38Zm14,0c-2,0-4-.9-4-2s2-2,4-2,4-.1,4,1S33,38,31,38Z"></path> <path d="M39.4,16,37.3,6.2A4,4,0,0,0,33.4,3H29.1a3.9,3.9,0,0,0-3.4,1.9L24,7.8,22.3,4.9A3.9,3.9,0,0,0,18.9,3H14.6a4,4,0,0,0-3.9,3.2L8.6,16C4.5,17.3,2,19,2,21c0,3.9,9.8,7,22,7s22-3.1,22-7C46,19,43.5,17.3,39.4,16Z"></path> </g> </g> </g> </g></svg>',
                    type: "toggle",
                    value: this.kxsClient.kxsNetworkSettings.nickname_anonymized,
                    onChange: () => {
                        this.kxsClient.kxsNetworkSettings.nickname_anonymized = !this.kxsClient.kxsNetworkSettings.nickname_anonymized;
                        this.kxsClient.updateLocalStorage();
                    }
                },
                {
                    label: "Voice Chat",
                    value: this.kxsClient.isVoiceChatEnabled,
                    icon: '<svg fill="#000000" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style> .cls-1 { fill: none; } </style> </defs> <path d="M26,30H24V27H20a5.0055,5.0055,0,0,1-5-5V20.7207l-2.3162-.772a1,1,0,0,1-.5412-1.4631L15,13.7229V11a9.01,9.01,0,0,1,9-9h5V4H24a7.0078,7.0078,0,0,0-7,7v3a.9991.9991,0,0,1-.1426.5144l-2.3586,3.9312,1.8174.6057A1,1,0,0,1,17,20v2a3.0033,3.0033,0,0,0,3,3h5a1,1,0,0,1,1,1Z"></path> <rect x="19" y="12" width="4" height="2"></rect> <path d="M9.3325,25.2168a7.0007,7.0007,0,0,1,0-10.4341l1.334,1.49a5,5,0,0,0,0,7.4537Z"></path> <path d="M6.3994,28.8008a11.0019,11.0019,0,0,1,0-17.6006L7.6,12.8a9.0009,9.0009,0,0,0,0,14.4014Z"></path> <rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="cls-1" width="32" height="32"></rect> </g></svg>',
                    category: "SERVER",
                    type: "toggle",
                    onChange: () => {
                        this.kxsClient.isVoiceChatEnabled = !this.kxsClient.isVoiceChatEnabled;
                        this.kxsClient.updateLocalStorage();
                        this.kxsClient.voiceChat.toggleVoiceChat();
                    },
                },
                {
                    label: "Chat",
                    value: this.kxsClient.isKxsChatEnabled,
                    icon: '<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M232.727,238.545v186.182H281.6l-13.964,69.818l97.745-69.818H512V238.545H232.727z M477.091,389.818H365.382h-11.187 l-9.103,6.502l-25.912,18.508l5.003-25.01H281.6h-13.964V273.455h209.455V389.818z"></path> </g> </g> <g> <g> <path d="M279.273,17.455H0v186.182h65.164l97.745,69.818l-13.964-69.818h130.327V17.455z M244.364,168.727h-95.418h-42.582 l5.003,25.01L85.455,175.23l-9.104-6.502H65.164H34.909V52.364h209.455V168.727z"></path> </g> </g> <g> <g> <rect x="180.364" y="93.091" width="34.909" height="34.909"></rect> </g> </g> <g> <g> <rect x="122.182" y="93.091" width="34.909" height="34.909"></rect> </g> </g> <g> <g> <rect x="64" y="93.091" width="34.909" height="34.909"></rect> </g> </g> <g> <g> <rect x="413.091" y="314.182" width="34.909" height="34.909"></rect> </g> </g> <g> <g> <rect x="354.909" y="314.182" width="34.909" height="34.909"></rect> </g> </g> <g> <g> <rect x="296.727" y="314.182" width="34.909" height="34.909"></rect> </g> </g> </g></svg>',
                    category: "SERVER",
                    type: "toggle",
                    onChange: () => {
                        this.kxsClient.isKxsChatEnabled = !this.kxsClient.isKxsChatEnabled;
                        this.kxsClient.updateLocalStorage();
                        this.kxsClient.chat.toggleChat();
                    },
                }
            ],
        });
        this.addOption(MISC, {
            label: "Game History",
            value: true,
            category: "MISC",
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.52786 16.7023C6.6602 18.2608 8.3169 19.3584 10.1936 19.7934C12.0703 20.2284 14.0409 19.9716 15.7434 19.0701C17.446 18.1687 18.766 16.6832 19.4611 14.8865C20.1562 13.0898 20.1796 11.1027 19.527 9.29011C18.8745 7.47756 17.5898 5.96135 15.909 5.02005C14.2282 4.07875 12.2641 3.77558 10.3777 4.16623C8.49129 4.55689 6.80919 5.61514 5.64045 7.14656C4.47171 8.67797 3.89482 10.5797 4.01579 12.5023M4.01579 12.5023L2.51579 11.0023M4.01579 12.5023L5.51579 11.0023" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 8V12L15 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
            type: "click",
            onChange: () => {
                this.kxsClient.historyManager.show();
            }
        });
        this.addOption(MECHANIC, {
            label: "Win sound",
            value: true,
            type: "sub",
            icon: '<svg fill="#000000" version="1.1" id="Trophy_x5F_cup" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M190.878,111.272c31.017-11.186,53.254-40.907,53.254-75.733l-0.19-8.509h-48.955V5H64.222v22.03H15.266l-0.19,8.509 c0,34.825,22.237,64.546,53.254,75.733c7.306,18.421,22.798,31.822,41.878,37.728v20c-0.859,15.668-14.112,29-30,29v18h-16v35H195 v-35h-16v-18c-15.888,0-29.141-13.332-30-29v-20C168.08,143.094,183.572,129.692,190.878,111.272z M195,44h30.563 c-0.06,0.427-0.103,1.017-0.171,1.441c-3.02,18.856-14.543,34.681-30.406,44.007C195.026,88.509,195,44,195,44z M33.816,45.441 c-0.068-0.424-0.111-1.014-0.171-1.441h30.563c0,0-0.026,44.509,0.013,45.448C48.359,80.122,36.837,64.297,33.816,45.441z M129.604,86.777l-20.255,13.52l6.599-23.442L96.831,61.77l24.334-0.967l8.44-22.844l8.44,22.844l24.334,0.967L143.26,76.856 l6.599,23.442L129.604,86.777z"></path> </g></svg>',
            category: "MECHANIC",
            fields: [
                {
                    label: "Enable",
                    value: this.kxsClient.isWinSoundEnabled,
                    category: "MECHANIC",
                    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 11V13M6 10V14M9 11V13M12 9V15M15 6V18M18 10V14M21 11V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
                    type: "toggle",
                    onChange: () => {
                        this.kxsClient.isWinSoundEnabled = !this.kxsClient.isWinSoundEnabled;
                        this.kxsClient.updateLocalStorage();
                    },
                },
                {
                    label: "Sound URL",
                    value: this.kxsClient.soundLibrary.win_sound_url,
                    category: "MECHANIC",
                    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 11V13M6 10V14M9 11V13M12 9V15M15 6V18M18 10V14M21 11V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
                    type: "input",
                    placeholder: "URL of a sound",
                    onChange: (value) => {
                        this.kxsClient.soundLibrary.win_sound_url = value;
                        this.kxsClient.updateLocalStorage();
                    }
                }
            ]
        });
        this.addOption(MECHANIC, {
            label: "Death sound",
            value: true,
            type: "sub",
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19 21C19 21.5523 18.5523 22 18 22H14H10H6C5.44771 22 5 21.5523 5 21V18.75C5 17.7835 4.2165 17 3.25 17C2.55964 17 2 16.4404 2 15.75V11C2 5.47715 6.47715 1 12 1C17.5228 1 22 5.47715 22 11V15.75C22 16.4404 21.4404 17 20.75 17C19.7835 17 19 17.7835 19 18.75V21ZM17 20V18.75C17 16.9358 18.2883 15.4225 20 15.075V11C20 6.58172 16.4183 3 12 3C7.58172 3 4 6.58172 4 11V15.075C5.71168 15.4225 7 16.9358 7 18.75V20H9V18C9 17.4477 9.44771 17 10 17C10.5523 17 11 17.4477 11 18V20H13V18C13 17.4477 13.4477 17 14 17C14.5523 17 15 17.4477 15 18V20H17ZM11 12.5C11 13.8807 8.63228 15 7.25248 15C5.98469 15 5.99206 14.055 6.00161 12.8306V12.8305C6.00245 12.7224 6.00331 12.6121 6.00331 12.5C6.00331 11.1193 7.12186 10 8.50166 10C9.88145 10 11 11.1193 11 12.5ZM17.9984 12.8306C17.9975 12.7224 17.9967 12.6121 17.9967 12.5C17.9967 11.1193 16.8781 10 15.4983 10C14.1185 10 13 11.1193 13 12.5C13 13.8807 15.3677 15 16.7475 15C18.0153 15 18.0079 14.055 17.9984 12.8306Z" fill="#000000"></path> </g></svg>',
            category: "MECHANIC",
            fields: [
                {
                    label: "Enable",
                    value: this.kxsClient.isDeathSoundEnabled,
                    category: "MECHANIC",
                    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 11V13M6 10V14M9 11V13M12 9V15M15 6V18M18 10V14M21 11V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
                    type: "toggle",
                    onChange: () => {
                        this.kxsClient.isDeathSoundEnabled = !this.kxsClient.isDeathSoundEnabled;
                        this.kxsClient.updateLocalStorage();
                    },
                },
                {
                    label: "Sound URL",
                    value: this.kxsClient.soundLibrary.death_sound_url,
                    category: "MECHANIC",
                    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 11V13M6 10V14M9 11V13M12 9V15M15 12V18M15 6V8M18 10V14M21 11V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
                    type: "input",
                    placeholder: "URL of a sound",
                    onChange: (value) => {
                        this.kxsClient.soundLibrary.death_sound_url = value;
                        this.kxsClient.updateLocalStorage();
                    }
                }
            ]
        });
        this.addOption(MECHANIC, {
            label: "Background Music",
            value: this.kxsClient.soundLibrary.background_sound_url,
            type: "input",
            icon: '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 1H4V9H3C1.34315 9 0 10.3431 0 12C0 13.6569 1.34315 15 3 15C4.65685 15 6 13.6569 6 12V5H13V9H12C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V1Z" fill="#000000"></path> </g></svg>',
            category: "MECHANIC",
            placeholder: background_song,
            onChange: (value) => {
                this.kxsClient.soundLibrary.background_sound_url = value;
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(HUD, {
            label: "Clean Main Menu",
            value: this.kxsClient.isMainMenuCleaned,
            category: "HUD",
            icon: '<svg fill="#000000" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style> .cls-1 { fill: none; } </style> </defs> <title>clean</title> <rect x="20" y="18" width="6" height="2" transform="translate(46 38) rotate(-180)"></rect> <rect x="24" y="26" width="6" height="2" transform="translate(54 54) rotate(-180)"></rect> <rect x="22" y="22" width="6" height="2" transform="translate(50 46) rotate(-180)"></rect> <path d="M17.0029,20a4.8952,4.8952,0,0,0-2.4044-4.1729L22,3,20.2691,2,12.6933,15.126A5.6988,5.6988,0,0,0,7.45,16.6289C3.7064,20.24,3.9963,28.6821,4.01,29.04a1,1,0,0,0,1,.96H20.0012a1,1,0,0,0,.6-1.8C17.0615,25.5439,17.0029,20.0537,17.0029,20ZM11.93,16.9971A3.11,3.11,0,0,1,15.0041,20c0,.0381.0019.208.0168.4688L9.1215,17.8452A3.8,3.8,0,0,1,11.93,16.9971ZM15.4494,28A5.2,5.2,0,0,1,14,25H12a6.4993,6.4993,0,0,0,.9684,3H10.7451A16.6166,16.6166,0,0,1,10,24H8a17.3424,17.3424,0,0,0,.6652,4H6c.031-1.8364.29-5.8921,1.8027-8.5527l7.533,3.35A13.0253,13.0253,0,0,0,17.5968,28Z"></path> <rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="cls-1" width="32" height="32"></rect> </g></svg>',
            type: "toggle",
            onChange: (value) => {
                this.kxsClient.isMainMenuCleaned = !this.kxsClient.isMainMenuCleaned;
                this.kxsClient.MainMenuCleaning();
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(HUD, {
            label: "Counters",
            value: true,
            category: "SERVER",
            type: "sub",
            icon: '<svg fill="#000000" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 13.1640 4.6562 L 43.3280 4.6562 C 43.1874 2.6875 42.0624 1.6328 39.9062 1.6328 L 16.5858 1.6328 C 14.4296 1.6328 13.3046 2.6875 13.1640 4.6562 Z M 8.1015 11.1484 L 47.9454 11.1484 C 47.5936 9.0156 46.5625 7.8438 44.2187 7.8438 L 11.8046 7.8438 C 9.4609 7.8438 8.4531 9.0156 8.1015 11.1484 Z M 10.2343 54.3672 L 45.7888 54.3672 C 50.6641 54.3672 53.1251 51.9297 53.1251 47.1016 L 53.1251 22.2109 C 53.1251 17.3828 50.6641 14.9453 45.7888 14.9453 L 10.2343 14.9453 C 5.3358 14.9453 2.8749 17.3594 2.8749 22.2109 L 2.8749 47.1016 C 2.8749 51.9297 5.3358 54.3672 10.2343 54.3672 Z"></path></g></svg>',
            fields: [
                {
                    label: "Show Kills",
                    value: this.kxsClient.isKillsVisible,
                    type: "toggle",
                    category: "HUD",
                    icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.7245 11.2754L16 12.4999L10.0129 17.8218C8.05054 19.5661 5.60528 20.6743 3 20.9999L3.79443 19.5435C4.6198 18.0303 5.03249 17.2737 5.50651 16.5582C5.92771 15.9224 6.38492 15.3113 6.87592 14.7278C7.42848 14.071 8.0378 13.4615 9.25644 12.2426L12 9.49822M11.5 8.99787L17.4497 3.04989C18.0698 2.42996 19.0281 2.3017 19.7894 2.73674C20.9027 3.37291 21.1064 4.89355 20.1997 5.80024L19.8415 6.15847C19.6228 6.3771 19.3263 6.49992 19.0171 6.49992H18L16 8.49992V8.67444C16 9.16362 16 9.40821 15.9447 9.63839C15.8957 9.84246 15.8149 10.0375 15.7053 10.2165C15.5816 10.4183 15.4086 10.5913 15.0627 10.9372L14.2501 11.7498L11.5 8.99787Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
                    onChange: (value) => {
                        this.kxsClient.isKillsVisible = !this.kxsClient.isKillsVisible;
                        this.kxsClient.updateKillsVisibility();
                        this.kxsClient.updateLocalStorage();
                    },
                },
                {
                    label: "Show FPS",
                    value: this.kxsClient.isFpsVisible,
                    category: "HUD",
                    type: "toggle",
                    icon: '<svg fill="#000000" viewBox="0 0 24 24" id="60fps" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect id="primary" x="10.5" y="8.5" width="14" height="7" rx="1" transform="translate(5.5 29.5) rotate(-90)" style="fill: none; stroke: #000000; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></rect><path id="primary-2" data-name="primary" d="M3,12H9a1,1,0,0,1,1,1v5a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V6A1,1,0,0,1,4,5h6" style="fill: none; stroke: #000000; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></g></svg>',
                    onChange: (value) => {
                        this.kxsClient.isFpsVisible = !this.kxsClient.isFpsVisible;
                        this.kxsClient.updateFpsVisibility();
                        this.kxsClient.updateLocalStorage();
                    },
                },
                {
                    label: "Show Ping",
                    value: this.kxsClient.isPingVisible,
                    category: "HUD",
                    icon: '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M34.6282,24.0793a14.7043,14.7043,0,0,0-22.673,1.7255"></path><path class="a" d="M43.5,20.5846a23.8078,23.8078,0,0,0-39,0"></path><path class="a" d="M43.5,20.5845,22.0169,29.0483a5.5583,5.5583,0,1,0,6.2116,8.7785l.0153.0206Z"></path></g></svg>',
                    type: "toggle",
                    onChange: (value) => {
                        this.kxsClient.isPingVisible = !this.kxsClient.isPingVisible;
                        this.kxsClient.updatePingVisibility();
                        this.kxsClient.updateLocalStorage();
                    },
                }
            ],
        });
        this.addOption(HUD, {
            label: "Weapon Border",
            value: this.kxsClient.isGunOverlayColored,
            category: "HUD",
            type: "toggle",
            icon: '<svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M363.929,0l-12.346,12.346L340.036,0.799l-21.458,21.458l11.547,11.547L107.782,256.147L96.235,244.6l-21.458,21.458 l11.863,11.863c-17.171,21.661-18.478,51.842-3.925,74.805L399.683,35.755L363.929,0z"></path> </g> </g> <g> <g> <path d="M304.934,330.282c27.516-27.516,29.126-71.268,4.845-100.695l129.522-129.523l-30.506-30.506L115.402,362.954 l30.506,30.506l16.191-16.191L259.625,512l84.679-84.679l-57.279-79.13L304.934,330.282z M269.003,323.296l-18.666-25.788 l-3.561-4.919l5.696-5.696l15.814,15.814l21.458-21.458l-15.814-15.814l14.228-14.228c12.546,17.432,10.985,41.949-4.683,57.617 L269.003,323.296z"></path> </g> </g> </g></svg>',
            onChange: (value) => {
                this.kxsClient.isGunOverlayColored = !this.kxsClient.isGunOverlayColored;
                this.kxsClient.updateLocalStorage();
                this.kxsClient.hud.toggleWeaponBorderHandler();
            },
        });
        this.addOption(HUD, {
            label: "Chromatic Weapon Border",
            value: this.kxsClient.isGunBorderChromatic,
            category: "HUD",
            type: "toggle",
            icon: '<svg fill="#000000" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M256.005,13.477c-84.682,0-153.734,68.227-155.075,152.594c0.535-0.164,1.073-0.318,1.61-0.477 c0.341-0.101,0.681-0.204,1.022-0.303c1.366-0.398,2.733-0.781,4.107-1.146c0.166-0.043,0.331-0.084,0.497-0.127 c1.214-0.318,2.43-0.623,3.651-0.917c0.389-0.094,0.777-0.186,1.167-0.276c1.147-0.268,2.296-0.526,3.448-0.771 c0.253-0.055,0.506-0.112,0.76-0.166c1.377-0.288,2.757-0.557,4.139-0.813c0.347-0.064,0.695-0.124,1.044-0.186 c1.091-0.195,2.183-0.38,3.278-0.555c0.385-0.062,0.769-0.124,1.154-0.184c1.396-0.214,2.793-0.417,4.195-0.599 c0.112-0.014,0.225-0.026,0.337-0.041c1.298-0.167,2.599-0.316,3.902-0.454c0.404-0.042,0.808-0.084,1.213-0.124 c1.139-0.113,2.278-0.216,3.42-0.309c0.303-0.024,0.605-0.052,0.907-0.076c1.408-0.106,2.818-0.197,4.231-0.271 c0.333-0.018,0.668-0.03,1.001-0.045c1.128-0.054,2.258-0.097,3.389-0.13c0.402-0.012,0.803-0.024,1.205-0.033 c1.43-0.032,2.863-0.055,4.297-0.055c1.176,0,2.351,0.013,3.525,0.036c0.389,0.007,0.778,0.022,1.167,0.032 c0.787,0.02,1.574,0.041,2.361,0.072c0.46,0.018,0.921,0.042,1.382,0.064c0.715,0.033,1.429,0.067,2.144,0.108 c0.487,0.028,0.974,0.062,1.462,0.094c0.689,0.045,1.379,0.093,2.068,0.146c0.497,0.038,0.993,0.081,1.49,0.123 c0.68,0.059,1.36,0.119,2.039,0.186c0.497,0.047,0.993,0.098,1.49,0.149c0.684,0.072,1.368,0.148,2.051,0.228 c0.487,0.057,0.973,0.113,1.46,0.174c0.701,0.087,1.402,0.181,2.102,0.276c0.464,0.064,0.929,0.125,1.393,0.191 c0.74,0.106,1.479,0.221,2.218,0.336c0.423,0.066,0.846,0.128,1.269,0.198c0.85,0.138,1.698,0.287,2.546,0.437 c0.307,0.055,0.616,0.105,0.923,0.16c1.166,0.212,2.33,0.435,3.49,0.67c0.07,0.014,0.138,0.03,0.208,0.043 c1.082,0.22,2.161,0.449,3.239,0.688c0.352,0.078,0.704,0.163,1.055,0.242c0.793,0.181,1.588,0.362,2.379,0.554 c0.421,0.102,0.841,0.209,1.262,0.314c0.722,0.18,1.442,0.36,2.162,0.548c0.446,0.116,0.89,0.237,1.335,0.357 c0.693,0.187,1.387,0.377,2.078,0.57c0.453,0.127,0.906,0.258,1.359,0.39c0.683,0.198,1.367,0.4,2.048,0.606 c0.451,0.136,0.902,0.273,1.353,0.414c0.685,0.212,1.369,0.43,2.051,0.651c0.439,0.141,0.878,0.283,1.316,0.428 c0.703,0.232,1.402,0.471,2.101,0.712c0.414,0.142,0.828,0.283,1.24,0.427c0.747,0.262,1.491,0.534,2.235,0.805 c0.36,0.132,0.722,0.26,1.081,0.395c0.887,0.331,1.771,0.671,2.654,1.015c0.212,0.083,0.425,0.161,0.636,0.245 c1.108,0.437,2.212,0.884,3.313,1.342c0.125,0.052,0.249,0.107,0.374,0.16c0.958,0.401,1.913,0.81,2.865,1.226 c0.329,0.144,0.656,0.295,0.985,0.441c0.744,0.332,1.487,0.665,2.227,1.006c0.391,0.181,0.779,0.365,1.169,0.548 c0.673,0.316,1.345,0.634,2.015,0.959c0.417,0.202,0.832,0.408,1.248,0.613c0.64,0.316,1.278,0.634,1.914,0.957 c0.425,0.216,0.849,0.435,1.273,0.654c0.625,0.323,1.248,0.65,1.868,0.981c0.424,0.226,0.847,0.452,1.269,0.68 c0.621,0.336,1.239,0.678,1.856,1.021c0.413,0.23,0.826,0.459,1.237,0.692c0.63,0.357,1.257,0.721,1.882,1.086 c0.392,0.228,0.784,0.454,1.174,0.685c0.664,0.394,1.323,0.795,1.982,1.197c0.344,0.21,0.69,0.417,1.034,0.629 c0.803,0.498,1.601,1.003,2.396,1.513c0.118,0.076,0.237,0.148,0.355,0.224l0.297-0.218l0.297,0.218 c0.118-0.076,0.237-0.148,0.355-0.224c0.795-0.51,1.593-1.015,2.396-1.513c0.343-0.212,0.689-0.419,1.034-0.629 c0.659-0.402,1.318-0.803,1.982-1.197c0.39-0.231,0.782-0.457,1.174-0.685c0.626-0.365,1.253-0.729,1.882-1.086 c0.411-0.233,0.824-0.462,1.236-0.692c0.617-0.343,1.235-0.685,1.856-1.021c0.422-0.229,0.845-0.455,1.268-0.68 c0.622-0.331,1.246-0.658,1.871-0.982c0.422-0.218,0.845-0.436,1.269-0.652c0.637-0.323,1.276-0.642,1.917-0.959 c0.415-0.205,0.83-0.41,1.247-0.612c0.669-0.324,1.341-0.642,2.015-0.959c0.39-0.183,0.778-0.368,1.169-0.548 c0.74-0.341,1.483-0.674,2.227-1.006c0.328-0.146,0.655-0.296,0.985-0.441c0.951-0.418,1.907-0.826,2.865-1.226 c0.125-0.052,0.249-0.108,0.374-0.16c1.1-0.458,2.203-0.905,3.313-1.342c0.211-0.084,0.425-0.162,0.636-0.245 c0.882-0.344,1.766-0.685,2.654-1.015c0.359-0.134,0.721-0.262,1.081-0.395c0.744-0.273,1.488-0.543,2.235-0.805 c0.413-0.145,0.827-0.286,1.24-0.427c0.699-0.24,1.399-0.479,2.102-0.712c0.438-0.145,0.877-0.287,1.316-0.428 c0.683-0.221,1.367-0.438,2.051-0.651c0.45-0.139,0.901-0.277,1.353-0.414c0.681-0.206,1.364-0.407,2.048-0.606 c0.452-0.131,0.905-0.261,1.359-0.39c0.691-0.195,1.385-0.384,2.078-0.57c0.445-0.12,0.89-0.24,1.335-0.357 c0.72-0.189,1.44-0.369,2.162-0.548c0.421-0.105,0.841-0.212,1.262-0.314c0.791-0.191,1.585-0.373,2.379-0.554 c0.352-0.081,0.703-0.164,1.055-0.242c1.078-0.239,2.157-0.468,3.239-0.688c0.07-0.014,0.138-0.029,0.208-0.043 c1.162-0.234,2.325-0.457,3.49-0.67c0.307-0.057,0.615-0.106,0.922-0.161c0.848-0.149,1.697-0.298,2.548-0.437 c0.422-0.069,0.844-0.131,1.266-0.197c0.739-0.115,1.479-0.23,2.219-0.336c0.463-0.067,0.928-0.128,1.392-0.191 c0.701-0.095,1.401-0.189,2.103-0.276c0.487-0.061,0.973-0.117,1.461-0.174c0.682-0.08,1.366-0.155,2.05-0.228 c0.497-0.051,0.993-0.102,1.49-0.149c0.679-0.066,1.359-0.127,2.039-0.186c0.497-0.042,0.993-0.085,1.49-0.123 c0.688-0.054,1.378-0.101,2.068-0.146c0.487-0.032,0.974-0.066,1.462-0.094c0.715-0.042,1.429-0.076,2.144-0.108 c0.46-0.021,0.921-0.045,1.382-0.064c0.786-0.03,1.574-0.051,2.361-0.072c0.389-0.01,0.778-0.024,1.167-0.032 c1.175-0.023,2.35-0.036,3.525-0.036c1.435,0,2.867,0.022,4.297,0.055c0.402,0.009,0.803,0.021,1.205,0.033 c1.132,0.033,2.261,0.077,3.388,0.13c0.334,0.016,0.668,0.028,1.002,0.045c1.413,0.075,2.823,0.166,4.23,0.272 c0.303,0.023,0.605,0.051,0.907,0.076c1.142,0.093,2.282,0.195,3.42,0.309c0.405,0.04,0.808,0.081,1.213,0.124 c1.303,0.138,2.604,0.288,3.902,0.454c0.112,0.015,0.225,0.026,0.337,0.041c1.401,0.182,2.799,0.385,4.194,0.599 c0.386,0.06,0.77,0.122,1.156,0.184c1.094,0.175,2.186,0.36,3.277,0.555c0.348,0.063,0.696,0.122,1.044,0.186 c1.383,0.255,2.763,0.526,4.139,0.813c0.253,0.054,0.507,0.111,0.76,0.166c1.152,0.245,2.3,0.503,3.448,0.771 c0.39,0.091,0.778,0.183,1.167,0.276c1.218,0.294,2.435,0.598,3.648,0.915c0.167,0.043,0.334,0.084,0.501,0.128 c1.373,0.364,2.74,0.749,4.106,1.145c0.341,0.1,0.681,0.203,1.022,0.304c0.537,0.159,1.074,0.314,1.61,0.477 C409.734,81.704,340.686,13.477,256.005,13.477z"></path> </g> </g> <g> <g> <path d="M436.614,210.342c-0.136,0.588-0.291,1.172-0.433,1.758c-0.163,0.671-0.325,1.341-0.495,2.01 c-0.317,1.249-0.651,2.49-0.993,3.73c-0.161,0.585-0.317,1.174-0.484,1.757c-0.482,1.682-0.986,3.354-1.515,5.017 c-0.039,0.124-0.075,0.25-0.114,0.374c-0.571,1.784-1.175,3.555-1.8,5.318c-0.197,0.554-0.406,1.103-0.608,1.655 c-0.442,1.21-0.891,2.417-1.358,3.617c-0.253,0.652-0.515,1.3-0.775,1.948c-0.445,1.108-0.9,2.211-1.367,3.309 c-0.277,0.652-0.555,1.304-0.84,1.953c-0.497,1.133-1.008,2.258-1.527,3.379c-0.268,0.579-0.53,1.161-0.803,1.738 c-0.687,1.446-1.395,2.883-2.119,4.31c-0.118,0.233-0.229,0.469-0.348,0.701c-0.843,1.644-1.713,3.273-2.603,4.89 c-0.286,0.52-0.584,1.032-0.875,1.548c-0.624,1.107-1.254,2.211-1.9,3.306c-0.358,0.607-0.724,1.209-1.089,1.811 c-0.61,1.007-1.228,2.008-1.857,3.003c-0.383,0.607-0.767,1.211-1.158,1.813c-0.659,1.016-1.331,2.023-2.01,3.027 c-0.368,0.544-0.731,1.091-1.104,1.63c-0.867,1.254-1.753,2.495-2.652,3.727c-0.196,0.268-0.384,0.542-0.579,0.808 c-1.093,1.483-2.21,2.946-3.346,4.397c-0.357,0.455-0.725,0.902-1.086,1.354c-0.801,1.003-1.608,2.001-2.43,2.987 c-0.449,0.54-0.906,1.073-1.362,1.608c-0.763,0.895-1.534,1.785-2.314,2.666c-0.477,0.539-0.956,1.076-1.439,1.609 c-0.811,0.894-1.633,1.778-2.462,2.658c-0.455,0.482-0.905,0.968-1.367,1.446c-1.03,1.07-2.075,2.123-3.131,3.168 c-0.268,0.265-0.529,0.537-0.798,0.8c-1.322,1.293-2.666,2.565-4.027,3.819c-0.409,0.377-0.827,0.742-1.24,1.115 c-0.973,0.881-1.952,1.756-2.945,2.617c-0.526,0.456-1.059,0.905-1.591,1.356c-0.909,0.771-1.825,1.534-2.75,2.288 c-0.557,0.454-1.117,0.906-1.681,1.355c-0.951,0.757-1.912,1.502-2.879,2.241c-0.532,0.406-1.06,0.817-1.596,1.217 c-1.172,0.876-2.359,1.734-3.554,2.584c-0.337,0.239-0.667,0.487-1.005,0.724c-1.528,1.071-3.076,2.119-4.638,3.145 c-0.451,0.296-0.911,0.581-1.367,0.874c-1.131,0.729-2.268,1.45-3.417,2.156c-0.598,0.366-1.202,0.725-1.804,1.085 c-1.034,0.618-2.073,1.228-3.121,1.828c-0.635,0.363-1.272,0.724-1.913,1.08c-1.067,0.592-2.142,1.173-3.222,1.746 c-0.61,0.323-1.217,0.651-1.832,0.968c-0.13,0.067-0.258,0.138-0.389,0.205l0.04,0.361l-0.333,0.146 c0.008,0.161,0.01,0.322,0.018,0.483c0.03,0.645,0.049,1.289,0.073,1.935c0.046,1.27,0.083,2.539,0.103,3.808 c0.011,0.696,0.017,1.392,0.02,2.088c0.005,1.247-0.004,2.491-0.023,3.736c-0.01,0.67-0.018,1.34-0.036,2.01 c-0.037,1.388-0.095,2.772-0.164,4.156c-0.025,0.505-0.04,1.009-0.069,1.514c-0.108,1.877-0.242,3.752-0.407,5.621 c-0.033,0.382-0.079,0.761-0.115,1.143c-0.14,1.488-0.294,2.973-0.469,4.454c-0.078,0.656-0.168,1.31-0.252,1.965 c-0.157,1.214-0.323,2.427-0.505,3.638c-0.106,0.708-0.217,1.414-0.331,2.121c-0.191,1.18-0.395,2.356-0.608,3.531 c-0.124,0.685-0.247,1.372-0.379,2.056c-0.247,1.283-0.515,2.56-0.788,3.836c-0.119,0.553-0.229,1.109-0.353,1.661 c-0.405,1.801-0.833,3.595-1.29,5.382c-0.099,0.388-0.21,0.771-0.312,1.157c-0.371,1.412-0.754,2.821-1.158,4.224 c-0.189,0.654-0.389,1.304-0.584,1.956c-0.342,1.139-0.69,2.275-1.054,3.407c-0.225,0.699-0.455,1.397-0.687,2.093 c-0.366,1.097-0.745,2.19-1.132,3.28c-0.242,0.681-0.482,1.363-0.732,2.04c-0.431,1.172-0.88,2.337-1.334,3.498 c-0.223,0.571-0.438,1.145-0.667,1.713c-0.682,1.696-1.387,3.383-2.119,5.058c-0.155,0.356-0.323,0.707-0.48,1.062 c-0.596,1.339-1.201,2.673-1.828,3.998c-0.295,0.622-0.601,1.238-0.901,1.857c-0.515,1.059-1.036,2.114-1.571,3.162 c-0.338,0.662-0.681,1.321-1.028,1.979c-0.532,1.012-1.074,2.02-1.625,3.023c-0.353,0.643-0.706,1.286-1.066,1.925 c-0.605,1.071-1.225,2.132-1.851,3.192c-0.321,0.543-0.635,1.091-0.962,1.631c-0.948,1.567-1.915,3.122-2.908,4.661 c-0.177,0.274-0.363,0.542-0.542,0.815c-0.839,1.284-1.691,2.561-2.562,3.824c-0.38,0.55-0.77,1.093-1.156,1.64 c-0.694,0.985-1.395,1.965-2.109,2.936c-0.432,0.587-0.87,1.171-1.309,1.753c-0.703,0.934-1.417,1.861-2.139,2.782 c-0.443,0.566-0.886,1.131-1.336,1.693c-0.787,0.981-1.59,1.951-2.398,2.917c-0.395,0.472-0.783,0.949-1.184,1.417 c-1.207,1.413-2.433,2.813-3.684,4.192c-0.119,0.131-0.243,0.257-0.362,0.389c-1.146,1.255-2.309,2.494-3.491,3.718 c-0.434,0.45-0.879,0.891-1.318,1.337c-0.889,0.903-1.785,1.8-2.694,2.686c-0.503,0.49-1.01,0.974-1.519,1.458 c-0.433,0.412-0.856,0.833-1.293,1.24c23.044,12.82,49.005,19.586,75.238,19.589c0.002,0,0.006,0,0.008,0 c26.778,0,53.256-6.96,76.576-20.133c24-13.557,44.018-33.419,57.887-57.44C533.598,347.601,509.03,253.68,436.614,210.342z"></path> </g> </g> <g> <g> <path d="M357.097,188.296c-26.339,0-52.539,6.858-75.519,19.563c0.206,0.192,0.401,0.394,0.605,0.585 c1.334,1.256,2.652,2.526,3.946,3.82c0.146,0.146,0.298,0.289,0.443,0.435c1.417,1.426,2.803,2.881,4.172,4.352 c0.372,0.4,0.74,0.804,1.108,1.208c1.12,1.225,2.224,2.466,3.311,3.723c0.272,0.314,0.548,0.623,0.818,0.939 c1.302,1.527,2.579,3.077,3.831,4.647c0.299,0.374,0.589,0.754,0.885,1.13c1.013,1.291,2.011,2.596,2.991,3.915 c0.303,0.408,0.61,0.814,0.909,1.224c1.192,1.632,2.364,3.283,3.505,4.959c0.19,0.278,0.372,0.562,0.56,0.842 c0.973,1.444,1.926,2.906,2.861,4.382c0.296,0.466,0.59,0.933,0.882,1.402c1.085,1.746,2.154,3.505,3.187,5.294 c0.721,1.249,1.421,2.506,2.112,3.767c0.195,0.355,0.387,0.712,0.578,1.068c0.539,0.999,1.068,2.003,1.588,3.009 c0.154,0.3,0.313,0.599,0.465,0.899c0.645,1.265,1.275,2.536,1.888,3.812c0.133,0.278,0.262,0.556,0.394,0.835 c0.493,1.036,0.974,2.076,1.446,3.12c0.169,0.372,0.337,0.745,0.503,1.118c0.536,1.205,1.061,2.413,1.57,3.627 c0.042,0.101,0.087,0.201,0.129,0.302c0.547,1.31,1.073,2.627,1.589,3.949c0.141,0.36,0.279,0.723,0.417,1.085 c0.399,1.042,0.788,2.087,1.168,3.135c0.12,0.331,0.242,0.661,0.36,0.993c0.472,1.328,0.932,2.663,1.374,4.001 c0.082,0.246,0.157,0.495,0.238,0.741c0.364,1.119,0.717,2.243,1.06,3.369c0.118,0.389,0.235,0.777,0.351,1.166 c0.354,1.194,0.697,2.391,1.028,3.592c0.048,0.175,0.1,0.349,0.147,0.525c0.37,1.364,0.721,2.732,1.06,4.104 c0.091,0.367,0.178,0.736,0.265,1.104c0.127,0.529,0.259,1.056,0.382,1.587c37.925-22.771,64.617-60.932,72.753-104.53 C391.963,191.252,374.736,188.296,357.097,188.296z"></path> </g> </g> <g> <g> <path d="M229.161,477.688c-0.508-0.483-1.014-0.967-1.516-1.455c-0.909-0.886-1.806-1.785-2.696-2.688 c-0.439-0.446-0.883-0.886-1.317-1.336c-1.182-1.224-2.346-2.464-3.491-3.718c-0.119-0.13-0.243-0.257-0.362-0.389 c-1.252-1.379-2.477-2.779-3.684-4.192c-0.4-0.468-0.788-0.946-1.184-1.417c-0.808-0.966-1.611-1.936-2.398-2.917 c-0.45-0.561-0.893-1.126-1.336-1.693c-0.722-0.922-1.435-1.848-2.139-2.782c-0.439-0.582-0.877-1.166-1.309-1.753 c-0.714-0.971-1.414-1.952-2.109-2.936c-0.386-0.547-0.776-1.089-1.156-1.64c-0.871-1.264-1.723-2.54-2.562-3.824 c-0.179-0.273-0.364-0.541-0.542-0.815c-0.994-1.539-1.962-3.096-2.91-4.662c-0.326-0.538-0.638-1.084-0.958-1.625 c-0.627-1.061-1.249-2.124-1.854-3.197c-0.36-0.639-0.713-1.282-1.066-1.924c-0.551-1.003-1.093-2.011-1.625-3.023 c-0.346-0.658-0.689-1.317-1.028-1.979c-0.535-1.049-1.056-2.104-1.571-3.162c-0.301-0.619-0.608-1.235-0.901-1.857 c-0.627-1.325-1.232-2.659-1.828-3.998c-0.157-0.355-0.325-0.706-0.48-1.062c-0.732-1.674-1.435-3.362-2.119-5.058 c-0.229-0.568-0.443-1.142-0.667-1.713c-0.454-1.162-0.903-2.327-1.334-3.498c-0.249-0.678-0.491-1.36-0.732-2.04 c-0.387-1.09-0.765-2.183-1.132-3.28c-0.232-0.696-0.463-1.394-0.687-2.093c-0.363-1.133-0.713-2.271-1.055-3.412 c-0.195-0.649-0.395-1.297-0.582-1.949c-0.405-1.404-0.788-2.814-1.16-4.228c-0.101-0.386-0.212-0.768-0.311-1.155 c-0.457-1.786-0.885-3.58-1.29-5.382c-0.124-0.552-0.234-1.108-0.353-1.661c-0.275-1.276-0.541-2.553-0.788-3.836 c-0.132-0.684-0.254-1.37-0.378-2.056c-0.213-1.175-0.417-2.351-0.608-3.531c-0.114-0.706-0.225-1.412-0.331-2.121 c-0.182-1.21-0.347-2.423-0.505-3.638c-0.085-0.655-0.175-1.308-0.252-1.965c-0.176-1.481-0.329-2.966-0.469-4.454 c-0.036-0.382-0.082-0.761-0.115-1.143c-0.164-1.869-0.299-3.744-0.407-5.621c-0.029-0.504-0.044-1.008-0.069-1.512 c-0.069-1.385-0.126-2.771-0.164-4.16c-0.018-0.667-0.025-1.335-0.036-2.004c-0.019-1.246-0.028-2.492-0.023-3.741 c0.003-0.695,0.009-1.391,0.02-2.087c0.02-1.269,0.057-2.539,0.103-3.808c0.023-0.645,0.042-1.289,0.073-1.935 c0.007-0.162,0.01-0.322,0.018-0.484l-0.333-0.146l0.04-0.361c-0.13-0.067-0.258-0.138-0.389-0.205 c-0.615-0.317-1.222-0.645-1.833-0.968c-1.081-0.573-2.157-1.154-3.224-1.747c-0.638-0.355-1.274-0.714-1.907-1.076 c-1.051-0.601-2.092-1.213-3.129-1.833c-0.601-0.358-1.202-0.716-1.798-1.081c-1.15-0.706-2.286-1.427-3.418-2.157 c-0.454-0.293-0.915-0.577-1.367-0.874c-1.563-1.025-3.109-2.072-4.636-3.143c-0.343-0.24-0.678-0.492-1.02-0.735 c-1.189-0.845-2.37-1.7-3.537-2.571c-0.54-0.403-1.071-0.816-1.606-1.224c-0.964-0.737-1.922-1.479-2.871-2.234 c-0.565-0.45-1.126-0.904-1.687-1.361c-0.921-0.751-1.833-1.511-2.738-2.278c-0.536-0.454-1.072-0.906-1.602-1.366 c-0.984-0.854-1.955-1.722-2.921-2.595c-0.421-0.38-0.849-0.755-1.266-1.14c-1.358-1.251-2.698-2.519-4.017-3.809 c-0.281-0.275-0.552-0.558-0.832-0.835c-1.044-1.034-2.078-2.075-3.097-3.133c-0.466-0.484-0.924-0.978-1.385-1.468 c-0.821-0.871-1.637-1.747-2.441-2.634c-0.489-0.539-0.973-1.082-1.456-1.626c-0.774-0.875-1.54-1.757-2.297-2.647 c-0.461-0.541-0.923-1.08-1.377-1.625c-0.814-0.977-1.612-1.965-2.405-2.958c-0.368-0.461-0.744-0.917-1.108-1.382 c-1.133-1.446-2.248-2.906-3.337-4.385c-0.21-0.284-0.41-0.574-0.617-0.86c-0.885-1.215-1.758-2.439-2.614-3.674 c-0.379-0.548-0.747-1.103-1.12-1.654c-0.672-0.995-1.339-1.993-1.992-3.001c-0.395-0.609-0.783-1.22-1.171-1.834 c-0.624-0.986-1.236-1.978-1.841-2.978c-0.369-0.609-0.739-1.216-1.1-1.83c-0.642-1.088-1.269-2.186-1.888-3.286 c-0.295-0.523-0.596-1.04-0.884-1.565c-0.889-1.615-1.758-3.241-2.6-4.883c-0.124-0.241-0.239-0.487-0.361-0.729 c-0.719-1.417-1.421-2.842-2.103-4.279c-0.278-0.584-0.543-1.174-0.815-1.76c-0.516-1.115-1.024-2.234-1.518-3.36 c-0.286-0.651-0.564-1.304-0.843-1.959c-0.466-1.098-0.922-2.201-1.367-3.309c-0.26-0.647-0.521-1.294-0.773-1.944 c-0.467-1.201-0.917-2.409-1.36-3.622c-0.201-0.551-0.41-1.099-0.606-1.652c-0.625-1.763-1.228-3.535-1.8-5.319 c-0.039-0.123-0.074-0.247-0.113-0.369c-0.53-1.666-1.035-3.343-1.518-5.027c-0.166-0.578-0.32-1.162-0.48-1.742 c-0.344-1.246-0.679-2.493-0.998-3.748c-0.169-0.662-0.329-1.326-0.491-1.991c-0.143-0.59-0.299-1.178-0.436-1.77 C2.971,253.679-21.598,347.601,20.747,420.946c13.866,24.018,33.884,43.88,57.888,57.436 c23.322,13.172,49.804,20.136,76.584,20.137c0.002,0,0.005,0,0.007,0c26.227,0,52.183-6.767,75.23-19.589 C230.018,478.523,229.594,478.101,229.161,477.688z"></path> </g> </g> <g> <g> <path d="M154.899,188.295c-17.638,0-34.866,2.956-51.358,8.799c8.136,43.599,34.828,81.76,72.749,104.53 c0.126-0.53,0.258-1.058,0.385-1.586c0.089-0.368,0.175-0.737,0.266-1.104c0.338-1.372,0.689-2.74,1.06-4.104 c0.047-0.176,0.099-0.349,0.147-0.525c0.33-1.201,0.673-2.398,1.028-3.592c0.115-0.39,0.233-0.778,0.351-1.166 c0.342-1.126,0.695-2.25,1.06-3.369c0.081-0.247,0.157-0.495,0.238-0.741c0.442-1.338,0.9-2.672,1.374-4.001 c0.118-0.332,0.24-0.662,0.36-0.993c0.38-1.049,0.769-2.093,1.168-3.135c0.138-0.361,0.276-0.724,0.417-1.085 c0.516-1.321,1.042-2.637,1.589-3.949c0.042-0.101,0.087-0.201,0.129-0.302c0.509-1.214,1.034-2.421,1.57-3.627 c0.166-0.373,0.334-0.746,0.503-1.118c0.472-1.044,0.955-2.083,1.446-3.12c0.132-0.278,0.26-0.557,0.394-0.835 c0.614-1.277,1.243-2.547,1.888-3.812c0.152-0.301,0.311-0.6,0.465-0.899c0.52-1.006,1.049-2.01,1.588-3.009 c0.192-0.356,0.384-0.713,0.578-1.068c0.69-1.262,1.391-2.518,2.112-3.767c1.033-1.789,2.102-3.548,3.187-5.294 c0.292-0.469,0.586-0.936,0.882-1.402c0.936-1.476,1.888-2.937,2.861-4.382c0.188-0.28,0.37-0.564,0.56-0.842 c1.142-1.676,2.312-3.327,3.505-4.959c0.3-0.411,0.606-0.817,0.909-1.224c0.98-1.32,1.977-2.625,2.991-3.915 c0.296-0.376,0.587-0.756,0.885-1.13c1.254-1.571,2.529-3.12,3.831-4.647c0.27-0.316,0.546-0.625,0.818-0.939 c1.087-1.257,2.19-2.497,3.311-3.722c0.368-0.403,0.736-0.807,1.108-1.208c1.369-1.472,2.755-2.926,4.172-4.352 c0.146-0.146,0.297-0.289,0.443-0.435c1.294-1.294,2.612-2.565,3.945-3.82c0.205-0.192,0.4-0.394,0.605-0.585 C207.437,195.152,181.237,188.295,154.899,188.295z"></path> </g> </g> <g> <g> <path d="M308.604,346.356c-0.375,0.111-0.751,0.224-1.126,0.333c-1.352,0.392-2.707,0.77-4.067,1.129 c-0.183,0.048-0.365,0.092-0.548,0.14c-1.2,0.314-2.404,0.614-3.61,0.902c-0.394,0.095-0.788,0.188-1.183,0.279 c-1.15,0.268-2.302,0.524-3.458,0.769c-0.249,0.053-0.499,0.11-0.749,0.161c-1.385,0.288-2.774,0.558-4.166,0.814 c-0.336,0.063-0.674,0.119-1.011,0.18c-1.108,0.197-2.219,0.385-3.33,0.561c-0.376,0.06-0.752,0.121-1.128,0.178 c-1.406,0.215-2.815,0.418-4.227,0.601c-0.096,0.012-0.193,0.022-0.29,0.035c-1.319,0.169-2.642,0.319-3.967,0.458 c-0.398,0.042-0.796,0.082-1.195,0.121c-1.152,0.114-2.305,0.217-3.461,0.31c-0.298,0.024-0.594,0.051-0.891,0.074 c-1.416,0.106-2.834,0.197-4.255,0.272c-0.334,0.018-0.669,0.03-1.004,0.045c-1.131,0.054-2.266,0.097-3.4,0.13 c-0.407,0.012-0.813,0.023-1.219,0.033c-1.436,0.032-2.875,0.055-4.316,0.055c-1.441,0-2.88-0.022-4.316-0.055 c-0.407-0.009-0.814-0.021-1.219-0.033c-1.135-0.033-2.269-0.077-3.401-0.13c-0.335-0.016-0.67-0.028-1.004-0.045 c-1.421-0.075-2.84-0.165-4.255-0.272c-0.298-0.022-0.595-0.049-0.891-0.074c-1.156-0.093-2.309-0.196-3.461-0.31 c-0.399-0.039-0.796-0.079-1.194-0.121c-1.325-0.139-2.649-0.291-3.968-0.458c-0.096-0.012-0.193-0.022-0.29-0.035 c-1.413-0.183-2.821-0.386-4.227-0.601c-0.376-0.058-0.752-0.118-1.128-0.178c-1.112-0.177-2.223-0.364-3.33-0.561 c-0.337-0.061-0.674-0.117-1.011-0.18c-1.392-0.255-2.781-0.526-4.166-0.814c-0.25-0.052-0.499-0.108-0.749-0.161 c-1.156-0.245-2.307-0.502-3.458-0.769c-0.395-0.092-0.788-0.185-1.183-0.279c-1.206-0.289-2.41-0.588-3.61-0.902 c-0.183-0.047-0.365-0.092-0.548-0.14c-1.36-0.359-2.715-0.738-4.067-1.129c-0.376-0.109-0.751-0.222-1.126-0.333 c-0.513-0.151-1.028-0.298-1.538-0.455c0.756,44.222,20.455,86.416,54.141,115.261c33.685-28.845,53.385-71.039,54.143-115.261 C309.631,346.057,309.117,346.204,308.604,346.356z"></path> </g> </g> <g> <g> <path d="M289.37,265.857c-8.877-15.374-20.073-28.874-33.371-40.251c-13.298,11.376-24.494,24.875-33.371,40.251 c-8.876,15.374-14.969,31.819-18.173,49.024c16.502,5.827,33.79,8.773,51.544,8.773c17.754,0,35.045-2.945,51.546-8.773 C304.339,297.676,298.247,281.232,289.37,265.857z"></path> </g> </g> </g></svg>',
            onChange: (value) => {
                this.kxsClient.isGunBorderChromatic = !this.kxsClient.isGunBorderChromatic;
                this.kxsClient.updateLocalStorage();
                this.kxsClient.hud.toggleChromaticWeaponBorder();
            },
        });
        this.addOption(HUD, {
            label: "Focus Mode",
            value: (() => {
                const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
                return `Press ${isMac ? 'Command+F (⌘+F)' : 'Ctrl+F'} to toggle Focus Mode.\nWhen enabled, the HUD will dim and notifications will appear.`;
            })(),
            category: "HUD",
            type: "info",
            icon: '<svg version="1.1" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M30.146,28.561l-1.586,1.586c-0.292,0.292-0.676,0.438-1.061,0.438s-0.768-0.146-1.061-0.438 l-4.293-4.293l-2.232,2.232c-0.391,0.391-0.902,0.586-1.414,0.586s-1.024-0.195-1.414-0.586l-0.172-0.172 c-0.781-0.781-0.781-2.047,0-2.828l8.172-8.172c0.391-0.391,0.902-0.586,1.414-0.586s1.024,0.195,1.414,0.586l0.172,0.172 c0.781,0.781,0.781,2.047,0,2.828l-2.232,2.232l4.293,4.293C30.731,27.024,30.731,27.976,30.146,28.561z M22.341,18.244 l-4.097,4.097L3.479,13.656C2.567,13.12,2,12.128,2,11.07V3c0-0.551,0.449-1,1-1h8.07c1.058,0,2.049,0.567,2.586,1.479 L22.341,18.244z M19.354,19.354c0.195-0.195,0.195-0.512,0-0.707l-15.5-15.5c-0.195-0.195-0.512-0.195-0.707,0s-0.195,0.512,0,0.707 l15.5,15.5C18.744,19.451,18.872,19.5,19,19.5S19.256,19.451,19.354,19.354z" fill="#000000"></path> </g></svg>',
            onChange: () => {
            }
        });
        this.addOption(HUD, {
            label: "Health Bar Indicator",
            value: this.kxsClient.isHealBarIndicatorEnabled,
            type: "toggle",
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 8.59997C13.3334 7.01474 15 5.42847 17 5.42847C19.6667 5.42847 22 7.52847 22 11.2855C22 13.7143 20.2683 16.4912 18.1789 18.9912C16.5956 20.8955 14.7402 22.5713 13.2302 22.5713H10.7698C9.25981 22.5713 7.40446 20.8955 5.82112 18.9912C3.73174 16.4912 2 13.7143 2 11.2855C2 7.52847 4.33333 5.42847 7 5.42847C9 5.42847 10.6667 7.01474 12.0001 8.59997Z" fill="#000000"></path> </g></svg>',
            category: "HUD",
            onChange: () => {
                this.kxsClient.isHealBarIndicatorEnabled = !this.kxsClient.isHealBarIndicatorEnabled;
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(HUD, {
            label: "Message Open/Close RSHIFT Menu",
            value: this.kxsClient.isNotifyingForToggleMenu,
            type: "toggle",
            icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="info-circle"> <g> <circle cx="12" cy="12" data-name="--Circle" fill="none" id="_--Circle" r="10" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> <line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="12" y2="16"></line> <line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="8" y2="8"></line> </g> </g> </g> </g></svg>',
            category: "HUD",
            onChange: (value) => {
                this.kxsClient.isNotifyingForToggleMenu = !this.kxsClient.isNotifyingForToggleMenu;
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(SERVER, {
            label: "Webhook URL",
            value: this.kxsClient.discordWebhookUrl || "",
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.52 3.046a3 3 0 0 0-2.13 5.486 1 1 0 0 1 .306 1.38l-3.922 6.163a2 2 0 1 1-1.688-1.073l3.44-5.405a5 5 0 1 1 8.398-2.728 1 1 0 1 1-1.97-.348 3 3 0 0 0-2.433-3.475zM10 6a2 2 0 1 1 3.774.925l3.44 5.405a5 5 0 1 1-1.427 8.5 1 1 0 0 1 1.285-1.532 3 3 0 1 0 .317-4.83 1 1 0 0 1-1.38-.307l-3.923-6.163A2 2 0 0 1 10 6zm-5.428 6.9a1 1 0 0 1-.598 1.281A3 3 0 1 0 8.001 17a1 1 0 0 1 1-1h8.266a2 2 0 1 1 0 2H9.9a5 5 0 1 1-6.61-5.698 1 1 0 0 1 1.282.597Z" fill="#000000"></path> </g></svg>',
            category: "SERVER",
            type: "input",
            placeholder: "discord webhook url",
            onChange: (value) => {
                value = value.toString().trim();
                this.kxsClient.discordWebhookUrl = value;
                this.kxsClient.discordTracker.setWebhookUrl(value);
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(MECHANIC, {
            label: "Custom Crosshair",
            value: this.kxsClient.customCrosshair || "",
            type: "input",
            category: "MECHANIC",
            icon: '<svg fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>crosshair</title> <path d="M30 14.75h-2.824c-0.608-5.219-4.707-9.318-9.874-9.921l-0.053-0.005v-2.824c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 2.824c-5.219 0.608-9.318 4.707-9.921 9.874l-0.005 0.053h-2.824c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h2.824c0.608 5.219 4.707 9.318 9.874 9.921l0.053 0.005v2.824c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-2.824c5.219-0.608 9.318-4.707 9.921-9.874l0.005-0.053h2.824c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM17.25 24.624v-2.624c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0 2.624c-3.821-0.57-6.803-3.553-7.368-7.326l-0.006-0.048h2.624c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-2.624c0.57-3.821 3.553-6.804 7.326-7.368l0.048-0.006v2.624c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-2.624c3.821 0.57 6.803 3.553 7.368 7.326l0.006 0.048h-2.624c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h2.624c-0.571 3.821-3.553 6.803-7.326 7.368l-0.048 0.006z"></path> </g></svg>',
            placeholder: "URL of png,gif,svg",
            onChange: (value) => {
                this.kxsClient.customCrosshair = value;
                this.kxsClient.updateLocalStorage();
                this.kxsClient.hud.loadCustomCrosshair();
            },
        });
        this.addOption(MECHANIC, {
            label: "Heal Warning",
            value: this.kxsClient.isHealthWarningEnabled,
            type: "toggle",
            category: "MECHANIC",
            icon: '<svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>health</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add" fill="#000000" transform="translate(42.666667, 64.000000)"> <path d="M365.491733,234.665926 C339.947827,276.368766 302.121072,321.347032 252.011468,369.600724 L237.061717,383.7547 C234.512147,386.129148 231.933605,388.511322 229.32609,390.901222 L213.333333,405.333333 C205.163121,398.070922 197.253659,390.878044 189.604949,383.7547 L174.655198,369.600724 C124.545595,321.347032 86.7188401,276.368766 61.174934,234.665926 L112.222458,234.666026 C134.857516,266.728129 165.548935,301.609704 204.481843,339.08546 L213.333333,347.498667 L214.816772,346.115558 C257.264819,305.964102 290.400085,268.724113 314.444476,234.665648 L365.491733,234.665926 Z M149.333333,58.9638831 L213.333333,186.944 L245.333333,122.963883 L269.184,170.666667 L426.666667,170.666667 L426.666667,213.333333 L247.850667,213.333333 L213.333333,282.36945 L149.333333,154.368 L119.851392,213.333333 L3.55271368e-14,213.333333 L3.55271368e-14,170.666667 L93.4613333,170.666667 L149.333333,58.9638831 Z M290.133333,0 C353.756537,0 405.333333,51.5775732 405.333333,115.2 C405.333333,126.248908 404.101625,137.626272 401.63821,149.33209 L357.793994,149.332408 C360.62486,138.880112 362.217829,128.905378 362.584434,119.422244 L362.666667,115.2 C362.666667,75.1414099 330.192075,42.6666667 290.133333,42.6666667 C273.651922,42.6666667 258.124715,48.1376509 245.521279,58.0219169 L241.829932,61.1185374 L213.366947,86.6338354 L184.888885,61.1353673 C171.661383,49.2918281 154.669113,42.6666667 136.533333,42.6666667 C96.4742795,42.6666667 64,75.1409461 64,115.2 C64,125.932203 65.6184007,137.316846 68.8727259,149.332605 L25.028457,149.33209 C22.5650412,137.626272 21.3333333,126.248908 21.3333333,115.2 C21.3333333,51.5767968 72.9101302,0 136.533333,0 C166.046194,0 192.966972,11.098031 213.350016,29.348444 C233.716605,11.091061 260.629741,0 290.133333,0 Z" id="Combined-Shape"> </path> </g> </g> </g></svg>',
            onChange: (value) => {
                var _a, _b;
                this.kxsClient.isHealthWarningEnabled = !this.kxsClient.isHealthWarningEnabled;
                if (this.kxsClient.isHealthWarningEnabled) {
                    // Always enter placement mode when enabling from RSHIFT menu
                    (_a = this.kxsClient.healWarning) === null || _a === void 0 ? void 0 : _a.enableDragging();
                }
                else {
                    (_b = this.kxsClient.healWarning) === null || _b === void 0 ? void 0 : _b.hide();
                }
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(SERVER, {
            label: "Update Checker",
            value: this.kxsClient.isAutoUpdateEnabled,
            type: "toggle",
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.4721 16.7023C17.3398 18.2608 15.6831 19.3584 13.8064 19.7934C11.9297 20.2284 9.95909 19.9716 8.25656 19.0701C6.55404 18.1687 5.23397 16.6832 4.53889 14.8865C3.84381 13.0898 3.82039 11.1027 4.47295 9.29011C5.12551 7.47756 6.41021 5.96135 8.09103 5.02005C9.77184 4.07875 11.7359 3.77558 13.6223 4.16623C15.5087 4.55689 17.1908 5.61514 18.3596 7.14656C19.5283 8.67797 20.1052 10.5797 19.9842 12.5023M19.9842 12.5023L21.4842 11.0023M19.9842 12.5023L18.4842 11.0023" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 8V12L15 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
            category: "SERVER",
            onChange: (value) => {
                this.kxsClient.isAutoUpdateEnabled = !this.kxsClient.isAutoUpdateEnabled;
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(MECHANIC, {
            label: `Uncap FPS`,
            value: this.kxsClient.isFpsUncapped,
            type: "toggle",
            icon: '<svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> <title>ic_fluent_fps_960_24_filled</title> <desc>Created with Sketch.</desc> <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="ic_fluent_fps_960_24_filled" fill="#000000" fill-rule="nonzero"> <path d="M11.75,15 C12.9926407,15 14,16.0073593 14,17.25 C14,18.440864 13.0748384,19.4156449 11.9040488,19.4948092 L11.75,19.5 L11,19.5 L11,21.25 C11,21.6296958 10.7178461,21.943491 10.3517706,21.9931534 L10.25,22 C9.87030423,22 9.55650904,21.7178461 9.50684662,21.3517706 L9.5,21.25 L9.5,15.75 C9.5,15.3703042 9.78215388,15.056509 10.1482294,15.0068466 L10.25,15 L11.75,15 Z M18,15 C19.1045695,15 20,15.8954305 20,17 C20,17.4142136 19.6642136,17.75 19.25,17.75 C18.8703042,17.75 18.556509,17.4678461 18.5068466,17.1017706 L18.5,17 C18.5,16.7545401 18.3231248,16.5503916 18.0898756,16.5080557 L18,16.5 L17.375,16.5 C17.029822,16.5 16.75,16.779822 16.75,17.125 C16.75,17.4387982 16.9812579,17.6985831 17.2826421,17.7432234 L17.375,17.75 L17.875,17.75 C19.0486051,17.75 20,18.7013949 20,19.875 C20,20.9975788 19.1295366,21.91685 18.0267588,21.9946645 L17.875,22 L17.25,22 C16.1454305,22 15.25,21.1045695 15.25,20 C15.25,19.5857864 15.5857864,19.25 16,19.25 C16.3796958,19.25 16.693491,19.5321539 16.7431534,19.8982294 L16.75,20 C16.75,20.2454599 16.9268752,20.4496084 17.1601244,20.4919443 L17.25,20.5 L17.875,20.5 C18.220178,20.5 18.5,20.220178 18.5,19.875 C18.5,19.5612018 18.2687421,19.3014169 17.9673579,19.2567766 L17.875,19.25 L17.375,19.25 C16.2013949,19.25 15.25,18.2986051 15.25,17.125 C15.25,16.0024212 16.1204634,15.08315 17.2232412,15.0053355 L17.375,15 L18,15 Z M7.75,15 C8.16421356,15 8.5,15.3357864 8.5,15.75 C8.5,16.1296958 8.21784612,16.443491 7.85177056,16.4931534 L7.75,16.5 L5.5,16.4990964 L5.5,18.0020964 L7.25,18.002809 C7.66421356,18.002809 8,18.3385954 8,18.752809 C8,19.1325047 7.71784612,19.4462999 7.35177056,19.4959623 L7.25,19.502809 L5.5,19.5020964 L5.5,21.2312276 C5.5,21.6109234 5.21784612,21.9247186 4.85177056,21.974381 L4.75,21.9812276 C4.37030423,21.9812276 4.05650904,21.6990738 4.00684662,21.3329982 L4,21.2312276 L4,15.75 C4,15.3703042 4.28215388,15.056509 4.64822944,15.0068466 L4.75,15 L7.75,15 Z M11.75,16.5 L11,16.5 L11,18 L11.75,18 C12.1642136,18 12.5,17.6642136 12.5,17.25 C12.5,16.8703042 12.2178461,16.556509 11.8517706,16.5068466 L11.75,16.5 Z M5,3 C6.65685425,3 8,4.34314575 8,6 L7.99820112,6.1048763 L8,6.15469026 L8,10 C8,11.5976809 6.75108004,12.9036609 5.17627279,12.9949073 L5,13 L4.7513884,13 C3.23183855,13 2,11.7681615 2,10.2486116 C2,9.69632685 2.44771525,9.2486116 3,9.2486116 C3.51283584,9.2486116 3.93550716,9.63465179 3.99327227,10.1319905 L4,10.2486116 C4,10.6290103 4.28267621,10.9433864 4.64942945,10.9931407 L4.7513884,11 L5,11 C5.51283584,11 5.93550716,10.6139598 5.99327227,10.1166211 L6,10 L5.99991107,8.82932572 C5.68715728,8.93985718 5.35060219,9 5,9 C3.34314575,9 2,7.65685425 2,6 C2,4.34314575 3.34314575,3 5,3 Z M12.2512044,3 C13.7707542,3 15.0025928,4.23183855 15.0025928,5.7513884 C15.0025928,6.30367315 14.5548775,6.7513884 14.0025928,6.7513884 C13.489757,6.7513884 13.0670856,6.36534821 13.0093205,5.86800953 L13.0025928,5.7513884 C13.0025928,5.37098974 12.7199166,5.05661365 12.3531633,5.00685929 L12.2512044,5 L12.0025928,5 C11.489757,5 11.0670856,5.38604019 11.0093205,5.88337887 L11.0025928,6 L11.0026817,7.17067428 C11.3154355,7.06014282 11.6519906,7 12.0025928,7 C13.659447,7 15.0025928,8.34314575 15.0025928,10 C15.0025928,11.6568542 13.659447,13 12.0025928,13 C10.3457385,13 9.0025928,11.6568542 9.0025928,10 L9.00441213,9.89453033 L9.0025928,9.84530974 L9.0025928,6 C9.0025928,4.40231912 10.2515128,3.09633912 11.82632,3.00509269 L12.0025928,3 L12.2512044,3 Z M19,3 C20.5976809,3 21.9036609,4.24891996 21.9949073,5.82372721 L22,6 L22,10 C22,11.6568542 20.6568542,13 19,13 C17.4023191,13 16.0963391,11.75108 16.0050927,10.1762728 L16,10 L16,6 C16,4.34314575 17.3431458,3 19,3 Z M12.0025928,9 C11.450308,9 11.0025928,9.44771525 11.0025928,10 C11.0025928,10.5522847 11.450308,11 12.0025928,11 C12.5548775,11 13.0025928,10.5522847 13.0025928,10 C13.0025928,9.44771525 12.5548775,9 12.0025928,9 Z M19,5 C18.4871642,5 18.0644928,5.38604019 18.0067277,5.88337887 L18,6 L18,10 C18,10.5522847 18.4477153,11 19,11 C19.5128358,11 19.9355072,10.6139598 19.9932723,10.1166211 L20,10 L20,6 C20,5.44771525 19.5522847,5 19,5 Z M5,5 C4.44771525,5 4,5.44771525 4,6 C4,6.55228475 4.44771525,7 5,7 C5.55228475,7 6,6.55228475 6,6 C6,5.44771525 5.55228475,5 5,5 Z" id="🎨Color"> </path> </g> </g> </g></svg>',
            category: 'MECHANIC',
            onChange: () => {
                this.kxsClient.isFpsUncapped = !this.kxsClient.isFpsUncapped;
                this.kxsClient.setAnimationFrameCallback();
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(HUD, {
            label: `Winning Animation`,
            value: this.kxsClient.isWinningAnimationEnabled,
            icon: '<svg fill="#000000" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 448.881 448.881" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M189.82,138.531c-8.92,0-16.611,6.307-18.353,15.055l-11.019,55.306c-3.569,20.398-7.394,40.53-9.946,59.652h-0.513 c-2.543-19.122-5.35-37.474-9.176-57.615l-11.85-62.35c-1.112-5.832-6.206-10.048-12.139-10.048H95.819 c-5.854,0-10.909,4.114-12.099,9.853l-12.497,60.507c-4.332,21.159-8.414,41.805-11.213,60.413h-0.513 c-2.8-17.332-6.369-39.511-10.196-59.901l-10.024-54.643c-1.726-9.403-9.922-16.23-19.479-16.23c-6.05,0-11.774,2.77-15.529,7.52 c-3.755,4.751-5.133,10.965-3.733,16.851l32.747,137.944c1.322,5.568,6.299,9.503,12.022,9.503h22.878 c5.792,0,10.809-4.028,12.061-9.689l14.176-64.241c4.083-17.334,6.883-33.648,9.946-53.019h0.507 c2.037,19.627,4.845,35.685,8.157,53.019l12.574,63.96c1.136,5.794,6.222,9.97,12.125,9.97h22.325 c5.638,0,10.561-3.811,11.968-9.269l35.919-139.158c1.446-5.607,0.225-11.564-3.321-16.136 C201.072,141.207,195.612,138.531,189.82,138.531z"></path> <path d="M253.516,138.531c-10.763,0-19.495,8.734-19.495,19.503v132.821c0,10.763,8.732,19.495,19.495,19.495 c10.771,0,19.503-8.732,19.503-19.495V158.034C273.019,147.265,264.287,138.531,253.516,138.531z"></path> <path d="M431.034,138.531c-9.861,0-17.847,7.995-17.847,17.847v32.373c0,25.748,0.761,48.945,3.313,71.637h-0.763 c-7.652-19.379-17.847-40.786-28.041-58.891l-32.14-56.704c-2.193-3.865-6.299-6.26-10.747-6.26h-25.818 c-6.827,0-12.357,5.529-12.357,12.357v141.615c0,9.86,7.987,17.847,17.847,17.847c9.853,0,17.84-7.987,17.84-17.847v-33.905 c0-28.042-0.514-52.258-1.532-74.941l0.769-0.256c8.406,20.141,19.627,42.318,29.823,60.671l33.174,59.909 c2.177,3.927,6.321,6.369,10.809,6.369h21.159c6.828,0,12.357-5.53,12.357-12.357V156.378 C448.881,146.526,440.894,138.531,431.034,138.531z"></path> </g> </g></svg>',
            category: "HUD",
            type: "toggle",
            onChange: () => {
                this.kxsClient.isWinningAnimationEnabled = !this.kxsClient.isWinningAnimationEnabled;
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(HUD, {
            label: `KxsClient Logo`,
            value: this.kxsClient.isKxsClientLogoEnable,
            icon: '<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20,37.5c0-0.8-0.7-1.5-1.5-1.5h-15C2.7,36,2,36.7,2,37.5v11C2,49.3,2.7,50,3.5,50h15c0.8,0,1.5-0.7,1.5-1.5 V37.5z"></path> <path d="M8.1,22H3.2c-1,0-1.5,0.9-0.9,1.4l8,8.3c0.4,0.3,1,0.3,1.4,0l8-8.3c0.6-0.6,0.1-1.4-0.9-1.4h-4.7 c0-5,4.9-10,9.9-10V6C15,6,8.1,13,8.1,22z"></path> <path d="M41.8,20.3c-0.4-0.3-1-0.3-1.4,0l-8,8.3c-0.6,0.6-0.1,1.4,0.9,1.4h4.8c0,6-4.1,10-10.1,10v6 c9,0,16.1-7,16.1-16H49c1,0,1.5-0.9,0.9-1.4L41.8,20.3z"></path> <path d="M50,3.5C50,2.7,49.3,2,48.5,2h-15C32.7,2,32,2.7,32,3.5v11c0,0.8,0.7,1.5,1.5,1.5h15c0.8,0,1.5-0.7,1.5-1.5 V3.5z"></path> </g></svg>',
            category: "HUD",
            type: "toggle",
            onChange: () => {
                this.kxsClient.isKxsClientLogoEnable = !this.kxsClient.isKxsClientLogoEnable;
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(HUD, {
            label: `Spotify Player`,
            value: this.kxsClient.isSpotifyPlayerEnabled,
            icon: '<svg fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>spotify</title> <path d="M24.849 14.35c-3.206-1.616-6.988-2.563-10.991-2.563-2.278 0-4.484 0.306-6.58 0.881l0.174-0.041c-0.123 0.040-0.265 0.063-0.412 0.063-0.76 0-1.377-0.616-1.377-1.377 0-0.613 0.401-1.132 0.954-1.311l0.010-0.003c5.323-1.575 14.096-1.275 19.646 2.026 0.426 0.258 0.706 0.719 0.706 1.245 0 0.259-0.068 0.502-0.186 0.712l0.004-0.007c-0.29 0.345-0.721 0.563-1.204 0.563-0.273 0-0.529-0.070-0.752-0.192l0.008 0.004zM24.699 18.549c-0.201 0.332-0.561 0.55-0.971 0.55-0.225 0-0.434-0.065-0.61-0.178l0.005 0.003c-2.739-1.567-6.021-2.49-9.518-2.49-1.925 0-3.784 0.28-5.539 0.801l0.137-0.035c-0.101 0.032-0.217 0.051-0.337 0.051-0.629 0-1.139-0.51-1.139-1.139 0-0.509 0.333-0.939 0.793-1.086l0.008-0.002c1.804-0.535 3.878-0.843 6.023-0.843 3.989 0 7.73 1.064 10.953 2.925l-0.106-0.056c0.297 0.191 0.491 0.52 0.491 0.894 0 0.227-0.071 0.437-0.192 0.609l0.002-0.003zM22.899 22.673c-0.157 0.272-0.446 0.452-0.777 0.452-0.186 0-0.359-0.057-0.502-0.154l0.003 0.002c-2.393-1.346-5.254-2.139-8.299-2.139-1.746 0-3.432 0.261-5.020 0.745l0.122-0.032c-0.067 0.017-0.145 0.028-0.224 0.028-0.512 0-0.927-0.415-0.927-0.927 0-0.432 0.296-0.795 0.696-0.898l0.006-0.001c1.581-0.47 3.397-0.74 5.276-0.74 3.402 0 6.596 0.886 9.366 2.44l-0.097-0.050c0.302 0.15 0.506 0.456 0.506 0.809 0 0.172-0.048 0.333-0.132 0.469l0.002-0.004zM16 1.004c0 0 0 0-0 0-8.282 0-14.996 6.714-14.996 14.996s6.714 14.996 14.996 14.996c8.282 0 14.996-6.714 14.996-14.996v0c-0.025-8.272-6.724-14.971-14.993-14.996h-0.002z"></path> </g></svg>',
            category: "HUD",
            type: "toggle",
            onChange: () => {
                this.kxsClient.isSpotifyPlayerEnabled = !this.kxsClient.isSpotifyPlayerEnabled;
                this.kxsClient.updateLocalStorage();
                this.kxsClient.toggleSpotifyMenu();
            },
        });
        this.addOption(HUD, {
            label: "Brightness",
            value: this.kxsClient.brightness,
            icon: '<svg fill="#000000" viewBox="-5.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>light</title> <path d="M11.875 6v2.469c0 0.844-0.375 1.25-1.156 1.25s-1.156-0.406-1.156-1.25v-2.469c0-0.813 0.375-1.219 1.156-1.219s1.156 0.406 1.156 1.219zM14.219 9.25l1.438-2.031c0.469-0.625 1.063-0.75 1.656-0.313s0.656 1 0.188 1.688l-1.438 2c-0.469 0.688-1.031 0.75-1.656 0.313-0.594-0.438-0.656-0.969-0.188-1.656zM5.781 7.25l1.469 2c0.469 0.688 0.406 1.219-0.219 1.656-0.594 0.469-1.156 0.375-1.625-0.313l-1.469-2c-0.469-0.688-0.406-1.219 0.219-1.656 0.594-0.469 1.156-0.375 1.625 0.313zM10.719 11.125c2.688 0 4.875 2.188 4.875 4.875 0 2.656-2.188 4.813-4.875 4.813s-4.875-2.156-4.875-4.813c0-2.688 2.188-4.875 4.875-4.875zM1.594 11.813l2.375 0.75c0.781 0.25 1.063 0.719 0.813 1.469-0.219 0.75-0.75 0.969-1.563 0.719l-2.313-0.75c-0.781-0.25-1.063-0.75-0.844-1.5 0.25-0.719 0.75-0.938 1.531-0.688zM17.5 12.563l2.344-0.75c0.813-0.25 1.313-0.031 1.531 0.688 0.25 0.75-0.031 1.25-0.844 1.469l-2.313 0.781c-0.781 0.25-1.281 0.031-1.531-0.719-0.219-0.75 0.031-1.219 0.813-1.469zM10.719 18.688c1.5 0 2.719-1.219 2.719-2.688 0-1.5-1.219-2.719-2.719-2.719s-2.688 1.219-2.688 2.719c0 1.469 1.188 2.688 2.688 2.688zM0.906 17.969l2.344-0.75c0.781-0.25 1.313-0.063 1.531 0.688 0.25 0.75-0.031 1.219-0.813 1.469l-2.375 0.781c-0.781 0.25-1.281 0.031-1.531-0.719-0.219-0.75 0.063-1.219 0.844-1.469zM18.219 17.219l2.344 0.75c0.781 0.25 1.063 0.719 0.813 1.469-0.219 0.75-0.719 0.969-1.531 0.719l-2.344-0.781c-0.813-0.25-1.031-0.719-0.813-1.469 0.25-0.75 0.75-0.938 1.531-0.688zM3.938 23.344l1.469-1.969c0.469-0.688 1.031-0.781 1.625-0.313 0.625 0.438 0.688 0.969 0.219 1.656l-1.469 1.969c-0.469 0.688-1.031 0.813-1.656 0.375-0.594-0.438-0.656-1.031-0.188-1.719zM16.063 21.375l1.438 1.969c0.469 0.688 0.406 1.281-0.188 1.719s-1.188 0.281-1.656-0.344l-1.438-2c-0.469-0.688-0.406-1.219 0.188-1.656 0.625-0.438 1.188-0.375 1.656 0.313zM11.875 23.469v2.469c0 0.844-0.375 1.25-1.156 1.25s-1.156-0.406-1.156-1.25v-2.469c0-0.844 0.375-1.25 1.156-1.25s1.156 0.406 1.156 1.25z"></path> </g></svg>',
            category: "HUD",
            type: "slider",
            min: 20,
            max: 100,
            step: 1,
            onChange: (value) => {
                this.kxsClient.applyBrightness(value);
            },
        });
        this.addOption(HUD, {
            label: "Kill Feed Chroma",
            value: this.kxsClient.isKillFeedBlint,
            icon: `<svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g data-name="Layer 2" id="Layer_2"> <path d="M18,11a1,1,0,0,1-1,1,5,5,0,0,0-5,5,1,1,0,0,1-2,0,5,5,0,0,0-5-5,1,1,0,0,1,0-2,5,5,0,0,0,5-5,1,1,0,0,1,2,0,5,5,0,0,0,5,5A1,1,0,0,1,18,11Z"></path> <path d="M19,24a1,1,0,0,1-1,1,2,2,0,0,0-2,2,1,1,0,0,1-2,0,2,2,0,0,0-2-2,1,1,0,0,1,0-2,2,2,0,0,0,2-2,1,1,0,0,1,2,0,2,2,0,0,0,2,2A1,1,0,0,1,19,24Z"></path> <path d="M28,17a1,1,0,0,1-1,1,4,4,0,0,0-4,4,1,1,0,0,1-2,0,4,4,0,0,0-4-4,1,1,0,0,1,0-2,4,4,0,0,0,4-4,1,1,0,0,1,2,0,4,4,0,0,0,4,4A1,1,0,0,1,28,17Z"></path> </g> </g></svg>`,
            category: "HUD",
            type: "toggle",
            onChange: () => {
                this.kxsClient.isKillFeedBlint = !this.kxsClient.isKillFeedBlint;
                this.kxsClient.updateLocalStorage();
                this.kxsClient.hud.toggleKillFeed();
            },
        });
        this.addOption(SERVER, {
            label: `Rich Presence (Account token required)`,
            value: this.kxsClient.discordToken || "",
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.59 5.88997C17.36 5.31997 16.05 4.89997 14.67 4.65997C14.5 4.95997 14.3 5.36997 14.17 5.69997C12.71 5.47997 11.26 5.47997 9.83001 5.69997C9.69001 5.36997 9.49001 4.95997 9.32001 4.65997C7.94001 4.89997 6.63001 5.31997 5.40001 5.88997C2.92001 9.62997 2.25001 13.28 2.58001 16.87C4.23001 18.1 5.82001 18.84 7.39001 19.33C7.78001 18.8 8.12001 18.23 8.42001 17.64C7.85001 17.43 7.31001 17.16 6.80001 16.85C6.94001 16.75 7.07001 16.64 7.20001 16.54C10.33 18 13.72 18 16.81 16.54C16.94 16.65 17.07 16.75 17.21 16.85C16.7 17.16 16.15 17.42 15.59 17.64C15.89 18.23 16.23 18.8 16.62 19.33C18.19 18.84 19.79 18.1 21.43 16.87C21.82 12.7 20.76 9.08997 18.61 5.88997H18.59ZM8.84001 14.67C7.90001 14.67 7.13001 13.8 7.13001 12.73C7.13001 11.66 7.88001 10.79 8.84001 10.79C9.80001 10.79 10.56 11.66 10.55 12.73C10.55 13.79 9.80001 14.67 8.84001 14.67ZM15.15 14.67C14.21 14.67 13.44 13.8 13.44 12.73C13.44 11.66 14.19 10.79 15.15 10.79C16.11 10.79 16.87 11.66 16.86 12.73C16.86 13.79 16.11 14.67 15.15 14.67Z" fill="#000000"></path> </g></svg>',
            category: "SERVER",
            type: "input",
            placeholder: "Your discord account token",
            onChange: (value) => {
                value = value.toString().trim();
                this.kxsClient.discordToken = this.kxsClient.parseToken(value);
                this.kxsClient.discordRPC.disconnect();
                this.kxsClient.discordRPC.connect();
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(MECHANIC, {
            label: `Kill Leader Tracking`,
            icon: '<svg fill="#000000" viewBox="-4 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>crown</title> <path d="M12 10.938c-1.375 0-2.5-1.125-2.5-2.5 0-1.406 1.125-2.5 2.5-2.5s2.5 1.094 2.5 2.5c0 1.375-1.125 2.5-2.5 2.5zM2.031 9.906c1.094 0 1.969 0.906 1.969 2 0 1.125-0.875 2-1.969 2-1.125 0-2.031-0.875-2.031-2 0-1.094 0.906-2 2.031-2zM22.031 9.906c1.094 0 1.969 0.906 1.969 2 0 1.125-0.875 2-1.969 2-1.125 0-2.031-0.875-2.031-2 0-1.094 0.906-2 2.031-2zM4.219 23.719l-1.656-9.063c0.5-0.094 0.969-0.375 1.344-0.688 1.031 0.938 2.344 1.844 3.594 1.844 1.5 0 2.719-2.313 3.563-4.25 0.281 0.094 0.625 0.188 0.938 0.188s0.656-0.094 0.938-0.188c0.844 1.938 2.063 4.25 3.563 4.25 1.25 0 2.563-0.906 3.594-1.844 0.375 0.313 0.844 0.594 1.344 0.688l-1.656 9.063h-15.563zM3.875 24.5h16.25v1.531h-16.25v-1.531z"></path> </g></svg>',
            category: "MECHANIC",
            value: this.kxsClient.isKillLeaderTrackerEnabled,
            type: "toggle",
            onChange: (value) => {
                this.kxsClient.isKillLeaderTrackerEnabled = !this.kxsClient.isKillLeaderTrackerEnabled;
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(MECHANIC, {
            label: `Friends Detector (separe with ',')`,
            icon: '<svg fill="#000000" viewBox="0 -6 44 44" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M42.001,32.000 L14.010,32.000 C12.908,32.000 12.010,31.104 12.010,30.001 L12.010,28.002 C12.010,27.636 12.211,27.300 12.532,27.124 L22.318,21.787 C19.040,18.242 19.004,13.227 19.004,12.995 L19.010,7.002 C19.010,6.946 19.015,6.891 19.024,6.837 C19.713,2.751 24.224,0.007 28.005,0.007 C28.006,0.007 28.008,0.007 28.009,0.007 C31.788,0.007 36.298,2.749 36.989,6.834 C36.998,6.889 37.003,6.945 37.003,7.000 L37.006,12.994 C37.006,13.225 36.970,18.240 33.693,21.785 L43.479,27.122 C43.800,27.298 44.000,27.634 44.000,28.000 L44.000,30.001 C44.000,31.104 43.103,32.000 42.001,32.000 ZM31.526,22.880 C31.233,22.720 31.039,22.425 31.008,22.093 C30.978,21.761 31.116,21.436 31.374,21.226 C34.971,18.310 35.007,13.048 35.007,12.995 L35.003,7.089 C34.441,4.089 30.883,2.005 28.005,2.005 C25.126,2.006 21.570,4.091 21.010,7.091 L21.004,12.997 C21.004,13.048 21.059,18.327 24.636,21.228 C24.895,21.438 25.033,21.763 25.002,22.095 C24.972,22.427 24.778,22.722 24.485,22.882 L14.010,28.596 L14.010,30.001 L41.999,30.001 L42.000,28.595 L31.526,22.880 ZM18.647,2.520 C17.764,2.177 16.848,1.997 15.995,1.997 C13.116,1.998 9.559,4.083 8.999,7.083 L8.993,12.989 C8.993,13.041 9.047,18.319 12.625,21.220 C12.884,21.430 13.022,21.755 12.992,22.087 C12.961,22.419 12.767,22.714 12.474,22.874 L1.999,28.588 L1.999,29.993 L8.998,29.993 C9.550,29.993 9.997,30.441 9.997,30.993 C9.997,31.545 9.550,31.993 8.998,31.993 L1.999,31.993 C0.897,31.993 -0.000,31.096 -0.000,29.993 L-0.000,27.994 C-0.000,27.629 0.200,27.292 0.521,27.117 L10.307,21.779 C7.030,18.234 6.993,13.219 6.993,12.988 L6.999,6.994 C6.999,6.939 7.004,6.883 7.013,6.829 C7.702,2.744 12.213,-0.000 15.995,-0.000 C15.999,-0.000 16.005,-0.000 16.010,-0.000 C17.101,-0.000 18.262,0.227 19.369,0.656 C19.885,0.856 20.140,1.435 19.941,1.949 C19.740,2.464 19.158,2.720 18.647,2.520 Z"></path> </g></svg>',
            category: "MECHANIC",
            value: this.kxsClient.all_friends,
            type: "input",
            placeholder: "kisakay,iletal...",
            onChange: (value) => {
                this.kxsClient.all_friends = value;
                this.kxsClient.updateLocalStorage();
            },
        });
        this.addOption(HUD, {
            label: `Change Background`,
            icon: '<svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 179.006 179.006" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon style="fill:#010002;" points="20.884,116.354 11.934,116.354 11.934,32.818 137.238,32.818 137.238,41.768 149.172,41.768 149.172,20.884 0,20.884 0,128.288 20.884,128.288 "></polygon> <path style="fill:#010002;" d="M29.834,50.718v107.404h149.172V50.718H29.834z M123.58,136.856c-0.024,0-0.048,0-0.072,0 c-0.012,0-1.187,0-2.81,0c-3.795,0-10.078,0-10.114,0c-19.625,0-39.25,0-58.875,0v-3.473c0.907-0.859,2.005-1.551,3.168-2.166 c1.981-1.062,3.938-2.148,5.967-3.115c1.957-0.937,3.998-1.742,6.003-2.59c1.886-0.8,3.801-1.545,5.674-2.363 c0.328-0.137,0.638-0.489,0.776-0.811c0.424-1.05,0.782-2.124,1.116-3.216c0.245-0.823,0.412-1.635,1.468-1.862 c0.263-0.048,0.597-0.513,0.627-0.817c0.209-1.581,0.37-3.168,0.489-4.744c0.024-0.346-0.149-0.776-0.382-1.038 c-1.384-1.557-2.142-3.353-2.47-5.406c-0.161-1.038-0.74-1.993-1.038-3.013c-0.394-1.366-0.728-2.745-1.038-4.129 c-0.119-0.501-0.048-1.038-0.125-1.551c-0.125-0.746-0.107-1.319,0.806-1.611c0.233-0.084,0.442-0.668,0.453-1.032 c0.048-2.214,0.012-4.433,0.024-6.641c0.012-1.36,0-2.727,0.107-4.087c0.185-2.596,1.718-4.421,3.622-5.997 c2.787-2.303,6.128-3.377,9.565-4.189c1.808-0.424,3.64-0.68,5.478-0.979c0.489-0.078,0.996-0.006,1.498-0.006 c0.095,0.125,0.161,0.251,0.251,0.37c-0.376,0.28-0.811,0.513-1.134,0.847c-0.746,0.746-0.674,1.265,0.125,1.945 c1.647,1.396,3.318,2.804,4.911,4.254c1.42,1.271,1.969,2.942,1.981,4.815c0,3.222,0,6.45,0,9.672c0,0.65-0.048,1.313,0.776,1.605 c0.167,0.066,0.352,0.424,0.34,0.632c-0.131,1.641-0.322,3.294-0.489,4.941c-0.006,0.066-0.018,0.131-0.054,0.185 c-1.486,2.166-1.677,4.827-2.733,7.148c-0.048,0.09-0.078,0.191-0.125,0.257c-1.969,2.315-1.36,5.102-1.396,7.769 c0,0.269,0.197,0.686,0.406,0.782c0.806,0.358,1.002,1.044,1.223,1.772c0.352,1.14,0.692,2.303,1.181,3.389 c0.179,0.394,0.716,0.746,1.17,0.907c0.943,0.364,1.886,0.74,2.834,1.11c2.363-1.002,5.734-2.434,6.385-2.727 c0.919-0.418,1.611-1.349,2.44-1.993c0.37-0.28,0.817-0.537,1.259-0.615c1.504-0.239,2.16-0.77,2.518-2.255 c0.465-1.945,0.806-3.89,0.388-5.913c-0.167-0.877-0.489-1.45-1.366-1.784c-1.778-0.698-3.532-1.474-5.293-2.22 c-1.319-0.555-1.396-1.02-0.919-2.387c1.516-4.296,2.631-8.658,3.007-13.258c0.28-3.443,0.048-6.981,1.307-10.305 c0.871-2.339,2.339-4.505,4.696-5.203c1.796-0.531,3.359-1.742,5.269-1.999c0.358-0.018,0.674-0.072,1.026-0.054 c0.042,0.006,0.078,0.012,0.113,0.012c4.529,0.286,9.923,3.019,11.2,8.043c0.066,0.257,0.101,0.525,0.143,0.788h0.125 c0.698,2.852,0.621,5.818,0.859,8.712c0.37,4.594,1.504,8.962,3.019,13.264c0.477,1.366,0.394,1.832-0.919,2.381 c-1.76,0.746-3.514,1.522-5.299,2.22c-0.871,0.34-1.181,0.895-1.36,1.784c-0.406,2.029-0.084,3.968,0.388,5.913 c0.346,1.48,1.014,2.011,2.512,2.25c0.442,0.078,0.883,0.334,1.259,0.615c0.829,0.644,1.516,1.569,2.44,1.993 c3.234,1.468,6.51,2.888,9.839,4.117c5.114,1.88,8.509,5.478,9.326,11.045C145.944,136.856,134.768,136.856,123.58,136.856z"></path> </g> </g> </g></svg>',
            category: "HUD",
            value: true,
            type: "click",
            onChange: () => {
                const backgroundElement = document.getElementById("background");
                if (!backgroundElement) {
                    alert("Element with id 'background' not found.");
                    return;
                }
                const choice = prompt("Enter '0' to default Kxs background, '1' to provide a URL or '2' to upload a local image:");
                if (choice === "0") {
                    localStorage.removeItem("lastBackgroundUrl");
                    localStorage.removeItem("lastBackgroundFile");
                    localStorage.removeItem("lastBackgroundType");
                    localStorage.removeItem("lastBackgroundValue");
                    backgroundElement.style.backgroundImage = `url(${background_image})`;
                }
                else if (choice === "1") {
                    const newBackgroundUrl = prompt("Enter the URL of the new background image:");
                    if (newBackgroundUrl) {
                        backgroundElement.style.backgroundImage = `url(${newBackgroundUrl})`;
                        this.kxsClient.saveBackgroundToLocalStorage(newBackgroundUrl);
                        alert("Background updated successfully!");
                    }
                }
                else if (choice === "2") {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.onchange = (event) => {
                        var _a, _b;
                        const file = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                backgroundElement.style.backgroundImage = `url(${reader.result})`;
                                this.kxsClient.saveBackgroundToLocalStorage(file);
                                alert("Background updated successfully!");
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    fileInput.click();
                }
            },
        });
    }
    createOptionCard(option, container) {
        const optionCard = document.createElement("div");
        Object.assign(optionCard.style, {
            background: "rgba(31, 41, 55, 0.8)",
            borderRadius: "10px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            minHeight: "150px",
        });
        const iconContainer = document.createElement("div");
        Object.assign(iconContainer.style, {
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px"
        });
        iconContainer.innerHTML = option.icon || '';
        const title = document.createElement("div");
        title.textContent = option.label;
        title.style.fontSize = "16px";
        title.style.textAlign = "center";
        let control = null;
        switch (option.type) {
            case "info":
                control = this.createInfoElement(option);
                break;
            case "input":
                control = this.createInputElement(option);
                break;
            case "toggle":
                control = this.createToggleButton(option);
                break;
            case "sub":
                control = this.createSubButton(option);
                break;
            case "slider":
                control = this.createSliderElement(option);
                break;
            case "click":
                control = this.createClickButton(option);
        }
        optionCard.appendChild(iconContainer);
        optionCard.appendChild(title);
        optionCard.appendChild(control);
        container.appendChild(optionCard);
    }
    setActiveCategory(category) {
        this.activeCategory = category;
        this.filterOptions();
        // Update button styles
        this.menu.querySelectorAll('.category-btn').forEach(btn => {
            const btnCategory = btn.dataset.category;
            btn.style.background =
                btnCategory === category ? '#3B82F6' : 'rgba(55, 65, 81, 0.8)';
        });
    }
    filterOptions() {
        const gridContainer = document.getElementById('kxsMenuGrid');
        if (gridContainer) {
            // Clear existing content
            gridContainer.innerHTML = '';
            // Get unique options based on category and search term
            const displayedOptions = new Set();
            this.sections.forEach(section => {
                if (this.activeCategory === 'ALL' || section.category === this.activeCategory) {
                    section.options.forEach(option => {
                        // Create a unique key for each option
                        const optionKey = `${option.label}-${option.category}`;
                        // Check if option matches search term
                        const matchesSearch = this.searchTerm === '' ||
                            option.label.toLowerCase().includes(this.searchTerm) ||
                            option.category.toLowerCase().includes(this.searchTerm);
                        if (!displayedOptions.has(optionKey) && matchesSearch) {
                            displayedOptions.add(optionKey);
                            this.createOptionCard(option, gridContainer);
                        }
                    });
                }
            });
            // Show a message if no options match the search
            if (displayedOptions.size === 0 && this.searchTerm !== '') {
                const noResultsMsg = document.createElement('div');
                noResultsMsg.textContent = `No results found for "${this.searchTerm}"`;
                noResultsMsg.style.gridColumn = '1 / -1';
                noResultsMsg.style.textAlign = 'center';
                noResultsMsg.style.padding = '20px';
                noResultsMsg.style.color = '#9CA3AF';
                gridContainer.appendChild(noResultsMsg);
            }
        }
    }
    createGridContainer() {
        const gridContainer = document.createElement("div");
        const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
        Object.assign(gridContainer.style, {
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
            gap: isMobile ? "5px" : "16px",
            padding: isMobile ? "2px" : "16px",
            gridAutoRows: isMobile ? "minmax(38px, auto)" : "minmax(150px, auto)",
            overflowY: "auto",
            overflowX: "hidden", // Prevent horizontal scrolling
            maxHeight: isMobile ? "28vh" : "calc(3 * 150px + 2 * 16px)",
            width: "100%",
            boxSizing: "border-box" // Include padding in width calculation
        });
        gridContainer.id = "kxsMenuGrid";
        this.menu.appendChild(gridContainer);
    }
    addOption(section, option) {
        section.options.push(option);
        // Store all options for searching
        this.allOptions.push(option);
    }
    addSection(title, category = "ALL") {
        const section = {
            title,
            options: [],
            category
        };
        const sectionElement = document.createElement("div");
        sectionElement.className = "menu-section";
        sectionElement.style.display = this.activeCategory === "ALL" || this.activeCategory === category ? "block" : "none";
        section.element = sectionElement;
        this.sections.push(section);
        this.menu.appendChild(sectionElement);
        return section;
    }
    createToggleButton(option) {
        const btn = document.createElement("button");
        const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
        Object.assign(btn.style, {
            width: "100%",
            padding: isMobile ? "2px 0px" : "8px",
            height: isMobile ? "24px" : "auto",
            background: option.value ? "#059669" : "#DC2626",
            border: "none",
            borderRadius: isMobile ? "3px" : "6px",
            color: "white",
            cursor: "pointer",
            transition: "background 0.2s",
            fontSize: isMobile ? "9px" : "14px",
            fontWeight: "bold",
            minHeight: isMobile ? "20px" : "unset",
            letterSpacing: isMobile ? "0.5px" : "1px"
        });
        btn.textContent = option.value ? "ENABLED" : "DISABLED";
        btn.addEventListener("click", () => {
            var _a;
            const newValue = !option.value;
            option.value = newValue;
            btn.textContent = newValue ? "ENABLED" : "DISABLED";
            btn.style.background = newValue ? "#059669" : "#DC2626";
            (_a = option.onChange) === null || _a === void 0 ? void 0 : _a.call(option, newValue);
        });
        this.blockMousePropagation(btn);
        return btn;
    }
    createClickButton(option) {
        const btn = document.createElement("button");
        const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
        Object.assign(btn.style, {
            width: "100%",
            padding: isMobile ? "2px 0px" : "8px",
            height: isMobile ? "24px" : "auto",
            background: "#3B82F6",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            transition: "background 0.2s",
            fontSize: "14px",
            fontWeight: "bold"
        });
        btn.textContent = option.label;
        btn.addEventListener("click", () => {
            var _a;
            (_a = option.onChange) === null || _a === void 0 ? void 0 : _a.call(option, true);
        });
        this.blockMousePropagation(btn);
        return btn;
    }
    addShiftListener() {
        // Gestionnaire pour la touche Shift (ouverture du menu)
        window.addEventListener("keydown", (event) => {
            if (event.key === "Shift" && event.location == 2) {
                this.clearMenu();
                this.toggleMenuVisibility();
                // Ensure options are displayed after loading
                this.filterOptions();
            }
        });
        // Gestionnaire séparé pour la touche Échap avec capture en phase de capture
        // pour intercepter l'événement avant qu'il n'atteigne le jeu
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && this.isClientMenuVisible) {
                // Fermer le menu si la touche Échap est pressée et que le menu est visible
                this.toggleMenuVisibility();
                // Empêcher la propagation ET l'action par défaut
                event.stopPropagation();
                event.preventDefault();
                // Arrêter la propagation de l'événement
                return false;
            }
        }, true); // true = phase de capture
    }
    createInputElement(option) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = String(option.value);
        if (option.placeholder) {
            input.placeholder = option.placeholder;
        }
        Object.assign(input.style, {
            width: "100%",
            padding: "8px",
            background: "rgba(55, 65, 81, 0.8)",
            border: "none",
            borderRadius: "6px",
            color: "#FFAE00",
            fontSize: "14px"
        });
        input.addEventListener("change", () => {
            var _a;
            option.value = input.value;
            (_a = option.onChange) === null || _a === void 0 ? void 0 : _a.call(option, input.value);
        });
        // Empêcher la propagation des touches de texte vers la page web
        // mais permettre l'interaction avec l'input
        input.addEventListener("keydown", (e) => {
            // Ne pas arrêter la propagation des touches de navigation (flèches, tab, etc.)
            // qui sont nécessaires pour naviguer dans le champ de texte
            e.stopPropagation();
        });
        input.addEventListener("keyup", (e) => {
            e.stopPropagation();
        });
        input.addEventListener("keypress", (e) => {
            e.stopPropagation();
        });
        this.blockMousePropagation(input);
        return input;
    }
    createSliderElement(option) {
        const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
        const container = document.createElement("div");
        Object.assign(container.style, {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: isMobile ? "3px" : "5px",
        });
        // Conteneur pour le slider et la valeur
        const sliderContainer = document.createElement("div");
        Object.assign(sliderContainer.style, {
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: isMobile ? "8px" : "12px",
        });
        // Wrapper du slider pour gérer la couleur de fond
        const sliderWrapper = document.createElement("div");
        Object.assign(sliderWrapper.style, {
            position: "relative",
            width: "100%",
            height: isMobile ? "10px" : "12px",
            background: "rgba(30, 35, 45, 0.5)",
            borderRadius: "6px",
            overflow: "hidden",
            border: "1px solid rgba(59, 130, 246, 0.25)",
        });
        // Barre de progression bleue
        const progressBar = document.createElement("div");
        Object.assign(progressBar.style, {
            position: "absolute",
            left: "0",
            top: "0",
            height: "100%",
            width: `${((Number(option.value) - (option.min || 0)) / ((option.max || 100) - (option.min || 0))) * 100}%`,
            background: "#3B82F6", // Couleur bleue pleine
            borderRadius: "6px 0 0 6px", // Arrondi uniquement à gauche
            transition: "width 0.1s ease-out",
        });
        // Créer le slider
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = String(option.min || 0);
        slider.max = String(option.max || 100);
        slider.step = String(option.step || 1);
        slider.value = String(option.value);
        slider.className = "kxs-minimal-slider";
        Object.assign(slider.style, {
            position: "absolute",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            margin: "0",
            appearance: "none",
            background: "transparent", // Transparent pour voir la barre de progression
            cursor: "pointer",
            outline: "none",
            border: "none",
            zIndex: "2", // Au-dessus de la barre de progression
        });
        // Valeur actuelle avec style simple
        const valueDisplay = document.createElement("div");
        valueDisplay.textContent = String(option.value);
        Object.assign(valueDisplay.style, {
            minWidth: isMobile ? "28px" : "36px",
            textAlign: "center",
            color: "#ffffff",
            fontSize: isMobile ? "11px" : "13px",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            background: "rgba(59, 130, 246, 0.1)",
            padding: isMobile ? "2px 4px" : "3px 6px",
            borderRadius: "4px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            transition: "all 0.15s ease-out",
        });
        // Styles personnalisés pour le curseur du slider uniquement
        const sliderStyles = `
			/* Style du curseur */
			.kxs-minimal-slider::-webkit-slider-thumb {
				appearance: none;
				width: ${isMobile ? "14px" : "16px"};
				height: ${isMobile ? "14px" : "16px"};
				border-radius: 50%;
				background: linear-gradient(135deg, #4f8bf9, #3B82F6);
				cursor: pointer;
				border: none;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
				transition: background 0.2s, transform 0.1s;
				z-index: 3;
			}

			.kxs-minimal-slider::-moz-range-thumb {
				width: ${isMobile ? "14px" : "16px"};
				height: ${isMobile ? "14px" : "16px"};
				border-radius: 50%;
				background: linear-gradient(135deg, #4f8bf9, #3B82F6);
				cursor: pointer;
				border: none;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
				transition: background 0.2s, transform 0.1s;
				z-index: 3;
			}

			/* Masquer la piste par défaut */
			.kxs-minimal-slider::-webkit-slider-runnable-track {
				background: transparent;
				height: 100%;
			}

			.kxs-minimal-slider::-moz-range-track {
				background: transparent;
				height: 100%;
			}

			/* Effets au survol */
			.kxs-minimal-slider:hover::-webkit-slider-thumb {
				background: linear-gradient(135deg, #5a93fa, #4289f7);
				transform: scale(1.05);
			}

			.kxs-minimal-slider:hover::-moz-range-thumb {
				background: linear-gradient(135deg, #5a93fa, #4289f7);
				transform: scale(1.05);
			}
		`;
        // Ajouter les styles personnalisés
        const style = document.createElement("style");
        style.textContent = sliderStyles;
        document.head.appendChild(style);
        // Ajouter les gestionnaires d'événements
        slider.addEventListener("input", () => {
            var _a;
            // Mettre à jour la valeur affichée
            valueDisplay.textContent = slider.value;
            // Mettre à jour la largeur de la barre de progression
            const percentage = ((Number(slider.value) - (option.min || 0)) / ((option.max || 100) - (option.min || 0))) * 100;
            progressBar.style.width = `${percentage}%`;
            // Mettre à jour la valeur de l'option
            option.value = Number(slider.value);
            (_a = option.onChange) === null || _a === void 0 ? void 0 : _a.call(option, Number(slider.value));
            // Effet visuel sur la valeur
            valueDisplay.style.background = "rgba(59, 130, 246, 0.25)";
            setTimeout(() => {
                valueDisplay.style.background = "rgba(59, 130, 246, 0.1)";
            }, 150);
        });
        // Empêcher les événements de se propager vers le jeu
        slider.addEventListener("mousedown", (e) => e.stopPropagation());
        slider.addEventListener("mouseup", (e) => e.stopPropagation());
        this.blockMousePropagation(slider, false);
        // Assembler tous les éléments
        sliderWrapper.appendChild(progressBar);
        sliderWrapper.appendChild(slider);
        sliderContainer.appendChild(sliderWrapper);
        sliderContainer.appendChild(valueDisplay);
        container.appendChild(sliderContainer);
        return container;
    }
    createInfoElement(option) {
        const info = document.createElement("div");
        info.textContent = String(option.value);
        Object.assign(info.style, {
            color: "#b0b0b0",
            fontSize: "12px",
            fontStyle: "italic",
            marginTop: "2px",
            marginLeft: "6px",
            marginBottom: "2px",
            flex: "1 1 100%",
            whiteSpace: "pre-line"
        });
        this.blockMousePropagation(info);
        return info;
    }
    // Crée un bouton pour ouvrir un sous-menu de configuration de mode
    createSubButton(option) {
        const btn = document.createElement("button");
        const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
        // Styles pour le bouton de sous-menu (gris par défaut)
        Object.assign(btn.style, {
            width: "100%",
            padding: isMobile ? "2px 0px" : "8px",
            height: isMobile ? "24px" : "auto",
            background: "#6B7280", // Couleur grise par défaut
            border: "none",
            borderRadius: isMobile ? "3px" : "6px",
            color: "white",
            cursor: "pointer",
            transition: "background 0.2s",
            fontSize: isMobile ? "9px" : "14px",
            fontWeight: "bold",
            minHeight: isMobile ? "20px" : "unset",
            letterSpacing: isMobile ? "0.5px" : "1px"
        });
        btn.textContent = "CONFIGURE";
        // Variables pour le sous-menu
        let subMenuContainer = null;
        // Sauvegarde des éléments originaux à masquer/afficher
        let originalElements = [];
        let isSubMenuOpen = false;
        // Gestionnaire d'événement pour ouvrir le sous-menu
        btn.addEventListener("click", () => {
            // Si aucun champ n'est défini, ne rien faire
            if (!option.fields || option.fields.length === 0) {
                if (option.onChange) {
                    option.onChange(option.value);
                }
                return;
            }
            // Si le sous-menu est déjà ouvert, le fermer
            if (isSubMenuOpen) {
                this.closeSubMenu();
                return;
            }
            // Trouver tous les éléments principaux à masquer
            originalElements = [];
            const allSections = document.querySelectorAll('.menu-section');
            allSections.forEach(section => {
                originalElements.push(section);
                section.style.display = 'none';
            });
            // Masquer aussi le conteneur de la grille
            const grid = document.getElementById('kxsMenuGrid');
            if (grid) {
                originalElements.push(grid);
                grid.style.display = 'none';
            }
            // Créer le conteneur du sous-menu
            subMenuContainer = document.createElement("div");
            subMenuContainer.id = "kxs-submenu";
            subMenuContainer.className = "kxs-submenu-container";
            Object.assign(subMenuContainer.style, {
                width: "100%",
                padding: "10px 0",
                boxSizing: "border-box",
                overflowY: "auto",
                background: "rgba(17, 24, 39, 0.95)"
            });
            this.blockMousePropagation(subMenuContainer);
            // Créer l'en-tête du sous-menu
            const subMenuHeader = document.createElement("div");
            Object.assign(subMenuHeader.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: isMobile ? "10px" : "15px",
                paddingBottom: isMobile ? "5px" : "10px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                paddingLeft: isMobile ? "10px" : "15px",
                paddingRight: isMobile ? "10px" : "15px",
                width: "100%",
                boxSizing: "border-box"
            });
            this.blockMousePropagation(subMenuHeader);
            // Bouton de retour
            const backBtn = document.createElement("button");
            backBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M15 19L8 12L15 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg> Back`;
            Object.assign(backBtn.style, {
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px",
                fontSize: isMobile ? "12px" : "14px"
            });
            this.blockMousePropagation(backBtn);
            // Titre du sous-menu
            const subMenuTitle = document.createElement("h3");
            subMenuTitle.textContent = option.label;
            Object.assign(subMenuTitle.style, {
                margin: "0",
                color: "#fff",
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "bold",
                textAlign: "center",
                flex: "1"
            });
            this.blockMousePropagation(subMenuTitle);
            // Ajouter l'événement au bouton retour pour fermer le sous-menu
            backBtn.addEventListener("click", () => {
                this.closeSubMenu();
            });
            // Assembler l'en-tête
            subMenuHeader.appendChild(backBtn);
            subMenuHeader.appendChild(subMenuTitle);
            subMenuHeader.appendChild(document.createElement("div")); // Espace vide pour l'équilibre
            subMenuContainer.appendChild(subMenuHeader);
            // Créer la grille pour les options
            const optionsGrid = document.createElement("div");
            Object.assign(optionsGrid.style, {
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                gap: isMobile ? "8px" : "16px",
                padding: isMobile ? "4px" : "16px",
                gridAutoRows: isMobile ? "minmax(100px, auto)" : "minmax(150px, auto)",
                width: "100%",
                boxSizing: "border-box"
            });
            this.blockMousePropagation(optionsGrid);
            // Créer les cartes pour chaque option
            option.fields.forEach(mod => {
                this.createModCard(mod, optionsGrid);
            });
            subMenuContainer.appendChild(optionsGrid);
            // Ajouter le sous-menu au menu principal
            this.menu.appendChild(subMenuContainer);
            isSubMenuOpen = true;
            // Définir la méthode pour fermer le sous-menu
            this.closeSubMenu = () => {
                // Supprimer le sous-menu
                if (subMenuContainer && subMenuContainer.parentElement) {
                    subMenuContainer.parentElement.removeChild(subMenuContainer);
                }
                // Réafficher tous les éléments originaux
                originalElements.forEach(el => {
                    if (el.id === 'kxsMenuGrid') {
                        el.style.display = 'grid';
                    }
                    else {
                        el.style.display = 'block';
                    }
                });
                // Réinitialiser les états
                this.filterOptions(); // S'assurer que les options sont correctement filtrées
                subMenuContainer = null;
                isSubMenuOpen = false;
            };
            // Appeler le callback si défini
            if (option.onChange) {
                option.onChange(option.value);
            }
        });
        this.blockMousePropagation(btn);
        return btn;
    }
    // Crée une carte pour un mod dans le sous-menu
    createModCard(mod, container) {
        const modCard = document.createElement("div");
        const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
        Object.assign(modCard.style, {
            background: "rgba(31, 41, 55, 0.8)",
            borderRadius: "10px",
            padding: isMobile ? "10px" : "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isMobile ? "8px" : "12px",
            minHeight: isMobile ? "100px" : "150px",
        });
        // Icône
        const iconContainer = document.createElement("div");
        Object.assign(iconContainer.style, {
            width: isMobile ? "32px" : "48px",
            height: isMobile ? "32px" : "48px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: isMobile ? "4px" : "8px"
        });
        iconContainer.innerHTML = mod.icon || '';
        // Titre
        const title = document.createElement("div");
        title.textContent = mod.label;
        title.style.fontSize = isMobile ? "14px" : "16px";
        title.style.textAlign = "center";
        // Contrôle selon le type
        let control = null;
        switch (mod.type) {
            case "info":
                control = this.createInfoElement(mod);
                break;
            case "input":
                control = this.createInputElement(mod);
                break;
            case "toggle":
                control = this.createToggleButton(mod);
                break;
            case "slider":
                control = this.createSliderElement(mod);
                break;
            case "click":
                control = this.createClickButton(mod);
        }
        modCard.appendChild(iconContainer);
        modCard.appendChild(title);
        if (control) {
            modCard.appendChild(control);
        }
        container.appendChild(modCard);
        this.blockMousePropagation(modCard);
    }
    addDragListeners() {
        this.menu.addEventListener('mousedown', (e) => {
            // Ne pas arrêter la propagation si l'événement vient d'un élément interactif
            if (e.target instanceof HTMLElement &&
                e.target.matches("input, select, button, svg, path")) {
                // Laisser l'événement se propager aux éléments interactifs
                return;
            }
            // Empêcher la propagation de l'événement mousedown vers la page web
            e.stopPropagation();
            // Activer le drag & drop seulement si on clique sur une zone non interactive
            if (e.target instanceof HTMLElement &&
                !e.target.matches("input, select, button, svg, path")) {
                this.isDragging = true;
                const rect = this.menu.getBoundingClientRect();
                this.dragOffset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                this.menu.style.cursor = "grabbing";
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;
                this.menu.style.transform = 'none';
                this.menu.style.left = `${x}px`;
                this.menu.style.top = `${y}px`;
            }
        });
        document.addEventListener('mouseup', (e) => {
            // Arrêter le drag & drop
            const wasDragging = this.isDragging;
            this.isDragging = false;
            this.menu.style.cursor = "grab";
            // Empêcher la propagation de l'événement mouseup vers la page web
            // seulement si l'événement vient du menu et n'est pas un élément interactif
            if (this.menu.contains(e.target)) {
                if (wasDragging || !(e.target instanceof HTMLElement && e.target.matches("input, select, button, svg, path"))) {
                    e.stopPropagation();
                }
            }
        });
    }
    toggleMenuVisibility() {
        this.isClientMenuVisible = !this.isClientMenuVisible;
        // Mettre à jour la propriété publique en même temps
        this.isOpen = this.isClientMenuVisible;
        if (this.kxsClient.isNotifyingForToggleMenu) {
            this.kxsClient.nm.showNotification(this.isClientMenuVisible ? "Opening menu..." : "Closing menu...", "info", 1100);
        }
        this.menu.style.display = this.isClientMenuVisible ? "block" : "none";
        // If opening the menu, make sure to display options
        if (this.isClientMenuVisible) {
            this.filterOptions();
        }
    }
    destroy() {
        // Remove global event listeners
        window.removeEventListener("keydown", this.shiftListener);
        document.removeEventListener('mousemove', this.mouseMoveListener);
        document.removeEventListener('mouseup', this.mouseUpListener);
        // Supprimer tous les écouteurs d'événements keydown du document
        // Nous ne pouvons pas supprimer directement l'écouteur anonyme, mais ce n'est pas grave
        // car la vérification isClientMenuVisible empêchera toute action une fois le menu détruit
        // Remove all event listeners from menu elements
        const removeAllListeners = (element) => {
            var _a;
            const clone = element.cloneNode(true);
            (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(clone, element);
        };
        // Clean up all buttons and inputs in the menu
        this.menu.querySelectorAll('button, input').forEach(element => {
            removeAllListeners(element);
        });
        // Remove the menu from DOM
        this.menu.remove();
        // Clear all sections
        this.sections.forEach(section => {
            if (section.element) {
                removeAllListeners(section.element);
                section.element.remove();
                delete section.element;
            }
            section.options = [];
        });
        this.sections = [];
        // Reset all class properties
        this.isClientMenuVisible = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.activeCategory = "ALL";
        // Clear references
        this.menu = null;
        this.kxsClient = null;
    }
    getMenuVisibility() {
        return this.isClientMenuVisible;
    }
}


;// ./src/SERVER/Ping.ts
class PingTest {
    constructor() {
        this.ping = 0;
        this.ws = null;
        this.sendTime = 0;
        this.retryCount = 0;
        this.isConnecting = false;
        this.isWebSocket = true;
        this.url = "";
        this.region = "";
        this.hasPing = false;
        this.reconnectTimer = null;
        this.keepAliveTimer = null;
        this.connectionCheckTimer = null;
        this.ptcDataBuf = new ArrayBuffer(1);
        this.waitForServerSelectElements();
        this.startKeepAlive();
    }
    startKeepAlive() {
        // Annuler l'ancien timer si existant
        if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
        }
        this.keepAliveTimer = setInterval(() => {
            var _a, _b, _c;
            if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
                this.ws.send(this.ptcDataBuf);
            }
            else if (((_b = this.ws) === null || _b === void 0 ? void 0 : _b.readyState) === WebSocket.CLOSED || ((_c = this.ws) === null || _c === void 0 ? void 0 : _c.readyState) === WebSocket.CLOSING) {
                // Redémarrer la connexion si elle est fermée
                this.restart();
            }
        }, 5000); // envoie toutes les 5s
    }
    waitForServerSelectElements() {
        const checkInterval = setInterval(() => {
            const teamSelect = document.getElementById("team-server-select");
            const mainSelect = document.getElementById("server-select-main");
            const selectedValue = (teamSelect === null || teamSelect === void 0 ? void 0 : teamSelect.value) || (mainSelect === null || mainSelect === void 0 ? void 0 : mainSelect.value);
            if ((teamSelect || mainSelect) && selectedValue) {
                clearInterval(checkInterval);
                this.setServerFromDOM();
                this.attachRegionChangeListener();
            }
        }, 100); // Vérifie toutes les 100ms
    }
    setServerFromDOM() {
        const selectedServer = this.detectSelectedServer();
        if (!selectedServer)
            return;
        const { region, url } = selectedServer;
        this.region = region;
        this.url = `wss://${url}/ptc`;
        this.start();
    }
    detectSelectedServer() {
        const currentUrl = window.location.href;
        const isSpecialUrl = /\/#\w+/.test(currentUrl);
        const teamSelectElement = document.getElementById("team-server-select");
        const mainSelectElement = document.getElementById("server-select-main");
        const region = isSpecialUrl && teamSelectElement
            ? teamSelectElement.value
            : (mainSelectElement === null || mainSelectElement === void 0 ? void 0 : mainSelectElement.value) || "NA";
        const servers = [
            { region: "NA", url: "usr.mathsiscoolfun.com:8001" },
            { region: "EU", url: "eur.mathsiscoolfun.com:8001" },
            { region: "Asia", url: "asr.mathsiscoolfun.com:8001" },
            { region: "SA", url: "sa.mathsiscoolfun.com:8001" },
        ];
        const selectedServer = servers.find((s) => s.region.toUpperCase() === region.toUpperCase());
        if (!selectedServer)
            return undefined;
        return selectedServer;
    }
    attachRegionChangeListener() {
        const teamSelectElement = document.getElementById("team-server-select");
        const mainSelectElement = document.getElementById("server-select-main");
        const onChange = () => {
            const selectedServer = this.detectSelectedServer();
            if (!selectedServer)
                return;
            const { region } = selectedServer;
            if (region !== this.region) {
                this.restart();
            }
        };
        teamSelectElement === null || teamSelectElement === void 0 ? void 0 : teamSelectElement.addEventListener("change", onChange);
        mainSelectElement === null || mainSelectElement === void 0 ? void 0 : mainSelectElement.addEventListener("change", onChange);
    }
    start() {
        if (this.isConnecting)
            return;
        this.isConnecting = true;
        this.startWebSocketPing();
        // Vérifier régulièrement l'état de la connexion
        this.startConnectionCheck();
    }
    startConnectionCheck() {
        // Annuler l'ancien timer si existant
        if (this.connectionCheckTimer) {
            clearInterval(this.connectionCheckTimer);
        }
        // Vérifier l'état de la connexion toutes les 10 secondes
        this.connectionCheckTimer = setInterval(() => {
            // Si on n'a pas de ping valide ou que la connexion est fermée, on tente de reconnecter
            if (!this.hasPing || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.restart();
            }
        }, 10000);
    }
    startWebSocketPing() {
        if (this.ws || !this.url)
            return;
        const ws = new WebSocket(this.url);
        ws.binaryType = "arraybuffer";
        ws.onopen = () => {
            this.ws = ws;
            this.retryCount = 0;
            this.isConnecting = false;
            this.sendPing();
            setTimeout(() => {
                var _a;
                if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) !== WebSocket.OPEN) {
                    this.restart();
                }
            }, 3000); // 3s pour sécuriser
        };
        ws.onmessage = () => {
            this.hasPing = true;
            const elapsed = (Date.now() - this.sendTime) / 1e3;
            this.ping = Math.round(elapsed * 1000);
            setTimeout(() => this.sendPing(), 1000);
        };
        ws.onerror = (error) => {
            this.ping = 0;
            this.hasPing = false;
            this.retryCount++;
            // Tentative immédiate mais avec backoff exponentiel
            const retryDelay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 10000);
            // Annuler tout timer de reconnexion existant
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
            }
            this.reconnectTimer = setTimeout(() => {
                this.ws = null; // S'assurer que l'ancienne connexion est effacée
                this.startWebSocketPing();
            }, retryDelay);
        };
        ws.onclose = (event) => {
            this.hasPing = false;
            this.ws = null;
            this.isConnecting = false;
            // Tentative de reconnexion après une fermeture
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
            }
            this.reconnectTimer = setTimeout(() => {
                this.start();
            }, 2000); // Attendre 2 secondes avant de reconnecter
        };
    }
    sendPing() {
        var _a, _b;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.sendTime = Date.now();
            this.ws.send(this.ptcDataBuf);
        }
        else if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.CLOSED || ((_b = this.ws) === null || _b === void 0 ? void 0 : _b.readyState) === WebSocket.CLOSING) {
            // Si la WebSocket est fermée au moment d'envoyer le ping, on tente de reconnecter
            this.restart();
        }
    }
    stop() {
        // Annuler tous les timers
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
        }
        if (this.connectionCheckTimer) {
            clearInterval(this.connectionCheckTimer);
            this.connectionCheckTimer = null;
        }
        if (this.ws) {
            this.ws.onclose = null;
            this.ws.onerror = null;
            this.ws.onmessage = null;
            this.ws.onopen = null;
            this.ws.close();
            this.ws = null;
        }
        this.isConnecting = false;
        this.retryCount = 0;
        this.hasPing = false;
    }
    restart() {
        this.stop();
        setTimeout(() => {
            this.setServerFromDOM();
        }, 500); // Petit délai pour éviter les problèmes de rebond
    }
    /**
     * Retourne le ping actuel. Ne touche jamais à la websocket ici !
     * Si le ping n'est pas dispo, retourne -1 (jamais null).
     * La reconnexion doit être gérée ailleurs (timer, event, etc).
     */
    getPingResult() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN && this.hasPing) {
            return {
                region: this.region,
                ping: this.ping,
            };
        }
        else {
            // Si on détecte un problème ici, planifier une reconnexion
            if (!this.reconnectTimer && (!this.ws || this.ws.readyState !== WebSocket.CONNECTING)) {
                this.reconnectTimer = setTimeout(() => this.restart(), 1000);
            }
            return {
                region: this.region,
                ping: -1, // -1 indique que le ping n'est pas dispo, mais jamais null
            };
        }
    }
}


;// ./src/HUD/ClientHUD.ts

class KxsClientHUD {
    constructor(kxsClient) {
        this.healthAnimations = [];
        this.lastHealthValue = 100;
        this.hudOpacityObservers = [];
        this.weaponBorderObservers = [];
        this.ctrlFocusTimer = null;
        this.killFeedObserver = null;
        this.kxsClient = kxsClient;
        this.frameCount = 0;
        this.fps = 0;
        this.kills = 0;
        this.isMenuVisible = true;
        this.pingManager = new PingTest();
        this.allDivToHide = [
            '#ui-medical-interactive > div',
            '#ui-ammo-interactive > div',
            '#ui-weapon-container .ui-weapon-switch',
            '#ui-killfeed',
            '#ui-killfeed-contents',
            '.killfeed-div',
            '.killfeed-text',
            '#ui-kill-leader-container',
            '#ui-kill-leader-wrapper',
            '#ui-kill-leader-name',
            '#ui-kill-leader-icon',
            '#ui-kill-leader-count',
            '#ui-leaderboard-wrapper',
            '#ui-leaderboard',
            '#ui-leaderboard-alive',
            '#ui-leaderboard-alive-faction',
            '.ui-leaderboard-header',
            '#ui-kill-counter-wrapper',
            '#ui-kill-counter',
            '.ui-player-kills',
            '.ui-kill-counter-header',
            '#ui-bottom-center-right',
            '#ui-armor-helmet',
            '#ui-armor-chest',
            '#ui-armor-backpack',
            '.ui-armor-counter',
            '.ui-armor-counter-inner',
            '.ui-armor-level',
            '.ui-armor-image',
            '.ui-loot-image',
        ];
        if (this.kxsClient.isPingVisible) {
            this.initCounter("ping", "Ping", "45ms");
        }
        if (this.kxsClient.isFpsVisible) {
            this.initCounter("fps", "FPS", "60");
        }
        if (this.kxsClient.isKillsVisible) {
            this.initCounter("kills", "Kills", "0");
        }
        if (this.kxsClient.isGunOverlayColored) {
            this.toggleWeaponBorderHandler();
        }
        this.updateCountersDraggableState();
        this.startUpdateLoop();
        this.escapeMenu();
        this.initFriendDetector();
        if (this.kxsClient.isKillFeedBlint) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.initKillFeed);
            }
            else {
                this.initKillFeed();
            }
        }
        if (this.kxsClient.customCrosshair !== null) {
            this.loadCustomCrosshair();
        }
        this.setupCtrlFocusModeListener();
        window.addEventListener('load', () => {
            this.updateCounterCorners();
        });
        window.addEventListener('resize', () => {
            this.updateCounterCorners();
        });
    }
    setupCtrlFocusModeListener() {
        // Déterminer la plateforme une seule fois à l'initialisation
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
        // Utiliser un flag pour suivre l'état des touches
        let modifierKeyPressed = false;
        document.addEventListener('keydown', (e) => {
            // Détecter si la touche modificatrice est pressée (Command sur macOS, Ctrl sur Windows/Linux)
            if ((isMac && e.key === 'Meta') || (!isMac && e.key === 'Control')) {
                modifierKeyPressed = true;
            }
            // Activer le mode focus seulement si F est pressé pendant que la touche modificatrice est déjà enfoncée
            if (modifierKeyPressed && e.code === 'KeyF') {
                e.preventDefault(); // Empêcher le comportement par défaut (recherche)
                this.kxsClient.isFocusModeEnabled = !this.kxsClient.isFocusModeEnabled;
                this.kxsClient.hud.toggleFocusMode();
                this.kxsClient.nm.showNotification("Focus mode toggled", "info", 1200);
            }
        });
        // Réinitialiser le flag quand la touche modificatrice est relâchée
        document.addEventListener('keyup', (e) => {
            if ((isMac && e.key === 'Meta') || (!isMac && e.key === 'Control')) {
                modifierKeyPressed = false;
            }
        });
    }
    initFriendDetector() {
        // Initialize friends list
        let all_friends = this.kxsClient.all_friends.split(',') || [];
        if (all_friends.length >= 1) {
            // Create a cache for detected friends
            // Structure will be: { "friendName": timestamp }
            const friendsCache = {};
            // Cache duration in milliseconds (4 minutes = 240000 ms)
            const cacheDuration = 4 * 60 * 1000;
            // Select the element containing kill feeds
            const killfeedContents = document.querySelector('#ui-killfeed-contents');
            if (killfeedContents) {
                // Keep track of last seen content for each div
                const lastSeenContent = {
                    "ui-killfeed-0": "",
                    "ui-killfeed-1": "",
                    "ui-killfeed-2": "",
                    "ui-killfeed-3": "",
                    "ui-killfeed-4": "",
                    "ui-killfeed-5": ""
                };
                // Function to check if a friend is in the text with cache management
                const checkForFriends = (text, divId) => {
                    // If the text is identical to the last seen, ignore
                    // @ts-ignore
                    if (text === lastSeenContent[divId])
                        return;
                    // Update the last seen content
                    // @ts-ignore
                    lastSeenContent[divId] = text;
                    // Ignore empty messages
                    if (!text.trim())
                        return;
                    // Current timestamp
                    const currentTime = Date.now();
                    // Check if a friend is mentioned
                    for (let friend of all_friends) {
                        if (friend !== "" && text.includes(friend)) {
                            // Check if the friend is in the cache and if the cache is still valid
                            // @ts-ignore
                            const lastSeen = friendsCache[friend];
                            if (!lastSeen || (currentTime - lastSeen > cacheDuration)) {
                                // Update the cache
                                // @ts-ignore
                                friendsCache[friend] = currentTime;
                                // Display notification
                                this.kxsClient.nm.showNotification(`[FriendDetector] ${friend} is in this game`, "info", 2300);
                            }
                            break;
                        }
                    }
                };
                // Function to check all kill feeds
                const checkAllKillfeeds = () => {
                    all_friends = this.kxsClient.all_friends.split(',') || [];
                    for (let i = 0; i <= 5; i++) {
                        const divId = `ui-killfeed-${i}`;
                        const killDiv = document.getElementById(divId);
                        if (killDiv) {
                            const textElement = killDiv.querySelector('.killfeed-text');
                            if (textElement && textElement.textContent) {
                                checkForFriends(textElement.textContent, divId);
                            }
                        }
                    }
                };
                // Observe style or text changes in the entire container
                const observer = new MutationObserver(() => {
                    checkAllKillfeeds();
                });
                // Start observing with a configuration that detects all changes
                observer.observe(killfeedContents, {
                    childList: true, // Observe changes to child elements
                    subtree: true, // Observe the entire tree
                    characterData: true, // Observe text changes
                    attributes: true // Observe attribute changes (like style/opacity)
                });
                // Check current content immediately
                checkAllKillfeeds();
            }
            else {
                this.kxsClient.logger.error("Killfeed-contents element not found");
            }
        }
    }
    initKillFeed() {
        this.applyCustomStyles();
        this.setupObserver();
    }
    toggleKillFeed() {
        if (this.kxsClient.isKillFeedBlint) {
            this.initKillFeed(); // <-- injecte le CSS custom et observer
        }
        else {
            this.resetKillFeed(); // <-- supprime styles et contenu
        }
    }
    /**
     * Réinitialise le Kill Feed à l'état par défaut (vide)
     */
    /**
     * Supprime tous les styles custom KillFeed injectés par applyCustomStyles
     */
    resetKillFeedStyles() {
        // Supprime tous les <style> contenant .killfeed-div ou .killfeed-text
        const styles = Array.from(document.head.querySelectorAll('style'));
        styles.forEach(style => {
            if (style.textContent &&
                (style.textContent.includes('.killfeed-div') || style.textContent.includes('.killfeed-text'))) {
                style.remove();
            }
        });
    }
    observeHudOpacity(opacity) {
        // Nettoie d'abord les observers existants
        this.hudOpacityObservers.forEach(obs => obs.disconnect());
        this.hudOpacityObservers = [];
        this.allDivToHide.forEach(sel => {
            const elements = document.querySelectorAll(sel);
            elements.forEach(el => {
                el.style.opacity = String(opacity);
                // Applique aussi l'opacité à tous les descendants
                const descendants = el.querySelectorAll('*');
                descendants.forEach(child => {
                    child.style.opacity = String(opacity);
                });
                // Observer pour le parent
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.type === "attributes" &&
                            mutation.attributeName === "style") {
                            const currentOpacity = el.style.opacity;
                            if (currentOpacity !== String(opacity)) {
                                el.style.opacity = String(opacity);
                            }
                            // Vérifie aussi les enfants
                            const descendants = el.querySelectorAll('*');
                            descendants.forEach(child => {
                                if (child.style.opacity !== String(opacity)) {
                                    child.style.opacity = String(opacity);
                                }
                            });
                        }
                    });
                });
                observer.observe(el, { attributes: true, attributeFilter: ["style"] });
                this.hudOpacityObservers.push(observer);
                // Observer pour chaque enfant (optionnel mais robuste)
                descendants.forEach(child => {
                    const childObserver = new MutationObserver(mutations => {
                        mutations.forEach(mutation => {
                            if (mutation.type === "attributes" &&
                                mutation.attributeName === "style") {
                                if (child.style.opacity !== String(opacity)) {
                                    child.style.opacity = String(opacity);
                                }
                            }
                        });
                    });
                    childObserver.observe(child, { attributes: true, attributeFilter: ["style"] });
                    this.hudOpacityObservers.push(childObserver);
                });
            });
        });
    }
    toggleFocusMode() {
        if (this.kxsClient.isFocusModeEnabled) {
            this.observeHudOpacity(0.05);
        }
        else {
            // 1. Stoppe tous les observers
            this.hudOpacityObservers.forEach(obs => obs.disconnect());
            this.hudOpacityObservers = [];
            this.allDivToHide.forEach(sel => {
                const elements = document.querySelectorAll(sel);
                elements.forEach(el => {
                    el.style.removeProperty('opacity');
                    // Supprime aussi sur tous les enfants
                    const descendants = el.querySelectorAll('*');
                    descendants.forEach(child => {
                        child.style.removeProperty('opacity');
                    });
                });
            });
        }
    }
    resetKillFeed() {
        // Supprime les styles custom KillFeed
        this.resetKillFeedStyles();
        // Sélectionne le container du killfeed
        const killfeedContents = document.getElementById('ui-killfeed-contents');
        if (killfeedContents) {
            // Vide tous les killfeed-div et killfeed-text
            killfeedContents.querySelectorAll('.killfeed-div').forEach(div => {
                const text = div.querySelector('.killfeed-text');
                if (text)
                    text.textContent = '';
                div.style.opacity = '0';
            });
        }
    }
    loadCustomCrosshair() {
        const url = this.kxsClient.customCrosshair;
        // Supprime l'ancienne règle si elle existe
        const styleId = 'kxs-custom-cursor-style';
        const oldStyle = document.getElementById(styleId);
        if (oldStyle)
            oldStyle.remove();
        // Débranche l'ancien observer s'il existe
        if (this.customCursorObserver) {
            this.customCursorObserver.disconnect();
            this.customCursorObserver = undefined;
        }
        // Réinitialise le curseur si pas d'URL
        if (!url) {
            // Supprime l'image animée si présente
            if (this.animatedCursorImg) {
                this.animatedCursorImg.remove();
                this.animatedCursorImg = undefined;
            }
            // Supprime le style CSS qui cache le curseur natif
            const hideCursorStyle = document.getElementById('kxs-hide-cursor-style');
            if (hideCursorStyle)
                hideCursorStyle.remove();
            // Supprime le style CSS du curseur personnalisé
            const customCursorStyle = document.getElementById('kxs-custom-cursor-style');
            if (customCursorStyle)
                customCursorStyle.remove();
            // Retire l'eventListener mousemove si défini
            if (this._mousemoveHandler) {
                document.removeEventListener('mousemove', this._mousemoveHandler);
                this._mousemoveHandler = undefined;
            }
            document.body.style.cursor = '';
            return;
        }
        // Curseur animé JS : gestion d'un GIF
        const isGif = url.split('?')[0].toLowerCase().endsWith('.gif');
        // Nettoyage si on repasse sur un non-GIF
        if (this.animatedCursorImg) {
            this.animatedCursorImg.remove();
            this.animatedCursorImg = undefined;
        }
        if (this._mousemoveHandler) {
            document.removeEventListener('mousemove', this._mousemoveHandler);
            this._mousemoveHandler = undefined;
        }
        if (isGif) {
            // Ajoute une règle CSS globale pour cacher le curseur natif partout
            let hideCursorStyle = document.getElementById('kxs-hide-cursor-style');
            if (!hideCursorStyle) {
                hideCursorStyle = document.createElement('style');
                hideCursorStyle.id = 'kxs-hide-cursor-style';
                hideCursorStyle.innerHTML = `
			* { cursor: none !important; }
			*:hover { cursor: none !important; }
			*:active { cursor: none !important; }
			*:focus { cursor: none !important; }
			input, textarea { cursor: none !important; }
			a, button, [role="button"], [onclick] { cursor: none !important; }
			[draggable="true"] { cursor: none !important; }
			[style*="cursor: pointer"] { cursor: none !important; }
			[style*="cursor: text"] { cursor: none !important; }
			[style*="cursor: move"] { cursor: none !important; }
			[style*="cursor: crosshair"] { cursor: none !important; }
			[style*="cursor: ew-resize"] { cursor: none !important; }
			[style*="cursor: ns-resize"] { cursor: none !important; }
		`;
                document.head.appendChild(hideCursorStyle);
            }
            const animatedImg = document.createElement('img');
            animatedImg.src = url;
            animatedImg.style.position = 'fixed';
            animatedImg.style.pointerEvents = 'none';
            animatedImg.style.zIndex = '99999';
            animatedImg.style.width = '38px';
            animatedImg.style.height = '38px';
            animatedImg.style.left = '0px';
            animatedImg.style.top = '0px';
            this.animatedCursorImg = animatedImg;
            document.body.appendChild(animatedImg);
            this._mousemoveHandler = (e) => {
                if (this.animatedCursorImg) {
                    this.animatedCursorImg.style.left = `${e.clientX}px`;
                    this.animatedCursorImg.style.top = `${e.clientY}px`;
                }
            };
            document.addEventListener('mousemove', this._mousemoveHandler);
            return;
        }
        // Nettoie la règle cursor:none si on repasse sur un curseur natif
        const hideCursorStyle = document.getElementById('kxs-hide-cursor-style');
        if (hideCursorStyle)
            hideCursorStyle.remove();
        // Sinon, méthode classique : précharge l'image, puis applique le curseur natif
        const img = new window.Image();
        img.onload = () => {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
			* { cursor: url('${url}'), auto !important; }
			*:hover { cursor: url('${url}'), pointer !important; }
			*:active { cursor: url('${url}'), pointer !important; }
			*:focus { cursor: url('${url}'), text !important; }
			input, textarea { cursor: url('${url}'), text !important; }
			a, button, [role="button"], [onclick] { cursor: url('${url}'), pointer !important; }
			[draggable="true"] { cursor: url('${url}'), move !important; }
			[style*="cursor: pointer"] { cursor: url('${url}'), pointer !important; }
			[style*="cursor: text"] { cursor: url('${url}'), text !important; }
			[style*="cursor: move"] { cursor: url('${url}'), move !important; }
			[style*="cursor: crosshair"] { cursor: url('${url}'), crosshair !important; }
			[style*="cursor: ew-resize"] { cursor: url('${url}'), ew-resize !important; }
			[style*="cursor: ns-resize"] { cursor: url('${url}'), ns-resize !important; }
		`;
            document.head.appendChild(style);
        };
        img.onerror = () => {
            document.body.style.cursor = '';
            this.kxsClient.logger.warn('Impossible de charger le curseur personnalisé:', url);
        };
        img.src = url;
        // --- MutationObserver pour forcer le curseur même si le jeu le réécrit ---
        this.customCursorObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const node = mutation.target;
                    if (node.style && node.style.cursor && !node.style.cursor.includes(url)) {
                        node.style.cursor = `url('${url}'), auto`;
                    }
                }
            }
        });
        // Observe tous les changements de style sur tout le body et sur #game-touch-area
        const gameTouchArea = document.getElementById('game-touch-area');
        if (gameTouchArea) {
            this.customCursorObserver.observe(gameTouchArea, {
                attributes: true,
                attributeFilter: ['style'],
                subtree: true
            });
        }
        this.customCursorObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    }
    escapeMenu() {
        const customStylesMobile = `
    .ui-game-menu-desktop {
        background: linear-gradient(135deg, rgba(25, 25, 35, 0.95) 0%, rgba(15, 15, 25, 0.98) 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
        padding: 2px 2px !important;
        max-width: 45vw !important;
        width: 45vw !important;
        max-height: 28vh !important;
        min-width: unset !important;
        min-height: unset !important;
        font-size: 9px !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
        overflow-y: auto !important;
    }
    .ui-game-menu-desktop button, .ui-game-menu-desktop .btn, .ui-game-menu-desktop input, .ui-game-menu-desktop select {
        font-size: 9px !important;
        padding: 2px 3px !important;
        margin: 1px 0 !important;
        border-radius: 3px !important;
    }
    .ui-game-menu-desktop .kxs-header, .ui-game-menu-desktop h1, .ui-game-menu-desktop h2, .ui-game-menu-desktop h3, .ui-game-menu-desktop label, .ui-game-menu-desktop span {
        font-size: 9px !important;
    }
    .ui-game-menu-desktop img, .ui-game-menu-desktop svg {
        width: 10px !important;
        height: 10px !important;
    }
    .ui-game-menu-desktop .mode-btn {
        min-height: 12px !important;
        font-size: 8px !important;
        padding: 2px 3px !important;
    }
    /* Style pour les boutons de mode de jeu qui ont une image de fond */
    .btn-mode-cobalt,
    [style*="background: url("] {
        background-repeat: no-repeat !important;
        background-position: right center !important;
        background-size: auto 70% !important;
        position: relative !important;
        padding-right: 8px !important;
    }
    #btn-start-mode-0 {
        background-repeat: initial !important;
        background-position: initial !important;
        background-size: initial !important;
        padding-right: initial !important;
    }
`;
        const customStylesDesktop = `
.ui-game-menu-desktop {
	background: linear-gradient(135deg, rgba(25, 25, 35, 0.95) 0%, rgba(15, 15, 25, 0.98) 100%) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 12px !important;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
	padding: 20px !important;
	backdrop-filter: blur(10px) !important;
	max-width: 350px !important;
	/* max-height: 80vh !important; */ /* Optional: Limit the maximum height */
	margin: auto !important;
	box-sizing: border-box !important;
	overflow-y: auto !important; /* Allow vertical scrolling if necessary */
}

/* Style pour les boutons de mode de jeu qui ont une image de fond */
.btn-mode-cobalt,
[style*="background: url("] {
	background-repeat: no-repeat !important;
	background-position: right center !important;
	background-size: auto 80% !important;
	position: relative !important;
	padding-right: 40px !important;
}

/* Ne pas appliquer ce style aux boutons standards comme Play Solo */
#btn-start-mode-0 {
	background-repeat: initial !important;
	background-position: initial !important;
	background-size: initial !important;
	padding-right: initial !important;
}

.ui-game-menu-desktop::-webkit-scrollbar {
	width: 8px !important;
}
.ui-game-menu-desktop::-webkit-scrollbar-track {
	background: rgba(25, 25, 35, 0.5) !important;
	border-radius: 10px !important;
}
.ui-game-menu-desktop::-webkit-scrollbar-thumb {
	background-color: #4287f5 !important;
	border-radius: 10px !important;
	border: 2px solid rgba(25, 25, 35, 0.5) !important;
}
.ui-game-menu-desktop::-webkit-scrollbar-thumb:hover {
	background-color: #5a9eff !important;
}

.ui-game-menu-desktop {
	scrollbar-width: thin !important;
	scrollbar-color: #4287f5 rgba(25, 25, 35, 0.5) !important;
}

.kxs-header {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: 20px;
	padding: 10px;
	border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.kxs-logo {
	width: 30px;
	height: 30px;
	margin-right: 10px;
	border-radius: 6px;
}

.kxs-title {
	font-size: 20px;
	font-weight: 700;
	color: #ffffff;
	text-transform: uppercase;
	text-shadow: 0 0 10px rgba(66, 135, 245, 0.5);
	font-family: 'Arial', sans-serif;
	letter-spacing: 2px;
}

.kxs-title span {
	color: #4287f5;
}


.btn-game-menu {
	background: linear-gradient(135deg, rgba(66, 135, 245, 0.1) 0%, rgba(66, 135, 245, 0.2) 100%) !important;
	border: 1px solid rgba(66, 135, 245, 0.3) !important;
	border-radius: 8px !important;
	color: #ffffff !important;
	transition: all 0.3s ease !important;
	margin: 5px 0 !important;
	padding: 12px !important;
	font-weight: 600 !important;
	width: 100% !important;
	text-align: center !important;
	display: block !important;
	box-sizing: border-box !important;
	line-height: 15px !important;
}

.btn-game-menu:hover {
	background: linear-gradient(135deg, rgba(66, 135, 245, 0.2) 0%, rgba(66, 135, 245, 0.3) 100%) !important;
	transform: translateY(-2px) !important;
	box-shadow: 0 4px 12px rgba(66, 135, 245, 0.2) !important;
}

.slider-container {
	background: rgba(66, 135, 245, 0.1) !important;
	border-radius: 8px !important;
	padding: 10px 15px !important;
	margin: 10px 0 !important;
	width: 100% !important;
	box-sizing: border-box !important;
}

.slider-text {
	color: #ffffff !important;
	font-size: 14px !important;
	margin-bottom: 8px !important;
	text-align: center !important;
}

.slider {
	-webkit-appearance: none !important;
	width: 100% !important;
	height: 6px !important;
	border-radius: 3px !important;
	background: rgba(66, 135, 245, 0.3) !important;
	outline: none !important;
	margin: 10px 0 !important;
}

.slider::-webkit-slider-thumb {
	-webkit-appearance: none !important;
	width: 16px !important;
	height: 16px !important;
	border-radius: 50% !important;
	background: #4287f5 !important;
	cursor: pointer !important;
	transition: all 0.3s ease !important;
}

.slider::-webkit-slider-thumb:hover {
	transform: scale(1.2) !important;
	box-shadow: 0 0 10px rgba(66, 135, 245, 0.5) !important;
}

.btns-game-double-row {
	display: flex !important;
	justify-content: center !important;
	gap: 10px !important;
	margin-bottom: 10px !important;
	width: 100% !important;
}

.btn-game-container {
	flex: 1 !important;
}

#btn-touch-styles,
#btn-game-aim-line {
	display: none !important;
	pointer-events: none !important;
	visibility: hidden !important;
}
`;
        const addCustomStyles = () => {
            const styleElement = document.createElement('style');
            styleElement.textContent = this.kxsClient.isMobile() ? customStylesMobile : customStylesDesktop;
            document.head.appendChild(styleElement);
        };
        const addKxsHeader = () => {
            const menuContainer = document.querySelector('#ui-game-menu');
            if (!menuContainer)
                return;
            const header = document.createElement('div');
            header.className = 'kxs-header';
            const title = document.createElement('span');
            title.className = 'kxs-title';
            title.innerHTML = '<span>Kxs</span> CLIENT';
            header.appendChild(title);
            menuContainer.insertBefore(header, menuContainer.firstChild);
        };
        const disableUnwantedButtons = () => {
            const touchStyles = document.getElementById('btn-touch-styles');
            const aimLine = document.getElementById('btn-game-aim-line');
            if (touchStyles) {
                touchStyles.style.display = 'none';
                touchStyles.style.pointerEvents = 'none';
                touchStyles.style.visibility = 'hidden';
            }
            if (aimLine) {
                aimLine.style.display = 'none';
                aimLine.style.pointerEvents = 'none';
                aimLine.style.visibility = 'hidden';
            }
        };
        if (document.querySelector('#ui-game-menu')) {
            addCustomStyles();
            addKxsHeader();
            if (!this.kxsClient.isMobile()) {
                disableUnwantedButtons();
            }
            // Désactiver uniquement le slider Music Volume
            const sliders = document.querySelectorAll('.slider-container.ui-slider-container');
            sliders.forEach(slider => {
                const label = slider.querySelector('p.slider-text[data-l10n="index-music-volume"]');
                if (label) {
                    slider.style.display = 'none';
                }
            });
            // Ajout du bouton Toggle Right Shift Menu
            const menuContainer = document.querySelector('#ui-game-menu');
            if (menuContainer) {
                const toggleRightShiftBtn = document.createElement('button');
                toggleRightShiftBtn.textContent = 'Toggle Right Shift Menu';
                toggleRightShiftBtn.className = 'btn-game-menu';
                toggleRightShiftBtn.style.marginTop = '10px';
                toggleRightShiftBtn.onclick = () => {
                    if (this.kxsClient.secondaryMenu && typeof this.kxsClient.secondaryMenu.toggleMenuVisibility === 'function') {
                        this.kxsClient.secondaryMenu.toggleMenuVisibility();
                    }
                };
                menuContainer.appendChild(toggleRightShiftBtn);
            }
        }
    }
    handleMessage(element) {
        if (element instanceof HTMLElement && element.classList.contains('killfeed-div')) {
            const killfeedText = element.querySelector('.killfeed-text');
            if (killfeedText instanceof HTMLElement) {
                if (killfeedText.textContent && killfeedText.textContent.trim() !== '') {
                    if (!killfeedText.hasAttribute('data-glint')) {
                        killfeedText.setAttribute('data-glint', 'true');
                        element.style.opacity = '1';
                        setTimeout(() => {
                            element.style.opacity = '0';
                        }, 5000);
                    }
                }
                else {
                    element.style.opacity = '0';
                }
            }
        }
    }
    setupObserver() {
        const killfeedContents = document.getElementById('ui-killfeed-contents');
        if (killfeedContents) {
            // Détruit l'ancien observer s'il existe
            if (this.killFeedObserver) {
                this.killFeedObserver.disconnect();
            }
            this.killFeedObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target instanceof HTMLElement &&
                        mutation.target.classList.contains('killfeed-text')) {
                        const parentDiv = mutation.target.closest('.killfeed-div');
                        if (parentDiv) {
                            this.handleMessage(parentDiv);
                        }
                    }
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement) {
                            this.handleMessage(node);
                        }
                    });
                });
            });
            this.killFeedObserver.observe(killfeedContents, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
            killfeedContents.querySelectorAll('.killfeed-div').forEach(this.handleMessage);
        }
    }
    /**
     * Détruit l'observer du killfeed s'il existe
     */
    disableKillFeedObserver() {
        if (this.killFeedObserver) {
            this.killFeedObserver.disconnect();
            this.killFeedObserver = null;
        }
    }
    applyCustomStyles() {
        const customStyles = document.createElement('style');
        if (this.kxsClient.isKillFeedBlint) {
            customStyles.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@600&display=swap');

        .killfeed-div {
            position: absolute !important;
            padding: 5px 10px !important;
            background: rgba(0, 0, 0, 0.7) !important;
            border-radius: 5px !important;
            transition: opacity 0.5s ease-out !important;
        }

        .killfeed-text {
            font-family: 'Oxanium', sans-serif !important;
            font-weight: bold !important;
            font-size: 16px !important;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5) !important;
            background: linear-gradient(90deg,
                rgb(255, 0, 0),
                rgb(255, 127, 0),
                rgb(255, 255, 0),
                rgb(0, 255, 0),
                rgb(0, 0, 255),
                rgb(75, 0, 130),
                rgb(148, 0, 211),
                rgb(255, 0, 0));
            background-size: 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: glint 3s linear infinite;
        }

        @keyframes glint {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }

        .killfeed-div .killfeed-text:empty {
            display: none !important;
        }
      `;
        }
        else {
            customStyles.innerHTML = `
        .killfeed-div {
            position: absolute;
            padding: 5px 10px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 5px;
            transition: opacity 0.5s ease-out;
        }

        .killfeed-text {
            font-family: inherit;
            font-weight: normal;
            font-size: inherit;
            color: inherit;
            text-shadow: none;
            background: none;
        }

        .killfeed-div .killfeed-text:empty {
            display: none;
        }
      `;
        }
        document.head.appendChild(customStyles);
    }
    handleResize() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        for (const name of ['fps', 'kills', 'ping']) {
            const counterContainer = document.getElementById(`${name}CounterContainer`);
            if (!counterContainer)
                continue;
            const counter = this.kxsClient.counters[name];
            if (!counter)
                continue;
            const rect = counterContainer.getBoundingClientRect();
            const savedPosition = this.getSavedPosition(name);
            let newPosition = this.calculateSafePosition(savedPosition, rect.width, rect.height, viewportWidth, viewportHeight);
            this.applyPosition(counterContainer, newPosition);
            this.savePosition(name, newPosition);
        }
    }
    calculateSafePosition(currentPosition, elementWidth, elementHeight, viewportWidth, viewportHeight) {
        let { left, top } = currentPosition;
        if (left + elementWidth > viewportWidth) {
            left = viewportWidth - elementWidth;
        }
        if (left < 0) {
            left = 0;
        }
        if (top + elementHeight > viewportHeight) {
            top = viewportHeight - elementHeight;
        }
        if (top < 0) {
            top = 0;
        }
        return { left, top };
    }
    getSavedPosition(name) {
        const savedPosition = localStorage.getItem(`${name}CounterPosition`);
        if (savedPosition) {
            try {
                return JSON.parse(savedPosition);
            }
            catch (_a) {
                return this.kxsClient.defaultPositions[name];
            }
        }
        return this.kxsClient.defaultPositions[name];
    }
    applyPosition(element, position) {
        element.style.left = `${position.left}px`;
        element.style.top = `${position.top}px`;
    }
    savePosition(name, position) {
        localStorage.setItem(`${name}CounterPosition`, JSON.stringify(position));
    }
    startUpdateLoop() {
        var _a;
        const now = performance.now();
        const delta = now - this.kxsClient.lastFrameTime;
        this.frameCount++;
        if (delta >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / delta);
            this.frameCount = 0;
            this.kxsClient.lastFrameTime = now;
            this.kills = this.kxsClient.getKills();
            // Vérifie et crée les compteurs s'ils n'existent pas encore mais sont activés
            if (this.kxsClient.isFpsVisible && !this.kxsClient.counters.fps) {
                this.initCounter("fps", "FPS", "60");
            }
            if (this.kxsClient.isKillsVisible && !this.kxsClient.counters.kills) {
                this.initCounter("kills", "Kills", "0");
            }
            if (this.kxsClient.isPingVisible && !this.kxsClient.counters.ping) {
                this.initCounter("ping", "Ping", "45ms");
            }
            // Met à jour les valeurs des compteurs visibles
            if (this.kxsClient.isFpsVisible && this.kxsClient.counters.fps) {
                this.kxsClient.counters.fps.textContent = `FPS: ${this.fps}`;
            }
            if (this.kxsClient.isKillsVisible && this.kxsClient.counters.kills) {
                this.kxsClient.counters.kills.textContent = `Kills: ${this.kills}`;
            }
            if (this.kxsClient.isPingVisible &&
                this.kxsClient.counters.ping &&
                this.pingManager) {
                const result = this.pingManager.getPingResult();
                this.kxsClient.counters.ping.textContent = `PING: ${result.ping} ms`;
            }
        }
        if (this.kxsClient.animationFrameCallback) {
            this.kxsClient.animationFrameCallback(() => this.startUpdateLoop());
        }
        this.updateUiElements();
        this.updateBoostBars();
        this.updateHealthBars();
        (_a = this.kxsClient.kill_leader) === null || _a === void 0 ? void 0 : _a.update(this.kills);
    }
    initCounter(name, label, initialText) {
        // Vérifier si le compteur existe déjà et le supprimer si c'est le cas
        this.removeCounter(name);
        const counter = document.createElement("div");
        counter.id = `${name}Counter`;
        const counterContainer = document.createElement("div");
        counterContainer.id = `${name}CounterContainer`;
        Object.assign(counterContainer.style, {
            position: "absolute",
            left: `${this.kxsClient.defaultPositions[name].left}px`,
            top: `${this.kxsClient.defaultPositions[name].top}px`,
            zIndex: "10000",
        });
        Object.assign(counter.style, {
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            fontFamily: "Arial, sans-serif",
            padding: "5px 10px",
            pointerEvents: "none",
            cursor: "default",
            width: `${this.kxsClient.defaultSizes[name].width}px`,
            height: `${this.kxsClient.defaultSizes[name].height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            resize: "both",
            overflow: "hidden",
        });
        counter.textContent = `${label}: ${initialText}`;
        counterContainer.appendChild(counter);
        const uiTopLeft = document.getElementById("ui-top-left");
        if (uiTopLeft) {
            uiTopLeft.appendChild(counterContainer);
        }
        const adjustFontSize = () => {
            const { width, height } = counter.getBoundingClientRect();
            const size = Math.min(width, height) * 0.4;
            counter.style.fontSize = `${size}px`;
        };
        new ResizeObserver(adjustFontSize).observe(counter);
        counter.addEventListener("mousedown", (event) => {
            if (event.button === 1) {
                this.resetCounter(name, label, initialText);
                event.preventDefault();
            }
        });
        this.kxsClient.makeDraggable(counterContainer, `${name}CounterPosition`);
        this.kxsClient.counters[name] = counter;
        this.kxsClient.gridSystem.registerCounter(name, counterContainer);
        const savedPosition = localStorage.getItem(`${name}CounterPosition`);
        if (savedPosition) {
            const { x, y } = JSON.parse(savedPosition);
            counterContainer.style.left = `${x}px`;
            counterContainer.style.top = `${y}px`;
        }
        this.updateCounterCorners();
    }
    /**
     * Supprime un compteur du DOM et de la référence dans kxsClient.counters
     * @param name Nom du compteur à supprimer (fps, kills, ping)
     */
    removeCounter(name) {
        // Supprime l'élément du DOM s'il existe
        const counterContainer = document.getElementById(`${name}CounterContainer`);
        if (counterContainer) {
            counterContainer.remove();
        }
        // Supprime la référence dans kxsClient.counters
        if (this.kxsClient.counters[name]) {
            // Utilise delete pour supprimer la propriété au lieu de l'affecter à null
            delete this.kxsClient.counters[name];
        }
        this.kxsClient.gridSystem.registerCounter(name, null);
        this.kxsClient.gridSystem.updateCounterCorners();
    }
    /**
     * Gère l'affichage ou le masquage d'un compteur en fonction de son état
     * @param name Nom du compteur (fps, kills, ping)
     * @param visible État de visibilité souhaité
     * @param label Libellé du compteur
     * @param initialText Texte initial à afficher
     */
    toggleCounter(name, visible, label, initialText) {
        if (visible) {
            // Si le compteur doit être visible mais n'existe pas, on le crée
            if (!this.kxsClient.counters[name]) {
                this.initCounter(name, label, initialText);
            }
        }
        else {
            // Si le compteur ne doit pas être visible mais existe, on le supprime
            this.removeCounter(name);
        }
    }
    resetCounter(name, label, initialText) {
        const counter = this.kxsClient.counters[name];
        const container = document.getElementById(`${name}CounterContainer`);
        if (!counter || !container)
            return;
        // Reset only this counter's position and size
        Object.assign(container.style, {
            left: `${this.kxsClient.defaultPositions[name].left}px`,
            top: `${this.kxsClient.defaultPositions[name].top}px`,
        });
        Object.assign(counter.style, {
            width: `${this.kxsClient.defaultSizes[name].width}px`,
            height: `${this.kxsClient.defaultSizes[name].height}px`,
            fontSize: "18px",
            borderRadius: "5px",
        });
        counter.textContent = `${label}: ${initialText}`;
        // Clear the saved position for this counter only
        localStorage.removeItem(`${name}CounterPosition`);
        setTimeout(() => {
            this.kxsClient.gridSystem.updateCounterCorners();
        }, 50);
    }
    updateBoostBars() {
        const boostCounter = document.querySelector("#ui-boost-counter");
        if (boostCounter) {
            // Si les indicateurs sont désactivés, on supprime les éléments personnalisés
            if (!this.kxsClient.isHealBarIndicatorEnabled) {
                this.cleanBoostDisplay(boostCounter);
                return;
            }
            const boostBars = boostCounter.querySelectorAll(".ui-boost-base .ui-bar-inner");
            let totalBoost = 0;
            const weights = [25, 25, 40, 10];
            boostBars.forEach((bar, index) => {
                const width = parseFloat(bar.style.width);
                if (!isNaN(width)) {
                    totalBoost += width * (weights[index] / 100);
                }
            });
            const averageBoost = Math.round(totalBoost);
            let boostDisplay = boostCounter.querySelector(".boost-display");
            if (!boostDisplay) {
                boostDisplay = document.createElement("div");
                boostDisplay.classList.add("boost-display");
                Object.assign(boostDisplay.style, {
                    position: "absolute",
                    bottom: "75px",
                    right: "335px",
                    color: "#FF901A",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    zIndex: "10",
                    textAlign: "center",
                });
                boostCounter.appendChild(boostDisplay);
            }
            boostDisplay.textContent = `AD: ${averageBoost}%`;
        }
    }
    toggleWeaponBorderHandler() {
        // Get all weapon containers
        const weaponContainers = Array.from(document.getElementsByClassName("ui-weapon-switch"));
        // Get all weapon names
        const weaponNames = Array.from(document.getElementsByClassName("ui-weapon-name"));
        // Clear any existing observers
        this.clearWeaponBorderObservers();
        if (this.kxsClient.isGunOverlayColored) {
            // Apply initial border colors
            weaponContainers.forEach((container) => {
                if (container.id === "ui-weapon-id-4") {
                    container.style.border = "3px solid #2f4032";
                }
                else {
                    container.style.border = "3px solid #FFFFFF";
                }
            });
            const WEAPON_COLORS = {
                ORANGE: '#FFAE00',
                BLUE: '#007FFF',
                GREEN: '#0f690d',
                RED: '#FF0000',
                BLACK: '#000000',
                OLIVE: '#808000',
                ORANGE_RED: '#FF4500',
                PURPLE: '#800080',
                TEAL: '#008080',
                BROWN: '#A52A2A',
                PINK: '#FFC0CB',
                DEFAULT: '#FFFFFF'
            };
            const WEAPON_COLOR_MAPPING = {
                ORANGE: ['CZ-3A1', 'G18C', 'M9', 'M93R', 'MAC-10', 'MP5', 'P30L', 'DUAL P30L', 'UMP9', 'VECTOR', 'VSS', 'FLAMETHROWER'],
                BLUE: ['AK-47', 'OT-38', 'OTS-38', 'M39 EMR', 'DP-28', 'MOSIN-NAGANT', 'SCAR-H', 'SV-98', 'M1 GARAND', 'PKP PECHENEG', 'AN-94', 'BAR M1918', 'BLR 81', 'SVD-63', 'M134', 'WATER GUN', 'GROZA', 'GROZA-S'],
                GREEN: ['FAMAS', 'M416', 'M249', 'QBB-97', 'MK 12 SPR', 'M4A1-S', 'SCOUT ELITE', 'L86A2'],
                RED: ['M870', 'MP220', 'SAIGA-12', 'SPAS-12', 'USAS-12', 'SUPER 90', 'LASR GUN', 'M1100'],
                BLACK: ['DEAGLE 50', 'RAINBOW BLASTER'],
                OLIVE: ['AWM-S', 'MK 20 SSR'],
                ORANGE_RED: ['FLARE GUN'],
                PURPLE: ['MODEL 94', 'PEACEMAKER', 'VECTOR (.45 ACP)', 'M1911', 'M1A1', 'MK45G'],
                TEAL: ['M79'],
                BROWN: ['POTATO CANNON', 'SPUD GUN'],
                PINK: ['HEART CANNON'],
                DEFAULT: []
            };
            // Set up observers for dynamic color changes
            weaponNames.forEach((weaponNameElement) => {
                const weaponContainer = weaponNameElement.closest(".ui-weapon-switch");
                const observer = new MutationObserver(() => {
                    var _a, _b, _c;
                    const weaponName = ((_b = (_a = weaponNameElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || '';
                    let colorKey = 'DEFAULT';
                    // Do a hack for "VECTOR" gun (because can be 2 weapons: yellow or purple)
                    if (weaponName === "VECTOR") {
                        // Get the weapon container and image element
                        const weaponContainer = weaponNameElement.closest(".ui-weapon-switch");
                        const weaponImage = weaponContainer === null || weaponContainer === void 0 ? void 0 : weaponContainer.querySelector(".ui-weapon-image");
                        if (weaponImage && weaponImage.src) {
                            // Check the image source to determine which Vector it is
                            if (weaponImage.src.includes("-acp") || weaponImage.src.includes("45")) {
                                colorKey = 'PURPLE';
                            }
                            else {
                                colorKey = 'ORANGE';
                            }
                        }
                        else {
                            // Default to orange if we can't determine the type
                            colorKey = 'ORANGE';
                        }
                    }
                    else {
                        colorKey = (((_c = Object.entries(WEAPON_COLOR_MAPPING)
                            .find(([_, weapons]) => weapons.includes(weaponName))) === null || _c === void 0 ? void 0 : _c[0]) || 'DEFAULT');
                    }
                    if (weaponContainer && weaponContainer.id !== "ui-weapon-id-4") {
                        weaponContainer.style.border = `3px solid ${WEAPON_COLORS[colorKey]}`;
                    }
                });
                observer.observe(weaponNameElement, { childList: true, characterData: true, subtree: true });
                // Store the observer for later cleanup
                this.weaponBorderObservers = this.weaponBorderObservers || [];
                this.weaponBorderObservers.push(observer);
            });
        }
        else {
            // If the feature is disabled, reset all weapon borders to default
            weaponContainers.forEach((container) => {
                // Reset to game's default border style
                container.style.border = "";
            });
        }
    }
    // Helper method to clear weapon border observers
    clearWeaponBorderObservers() {
        if (this.weaponBorderObservers && this.weaponBorderObservers.length > 0) {
            this.weaponBorderObservers.forEach(observer => {
                observer.disconnect();
            });
            this.weaponBorderObservers = [];
        }
    }
    toggleChromaticWeaponBorder() {
        const borderClass = 'kxs-chromatic-border';
        const styleId = 'kxs-chromatic-border-style';
        const weaponIds = [1, 2, 3, 4];
        if (this.kxsClient.isGunBorderChromatic) {
            // Inject CSS if not already present
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = `
@keyframes kxs-rainbow {
	0% { border-image: linear-gradient(120deg, #ff004c, #fffa00, #00ff90, #004cff, #ff004c) 1; }
	100% { border-image: linear-gradient(480deg, #ff004c, #fffa00, #00ff90, #004cff, #ff004c) 1; }
}
@keyframes kxs-glint {
	0% { box-shadow: 0 0 8px 2px #fff2; }
	50% { box-shadow: 0 0 24px 6px #fff8; }
	100% { box-shadow: 0 0 8px 2px #fff2; }
}
@keyframes kxs-bg-rainbow {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}
.kxs-chromatic-border {
	border: 3px solid transparent !important;
	border-image: linear-gradient(120deg, #ff004c, #fffa00, #00ff90, #004cff, #ff004c) 1;
	animation: kxs-rainbow 3s linear infinite, kxs-glint 2s ease-in-out infinite, kxs-bg-rainbow 8s linear infinite;
	border-radius: 8px !important;
	background: linear-gradient(270deg, #ff004c, #fffa00, #00ff90, #004cff, #ff004c);
	background-size: 1200% 1200%;
	background-position: 0% 50%;
	background-clip: padding-box;
	-webkit-background-clip: padding-box;
	filter: brightness(1.15) saturate(1.4);
	transition: background 0.5s;
}
`;
                document.head.appendChild(style);
            }
            weaponIds.forEach(id => {
                const el = document.getElementById(`ui-weapon-id-${id}`);
                if (el) {
                    el.classList.add(borderClass);
                }
            });
        }
        else {
            // Remove chromatic border and style
            weaponIds.forEach(id => {
                const el = document.getElementById(`ui-weapon-id-${id}`);
                if (el) {
                    el.classList.remove(borderClass);
                    el.style.border = '';
                }
            });
            const style = document.getElementById(styleId);
            if (style)
                style.remove();
            // Reapply regular colored borders if that feature is enabled
            if (this.kxsClient.isGunOverlayColored) {
                this.toggleWeaponBorderHandler();
            }
        }
    }
    updateUiElements() {
        // Réapplique l'effet chromatique si activé (corrige le bug d'affichage après un changement de page ou entrée en game)
        if (this.kxsClient.isGunBorderChromatic) {
            this.toggleChromaticWeaponBorder();
        }
        const currentUrl = window.location.href;
        const isSpecialUrl = /\/#\w+/.test(currentUrl);
        const playerOptions = document.getElementById("player-options");
        const teamMenuContents = document.getElementById("team-menu-contents");
        const startMenuContainer = document.querySelector("#start-menu .play-button-container");
        // Update counters draggable state based on LSHIFT menu visibility
        this.updateCountersDraggableState();
        if (!playerOptions)
            return;
        if (isSpecialUrl &&
            teamMenuContents &&
            playerOptions.parentNode !== teamMenuContents) {
            teamMenuContents.appendChild(playerOptions);
        }
        else if (!isSpecialUrl &&
            startMenuContainer &&
            playerOptions.parentNode !== startMenuContainer) {
            const firstChild = startMenuContainer.firstChild;
            startMenuContainer.insertBefore(playerOptions, firstChild);
        }
        const teamMenu = document.getElementById("team-menu");
        if (teamMenu) {
            teamMenu.style.height = "355px";
        }
        const menuBlocks = document.querySelectorAll(".menu-block");
        menuBlocks.forEach((block) => {
            block.style.maxHeight = "355px";
        });
        //scalable?
    }
    // Nettoie l'affichage boost personnalisé
    cleanBoostDisplay(boostCounter) {
        const boostDisplay = boostCounter.querySelector(".boost-display");
        if (boostDisplay) {
            boostDisplay.remove();
        }
    }
    // Nettoie l'affichage santé personnalisé
    cleanHealthDisplay(container) {
        const percentageText = container.querySelector(".health-text");
        if (percentageText) {
            percentageText.remove();
        }
        const healthChangeElements = container.querySelectorAll(".health-change");
        healthChangeElements.forEach(el => el.remove());
    }
    updateHealthBars() {
        const healthBars = document.querySelectorAll("#ui-health-container");
        healthBars.forEach((container) => {
            var _a, _b;
            // Si les indicateurs sont désactivés, on supprime les éléments personnalisés
            if (!this.kxsClient.isHealBarIndicatorEnabled) {
                this.cleanHealthDisplay(container);
                return;
            }
            const bar = container.querySelector("#ui-health-actual");
            if (bar) {
                const currentHealth = Math.round(parseFloat(bar.style.width));
                let percentageText = container.querySelector(".health-text");
                // Create or update percentage text
                if (!percentageText) {
                    percentageText = document.createElement("span");
                    percentageText.classList.add("health-text");
                    Object.assign(percentageText.style, {
                        width: "100%",
                        textAlign: "center",
                        marginTop: "5px",
                        color: "#333",
                        fontSize: "20px",
                        fontWeight: "bold",
                        position: "absolute",
                        zIndex: "10",
                    });
                    container.appendChild(percentageText);
                }
                // Check for health change
                if (currentHealth !== this.lastHealthValue) {
                    const healthChange = currentHealth - this.lastHealthValue;
                    if (healthChange !== 0) {
                        this.showHealthChangeAnimation(container, healthChange);
                    }
                    this.lastHealthValue = currentHealth;
                }
                if (this.kxsClient.isHealthWarningEnabled) {
                    (_a = this.kxsClient.healWarning) === null || _a === void 0 ? void 0 : _a.update(currentHealth);
                }
                else {
                    (_b = this.kxsClient.healWarning) === null || _b === void 0 ? void 0 : _b.hide();
                }
                percentageText.textContent = `${currentHealth}%`;
                // Update animations
                this.updateHealthAnimations();
            }
        });
    }
    showHealthChangeAnimation(container, change) {
        const healthContainer = container;
        if (!healthContainer || !this.kxsClient.isHealBarIndicatorEnabled)
            return;
        // Create animation element
        const animationElement = document.createElement("div");
        animationElement.classList.add("health-change");
        const isPositive = change > 0;
        Object.assign(animationElement.style, {
            position: "absolute",
            color: isPositive ? "#2ecc71" : "#e74c3c",
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            pointerEvents: "none",
            zIndex: "100",
            opacity: "1",
            top: "50%",
            right: "-80px", // Position à droite de la barre de vie
            transform: "translateY(-50%)", // Centre verticalement
            whiteSpace: "nowrap", // Empêche le retour à la ligne
        });
        // Check if change is a valid number before displaying it
        if (!isNaN(change)) {
            animationElement.textContent = `${isPositive ? "+" : ""}${change} HP`;
        }
        else {
            // Skip showing animation if change is NaN
            return;
        }
        container.appendChild(animationElement);
        this.healthAnimations.push({
            element: animationElement,
            startTime: performance.now(),
            duration: 1500, // Animation duration in milliseconds
            value: change,
        });
    }
    updateCounterCorners() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.kxsClient.gridSystem.updateCounterCorners();
            });
        }
        else {
            setTimeout(() => {
                this.kxsClient.gridSystem.updateCounterCorners();
            }, 100);
        }
    }
    updateCountersDraggableState() {
        var _a;
        const countersVisibility = {
            fps: this.kxsClient.isFpsVisible,
            ping: this.kxsClient.isPingVisible,
            kills: this.kxsClient.isKillsVisible,
        };
        Object.entries(countersVisibility).forEach(([name, visible]) => {
            const label = name.charAt(0).toUpperCase() + name.slice(1);
            const initialText = name === "fps" ? "60" : name === "ping" ? "45ms" : "0";
            this.toggleCounter(name, visible, label, initialText);
        });
        const isMenuOpen = ((_a = this.kxsClient.secondaryMenu) === null || _a === void 0 ? void 0 : _a.getMenuVisibility()) || false;
        const counterNames = ['fps', 'kills', 'ping'];
        counterNames.forEach(name => {
            const counter = document.getElementById(`${name}Counter`);
            if (counter) {
                // Mise à jour des propriétés de draggabilité
                counter.style.pointerEvents = isMenuOpen ? 'auto' : 'none';
                counter.style.cursor = isMenuOpen ? 'move' : 'default';
                // Mise à jour de la possibilité de redimensionnement
                counter.style.resize = isMenuOpen ? 'both' : 'none';
            }
        });
        this.updateCounterCorners();
    }
    updateHealthAnimations() {
        const currentTime = performance.now();
        this.healthAnimations = this.healthAnimations.filter(animation => {
            const elapsed = currentTime - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            if (progress < 1) {
                // Update animation position and opacity
                // Maintenant l'animation se déplace horizontalement vers la droite
                const translateX = progress * 20; // Déplacement horizontal
                Object.assign(animation.element.style, {
                    transform: `translateY(-50%) translateX(${translateX}px)`,
                    opacity: String(1 - progress),
                });
                return true;
            }
            else {
                // Remove completed animation
                animation.element.remove();
                return false;
            }
        });
    }
}


;// ./src/FUNC/Logger.ts
class Logger {
    getHeader(method) {
        return "[" + "KxsClient" + " - " + method + "]";
    }
    展示(...args) {
        console.log(...args);
    }
    ;
    log(...args) {
        // Convert args to string and join them
        const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
        this.展示(this.getHeader("LOG"), message);
    }
    warn(...args) {
        const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
        this.展示(this.getHeader("WARN"), message);
    }
    error(...args) {
        const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
        this.展示(this.getHeader("ERROR"), message);
    }
}


// EXTERNAL MODULE: ../../GitLab/SteganoDB2/lib/browser.js
var browser = __webpack_require__(686);
;// ./src/HUD/HistoryManager.ts
var HistoryManager_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class GameHistoryMenu {
    constructor(kxsClient) {
        this.kxsClient = kxsClient;
        this.container = document.createElement('div');
        this.closeBtn = document.createElement('button');
    }
    initContainer() {
        const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
        // Position the menu in the center of the screen
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '78vw' : '700px',
            maxWidth: isMobile ? '84vw' : '90vw',
            maxHeight: isMobile ? '60vh' : '80vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            color: '#fff',
            borderRadius: isMobile ? '7px' : '12px',
            border: '1px solid rgba(60, 80, 120, 0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            zIndex: '10001',
            padding: isMobile ? '6px' : '20px',
            boxSizing: 'border-box',
            fontFamily: "'Segoe UI', Arial, sans-serif",
        });
    }
    addCloseButton() {
        this.closeBtn.textContent = '✖';
        Object.assign(this.closeBtn.style, {
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'transparent',
            color: '#fff',
            border: 'none',
            fontSize: '22px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, color 0.2s ease',
            zIndex: '10',
        });
        this.closeBtn.onclick = (e) => {
            e.stopPropagation();
            this.hide();
        };
        this.closeBtn.onmouseenter = () => {
            this.closeBtn.style.color = '#3B82F6';
            this.closeBtn.style.transform = 'scale(1.1)';
        };
        this.closeBtn.onmouseleave = () => {
            this.closeBtn.style.color = '#fff';
            this.closeBtn.style.transform = 'scale(1)';
        };
        this.container.appendChild(this.closeBtn);
    }
    addHeader() {
        // Create a title area at the top of the menu (header)
        const header = document.createElement('div');
        header.style.position = 'absolute';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.height = '40px';
        // No border at the bottom
        // Add a centered title
        const title = document.createElement('div');
        title.textContent = 'Game History';
        title.style.position = 'absolute';
        title.style.left = '50%';
        title.style.top = '50%';
        title.style.transform = 'translate(-50%, -50%)';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';
        title.style.color = '#fff';
        header.appendChild(title);
        this.container.insertBefore(header, this.container.firstChild);
    }
    renderContent() {
        return HistoryManager_awaiter(this, void 0, void 0, function* () {
            // Header
            const header = document.createElement('div');
            header.textContent = 'Game History';
            const isMobile = this.kxsClient.isMobile && this.kxsClient.isMobile();
            Object.assign(header.style, {
                fontWeight: 'bold',
                fontSize: isMobile ? '1.1em' : '1.3em',
                letterSpacing: '1px',
                margin: isMobile ? '10px 0 12px 0' : '10px 0 20px 0',
                textAlign: 'center',
                color: '#3B82F6',
            });
            this.container.appendChild(header);
            // Liste de l'historique
            let historyList = document.createElement('div');
            Object.assign(historyList.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '6px' : '8px',
                padding: isMobile ? '0 8px' : '0 15px',
                width: '100%',
            });
            // Récupération de l'historique via SteganoDB
            let result = this.kxsClient.db.all();
            let entries = [];
            // Traitement de la structure JSON gameplay_history
            if (result && typeof result === 'object') {
                // Vérifier si c'est la structure gameplay_history
                if ('gameplay_history' in result && Array.isArray(result.gameplay_history)) {
                    entries = result.gameplay_history;
                    // Tri par date décroissante
                    entries.sort((a, b) => {
                        if (a.id && b.id)
                            return b.id.localeCompare(a.id);
                        return 0;
                    });
                }
                else {
                    // Fallback pour l'ancienne structure
                    entries = Array.isArray(result) ? result : [];
                }
            }
            // Affichage ligne par ligne
            if (!entries || entries.length === 0) {
                const empty = document.createElement('div');
                empty.textContent = 'No games recorded.';
                empty.style.textAlign = 'center';
                empty.style.color = '#aaa';
                historyList.appendChild(empty);
            }
            else {
                let i = 1;
                for (const entry of entries) {
                    let key, value;
                    // Structure gameplay_history
                    if (typeof entry === 'object' && entry.id && entry.value) {
                        key = entry.id;
                        value = entry.value;
                        // Traitement des games dans value
                        if (typeof value === 'object') {
                            for (const gameId in value) {
                                const gameStats = value[gameId];
                                this.createGameHistoryLine(historyList, gameStats, key, i, isMobile);
                                i++;
                            }
                            continue; // Passer à l'entrée suivante après avoir traité tous les jeux
                        }
                    }
                    // Ancienne structure
                    else if (Array.isArray(entry) && entry.length === 2) {
                        key = entry[0];
                        value = entry[1];
                    }
                    else if (typeof entry === 'object' && entry.key && entry.value) {
                        key = entry.key;
                        value = entry.value;
                    }
                    else {
                        continue;
                    }
                    // Pour l'ancienne structure, créer une ligne
                    this.createGameHistoryLine(historyList, value, key, i, isMobile);
                    i++;
                }
            }
            this.container.appendChild(historyList);
        });
    }
    createGameHistoryLine(historyList, stats, dateKey, index, isMobile) {
        const line = document.createElement('div');
        Object.assign(line.style, {
            background: index % 2 ? 'rgba(31, 41, 55, 0.7)' : 'rgba(17, 24, 39, 0.8)',
            borderRadius: isMobile ? '5px' : '8px',
            padding: isMobile ? '6px 8px' : '10px 15px',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: isMobile ? '0.8em' : '0.95em',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '4px' : '12px',
            transition: 'background 0.2s, transform 0.1s',
            cursor: 'pointer',
            border: '1px solid transparent',
        });
        // Effet hover
        line.onmouseenter = () => {
            line.style.background = 'rgba(59, 130, 246, 0.3)';
            line.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            line.style.transform = 'translateY(-1px)';
        };
        line.onmouseleave = () => {
            line.style.background = index % 2 ? 'rgba(31, 41, 55, 0.7)' : 'rgba(17, 24, 39, 0.8)';
            line.style.borderColor = 'transparent';
            line.style.transform = 'translateY(0)';
        };
        // Date formatée
        const dateStr = dateKey ? new Date(dateKey).toLocaleString() : '';
        const dateEl = document.createElement('div');
        dateEl.textContent = dateStr;
        Object.assign(dateEl.style, {
            color: '#93c5fd',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            marginRight: isMobile ? '0' : '10px',
        });
        // Stats du jeu
        const statsContainer = document.createElement('div');
        Object.assign(statsContainer.style, {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: isMobile ? '3px 8px' : '0 15px',
            flex: '1',
        });
        // Création des éléments de stats
        const createStatElement = (label, value, color = '#fff') => {
            const statEl = document.createElement('div');
            statEl.style.display = 'inline-flex';
            statEl.style.alignItems = 'center';
            statEl.style.marginRight = isMobile ? '5px' : '12px';
            const labelEl = document.createElement('span');
            labelEl.textContent = `${label}: `;
            labelEl.style.color = '#9ca3af';
            const valueEl = document.createElement('span');
            valueEl.textContent = value !== undefined && value !== null ? String(value) : '-';
            valueEl.style.color = color;
            valueEl.style.fontWeight = 'bold';
            statEl.appendChild(labelEl);
            statEl.appendChild(valueEl);
            return statEl;
        };
        // Ajout des stats avec couleurs
        if (typeof stats === 'object') {
            const isWin = stats.isWin === true;
            statsContainer.appendChild(createStatElement('Player', stats.username, '#fff'));
            statsContainer.appendChild(createStatElement('Kills', stats.kills, '#ef4444'));
            statsContainer.appendChild(createStatElement('DMG', stats.damageDealt, '#f59e0b'));
            statsContainer.appendChild(createStatElement('Taken', stats.damageTaken, '#a855f7'));
            statsContainer.appendChild(createStatElement('Duration', stats.duration, '#fff'));
            // Position avec couleur selon le rang
            let posColor = '#fff';
            if (stats.position) {
                const pos = parseInt(stats.position.replace('#', ''));
                if (pos <= 10)
                    posColor = '#fbbf24'; // Or
                else if (pos <= 25)
                    posColor = '#94a3b8'; // Argent
                else if (pos <= 50)
                    posColor = '#b45309'; // Bronze
            }
            statsContainer.appendChild(createStatElement('Pos', stats.position, posColor));
            // Indicateur de victoire
            if (isWin) {
                const winEl = document.createElement('div');
                winEl.textContent = '🏆 WIN';
                winEl.style.color = '#fbbf24';
                winEl.style.fontWeight = 'bold';
                winEl.style.marginLeft = 'auto';
                statsContainer.appendChild(winEl);
            }
        }
        else {
            // Fallback si stats n'est pas un objet
            const fallbackEl = document.createElement('div');
            fallbackEl.textContent = typeof stats === 'string' ? stats : JSON.stringify(stats);
            statsContainer.appendChild(fallbackEl);
        }
        line.appendChild(dateEl);
        line.appendChild(statsContainer);
        historyList.appendChild(line);
    }
    show() {
        // Recréer le conteneur pour un contenu frais
        this.container = document.createElement('div');
        this.closeBtn = document.createElement('button');
        // Réinitialiser le conteneur
        this.initContainer();
        // Ajouter le bouton de fermeture
        this.addCloseButton();
        // Ajouter l'en-tête avec le titre
        this.addHeader();
        // Charger et afficher l'historique des jeux actualisé
        this.renderContent();
        // Close RSHIFT menu if it's open
        if (this.kxsClient.secondaryMenu && typeof this.kxsClient.secondaryMenu.getMenuVisibility === 'function') {
            if (this.kxsClient.secondaryMenu.getMenuVisibility()) {
                this.kxsClient.secondaryMenu.toggleMenuVisibility();
            }
        }
        // Prevent mouse event propagation
        this.container.addEventListener('click', (e) => e.stopPropagation());
        this.container.addEventListener('wheel', (e) => e.stopPropagation());
        this.container.addEventListener('mousedown', (e) => e.stopPropagation());
        this.container.addEventListener('mouseup', (e) => e.stopPropagation());
        this.container.addEventListener('contextmenu', (e) => e.stopPropagation());
        this.container.addEventListener('dblclick', (e) => e.stopPropagation());
        // Center the menu on screen
        this.container.style.top = '50%';
        this.container.style.left = '50%';
        this.container.style.transform = 'translate(-50%, -50%)';
        // Add fade-in animation
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.2s ease-in-out';
        setTimeout(() => {
            this.container.style.opacity = '1';
        }, 10);
        document.body.appendChild(this.container);
    }
    hide() {
        // Clean up listeners before removing the menu
        if (this.container) {
            // Supprimer tous les gestionnaires d'événements
            const allElements = this.container.querySelectorAll('*');
            allElements.forEach(element => {
                const el = element;
                el.replaceWith(el.cloneNode(true));
            });
            // Remove the container
            this.container.remove();
        }
        // Reset document cursor in case it was changed
        document.body.style.cursor = '';
    }
    // Méthode alias pour compatibilité avec le code existant
    close() {
        this.hide();
    }
}


;// ./src/NETWORK/KxsNetwork.ts

class KxsNetwork {
    sendGlobalChatMessage(text) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
            return;
        const payload = {
            op: 7,
            d: {
                user: this.getUsername(),
                text
            }
        };
        this.send(payload);
    }
    constructor(kxsClient) {
        this.currentGamePlayers = [];
        this.ws = null;
        this.heartbeatInterval = 0;
        this.isAuthenticated = false;
        this.HOST = config_namespaceObject.api_url;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
        this.reconnectTimeout = 0;
        this.reconnectDelay = 15000; // Initial reconnect delay of 1 second
        this.kxsUsers = 0;
        this.privateUsername = this.generateRandomUsername();
        this.kxs_users = [];
        this.kxsClient = kxsClient;
    }
    connect() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.kxsClient.logger.log('[KxsNetwork] WebSocket already connected');
            return;
        }
        this.ws = new WebSocket(this.getWebSocketURL());
        this.ws.onopen = () => {
            this.kxsClient.logger.log('[KxsNetwork] WebSocket connection established');
            // Reset reconnect attempts on successful connection
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
        };
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
        this.ws.onerror = (error) => {
            this.kxsClient.nm.showNotification('WebSocket error: ' + error.type, 'error', 900);
        };
        this.ws.onclose = () => {
            this.kxsClient.nm.showNotification('Disconnected from KxsNetwork', 'info', 1100);
            clearInterval(this.heartbeatInterval);
            this.isAuthenticated = false;
            // Try to reconnect
            this.attemptReconnect();
        };
    }
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            // Use exponential backoff for reconnection attempts
            const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
            this.kxsClient.logger.log(`[KxsNetwork] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
            // Clear any existing timeout
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }
            // Set timeout for reconnection
            this.reconnectTimeout = setTimeout(() => {
                this.connect();
            }, delay);
        }
        else {
            this.kxsClient.logger.log('[KxsNetwork] Maximum reconnection attempts reached');
            this.kxsClient.nm.showNotification('Failed to reconnect after multiple attempts', 'error', 2000);
        }
    }
    generateRandomUsername() {
        let char = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let username = '';
        for (let i = 0; i < 6; i++) {
            username += char[Math.floor(Math.random() * char.length)];
        }
        return "kxs_" + username;
    }
    getUsername() {
        return this.kxsClient.kxsNetworkSettings.nickname_anonymized ? this.privateUsername : JSON.parse(localStorage.getItem("surviv_config") || "{}").playerName;
    }
    identify() {
        const payload = {
            op: 2,
            d: {
                username: this.getUsername(),
                isVoiceChat: this.kxsClient.isVoiceChatEnabled
            }
        };
        this.send(payload);
    }
    handleMessage(_data) {
        const { op, d } = _data;
        switch (op) {
            case 1: //Heart
                {
                    if (d === null || d === void 0 ? void 0 : d.count)
                        this.kxsUsers = d.count;
                    if (d === null || d === void 0 ? void 0 : d.players)
                        this.kxs_users = d.players;
                }
                break;
            case 3: // Kxs user join game
                {
                    if (d && Array.isArray(d.players)) {
                        const myName = this.getUsername();
                        const previousPlayers = this.currentGamePlayers;
                        const currentPlayers = d.players.filter((name) => name !== myName);
                        // Détecter les nouveaux joueurs (hors soi-même)
                        const newPlayers = currentPlayers.filter((name) => !previousPlayers.includes(name));
                        for (const newPlayer of newPlayers) {
                            if (this.kxsClient.isKxsChatEnabled) {
                                this.kxsClient.chat.addSystemMessage(`${newPlayer} joined the game as a Kxs player`);
                            }
                            else {
                                this.kxsClient.nm.showNotification(`🎉 ${newPlayer} is a Kxs player!`, 'info', 3500);
                            }
                        }
                        this.currentGamePlayers = currentPlayers;
                    }
                }
                break;
            case 7: // Global chat message
                {
                    if (d && d.user && d.text) {
                        this.kxsClient.chat.addChatMessage(d.user, d.text);
                    }
                }
                break;
            case 10: // Hello
                {
                    const { heartbeat_interval } = d;
                    this.startHeartbeat(heartbeat_interval);
                    this.identify();
                }
                break;
            case 2: // Dispatch
                {
                    if (d === null || d === void 0 ? void 0 : d.uuid) {
                        this.isAuthenticated = true;
                    }
                }
                break;
            case 98: // VOICE CHAT UPDATE
                {
                    if (d && !d.isVoiceChat && d.user) {
                        this.kxsClient.voiceChat.removeUserFromVoice(d.user);
                    }
                }
                break;
        }
    }
    startHeartbeat(interval) {
        // Clear existing interval if it exists
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        this.heartbeatInterval = setInterval(() => {
            this.send({
                op: 1,
                d: {}
            });
        }, interval);
    }
    send(data) {
        var _a;
        if (((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
    disconnect() {
        if (this.ws) {
            // Clear all timers
            clearInterval(this.heartbeatInterval);
            clearTimeout(this.reconnectTimeout);
            // Reset reconnection state
            this.reconnectAttempts = 0;
            // Close the connection
            this.ws.close();
        }
    }
    reconnect() {
        this.disconnect();
        this.connect();
    }
    sendGameInfoToWebSocket(gameId) {
        if (!this.isAuthenticated || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return;
        }
        try {
            const payload = {
                op: 3, // Custom operation code for game info
                d: {
                    type: 'find_game_response',
                    gameId,
                    user: this.getUsername()
                }
            };
            this.send(payload);
        }
        catch (error) {
        }
    }
    getWebSocketURL() {
        let isSecured = this.HOST.startsWith("https://");
        let protocols = isSecured ? "wss://" : "ws://";
        return protocols + this.HOST.split("/")[2];
    }
    getHTTPURL() {
        return this.HOST;
    }
    getOnlineCount() {
        return this.kxsUsers;
    }
    getKxsUsers() {
        return this.kxs_users;
    }
    gameEnded() {
        var _a;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({ op: 4, d: {} }));
    }
}


;// ./src/UTILS/KxsChat.ts
class KxsChat {
    constructor(kxsClient) {
        this.chatInput = null;
        this.chatBox = null;
        this.messagesContainer = null;
        this.chatMessages = [];
        this.chatOpen = false;
        this.handleKeyDown = (e) => {
            if (e.key === 'Enter' && !this.chatOpen && document.activeElement !== this.chatInput) {
                e.preventDefault();
                this.openChatInput();
            }
            else if (e.key === 'Escape' && this.chatOpen) {
                this.closeChatInput();
            }
        };
        this.kxsClient = kxsClient;
        this.initGlobalChat();
        // Initialize chat visibility based on the current setting
        if (this.chatBox && !this.kxsClient.isKxsChatEnabled) {
            this.chatBox.style.display = 'none';
            window.removeEventListener('keydown', this.handleKeyDown);
        }
    }
    initGlobalChat() {
        const area = document.getElementById('game-touch-area');
        if (!area)
            return;
        // Chat box
        const chatBox = document.createElement('div');
        chatBox.id = 'kxs-chat-box';
        // Messages container
        const messagesContainer = document.createElement('div');
        messagesContainer.id = 'kxs-chat-messages';
        messagesContainer.style.display = 'flex';
        messagesContainer.style.flexDirection = 'column';
        messagesContainer.style.gap = '3px';
        chatBox.appendChild(messagesContainer);
        this.messagesContainer = messagesContainer;
        chatBox.style.position = 'absolute';
        chatBox.style.left = '50%';
        chatBox.style.bottom = '38px';
        chatBox.style.transform = 'translateX(-50%)';
        chatBox.style.minWidth = '260px';
        chatBox.style.maxWidth = '480px';
        chatBox.style.background = 'rgba(30,30,40,0.80)';
        chatBox.style.color = '#fff';
        chatBox.style.borderRadius = '10px';
        chatBox.style.padding = '7px 14px 4px 14px';
        chatBox.style.fontSize = '15px';
        chatBox.style.fontFamily = 'inherit';
        chatBox.style.zIndex = '1002';
        chatBox.style.pointerEvents = 'auto';
        chatBox.style.cursor = 'move'; // Indique que c'est déplaçable
        chatBox.style.display = 'flex';
        chatBox.style.flexDirection = 'column';
        chatBox.style.gap = '3px';
        chatBox.style.opacity = '0.5';
        // Charger la position sauvegardée dès l'initialisation
        const savedPosition = localStorage.getItem('kxs-chat-box-position');
        if (savedPosition) {
            try {
                const { x, y } = JSON.parse(savedPosition);
                chatBox.style.left = `${x}px`;
                chatBox.style.top = `${y}px`;
                chatBox.style.position = 'absolute';
            }
            catch (e) { }
        }
        area.appendChild(chatBox);
        this.chatBox = chatBox;
        // Rendre la chatbox draggable UNIQUEMENT si le menu secondaire est ouvert
        const updateChatDraggable = () => {
            const isMenuOpen = this.kxsClient.secondaryMenu.getMenuVisibility();
            if (isMenuOpen) {
                chatBox.style.pointerEvents = 'auto';
                chatBox.style.cursor = 'move';
                this.kxsClient.makeDraggable(chatBox, 'kxs-chat-box-position');
            }
            else {
                chatBox.style.pointerEvents = 'none';
                chatBox.style.cursor = 'default';
            }
        };
        // Initial state
        updateChatDraggable();
        // Observe menu changes
        const observer = new MutationObserver(updateChatDraggable);
        if (this.kxsClient.secondaryMenu && this.kxsClient.secondaryMenu.menu) {
            observer.observe(this.kxsClient.secondaryMenu.menu, { attributes: true, attributeFilter: ['style', 'class'] });
        }
        // Optionnel : timer pour fallback (si le menu est modifié autrement)
        setInterval(updateChatDraggable, 500);
        // Input
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Press Enter to write...';
        input.id = 'kxs-chat-input';
        input.style.width = '100%';
        input.style.boxSizing = 'border-box';
        input.style.padding = '8px 12px';
        input.style.borderRadius = '8px';
        input.style.border = 'none';
        input.style.background = 'rgba(40,40,50,0.95)';
        input.style.color = '#fff';
        input.style.fontSize = '15px';
        input.style.fontFamily = 'inherit';
        input.style.zIndex = '1003';
        input.style.outline = 'none';
        input.style.display = this.chatOpen ? 'block' : 'none';
        input.style.opacity = '0.5';
        input.style.marginTop = 'auto'; // Pour coller l'input en bas
        chatBox.appendChild(input); // Ajoute l'input dans la chatBox
        this.chatInput = input;
        // Ajuste le style de chatBox pour le layout
        chatBox.style.display = 'flex';
        chatBox.style.flexDirection = 'column';
        chatBox.style.gap = '3px';
        chatBox.style.justifyContent = 'flex-end'; // S'assure que l'input est en bas
        // Focus automatique sur l'input quand on clique dessus ou sur la chatBox
        input.addEventListener('focus', () => {
            // Rien de spécial, mais peut servir à customiser plus tard
        });
        chatBox.addEventListener('mousedown', (e) => {
            // Focus l'input si clic sur la chatBox (hors drag)
            if (e.target === chatBox) {
                input.focus();
            }
        });
        input.addEventListener('mousedown', () => {
            input.focus();
        });
        ['keydown', 'keypress', 'keyup'].forEach(eventType => {
            input.addEventListener(eventType, (e) => {
                const ke = e;
                if (eventType === 'keydown') {
                    if (ke.key === 'Enter') {
                        const txt = input.value.trim();
                        if (txt) {
                            this.kxsClient.kxsNetwork.sendGlobalChatMessage(txt);
                            input.value = '';
                            this.closeChatInput();
                        }
                        else {
                            // Ne ferme pas l'input si rien n'a été écrit
                            input.value = '';
                        }
                    }
                    else if (ke.key === 'Escape') {
                        this.closeChatInput();
                    }
                }
                e.stopImmediatePropagation();
                e.stopPropagation();
            }, true);
        });
        // Gestion clavier
        window.addEventListener('keydown', this.handleKeyDown);
    }
    openChatInput() {
        if (!this.chatInput)
            return;
        this.chatInput.placeholder = 'Press Enter to write...';
        this.chatInput.value = '';
        this.chatInput.style.display = 'block';
        this.chatInput.focus();
        this.chatOpen = true;
    }
    closeChatInput() {
        if (!this.chatInput)
            return;
        this.chatInput.style.display = 'none';
        this.chatInput.blur();
        this.chatOpen = false;
    }
    addChatMessage(user, text) {
        if (!this.chatBox || !this.kxsClient.isKxsChatEnabled)
            return;
        this.chatMessages.push({ user, text, isSystem: false });
        if (this.chatMessages.length > 5)
            this.chatMessages.shift();
        this.renderMessages();
    }
    /**
     * Ajoute un message système dans le chat
     * @param text Texte du message système
     */
    addSystemMessage(text) {
        if (!this.chatBox || !this.kxsClient.isKxsChatEnabled)
            return;
        // Ajouter le message système avec un marqueur spécifique isSystem = true
        this.chatMessages.push({ user: "", text, isSystem: true });
        if (this.chatMessages.length > 5)
            this.chatMessages.shift();
        this.renderMessages();
    }
    /**
     * Rend les messages du chat avec leur style approprié
     */
    renderMessages() {
        if (!this.messagesContainer)
            return;
        this.messagesContainer.innerHTML = this.chatMessages.map(m => {
            if (m.isSystem) {
                return `<span style='color:#3B82F6; font-style:italic;'>${m.text}</span>`;
            }
            else {
                return `<span><b style='color:#3fae2a;'>${m.user}</b>: ${m.text}</span>`;
            }
        }).join('');
    }
    toggleChat() {
        if (this.chatBox) {
            this.chatBox.style.display = this.kxsClient.isKxsChatEnabled ? 'flex' : 'none';
        }
        if (this.kxsClient.isKxsChatEnabled) {
            window.addEventListener('keydown', this.handleKeyDown);
        }
        else {
            this.closeChatInput();
            window.removeEventListener('keydown', this.handleKeyDown);
        }
        const message = this.kxsClient.isKxsChatEnabled ? 'Chat enabled' : 'Chat disabled';
        const type = this.kxsClient.isKxsChatEnabled ? 'success' : 'info';
        this.kxsClient.nm.showNotification(message, type, 600);
    }
}


;// ./src/UTILS/KxsVoiceChat.ts
var KxsVoiceChat_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class KxsVoiceChat {
    constructor(kxsClient, kxsNetwork) {
        this.audioCtx = null;
        this.micStream = null;
        this.micSource = null;
        this.processor = null;
        // Overlay elements
        this.overlayContainer = null;
        this.activeUsers = new Map();
        this.mutedUsers = new Set();
        this.activityCheckInterval = null;
        this.isOverlayVisible = true;
        this.isLocalMuted = false;
        this.localMuteButton = null;
        // Constants
        this.ACTIVITY_THRESHOLD = 0.01;
        this.INACTIVITY_TIMEOUT = 2000;
        this.REMOVAL_TIMEOUT = 30000;
        this.ACTIVITY_CHECK_INTERVAL = 500;
        this.kxsClient = kxsClient;
        this.kxsNetwork = kxsNetwork;
        this.createOverlayContainer();
    }
    /**
     * Remove a user from voice chat (e.g., when muted)
     */
    removeUserFromVoice(username) {
        if (this.activeUsers.has(username)) {
            this.activeUsers.delete(username);
            this.updateOverlayUI();
        }
    }
    startVoiceChat() {
        return KxsVoiceChat_awaiter(this, void 0, void 0, function* () {
            if (!this.kxsClient.isVoiceChatEnabled)
                return;
            this.cleanup();
            this.showOverlay();
            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.micStream = yield navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: 48000,
                        channelCount: 1,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                this.micSource = this.audioCtx.createMediaStreamSource(this.micStream);
                this.processor = this.audioCtx.createScriptProcessor(2048, 1, 1);
                this.micSource.connect(this.processor);
                this.processor.connect(this.audioCtx.destination);
                // Set up audio processing
                this.setupAudioProcessing();
                this.setupWebSocketListeners();
            }
            catch (error) {
                alert("Unable to initialize voice chat: " + error.message);
                this.cleanup();
            }
        });
    }
    setupAudioProcessing() {
        if (!this.processor)
            return;
        this.processor.onaudioprocess = (e) => {
            if (!this.kxsNetwork.ws || this.kxsNetwork.ws.readyState !== WebSocket.OPEN)
                return;
            // Ne pas envoyer les données audio si l'utilisateur local est muté
            if (this.isLocalMuted)
                return;
            const input = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(input.length);
            for (let i = 0; i < input.length; i++) {
                int16[i] = Math.max(-32768, Math.min(32767, input[i] * 32767));
            }
            this.kxsNetwork.ws.send(JSON.stringify({ op: 99, d: Array.from(int16) }));
        };
    }
    setupWebSocketListeners() {
        if (!this.kxsNetwork.ws)
            return;
        this.kxsNetwork.ws.addEventListener('message', this.handleAudioMessage.bind(this));
    }
    handleAudioMessage(msg) {
        let parsed;
        try {
            parsed = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
        }
        catch (_a) {
            return;
        }
        if (!parsed || parsed.op !== 99 || !parsed.d || !parsed.u)
            return;
        try {
            // Skip if user is muted
            if (this.mutedUsers.has(parsed.u))
                return;
            const int16Data = new Int16Array(parsed.d);
            const floatData = new Float32Array(int16Data.length);
            // Calculate audio level for visualization
            let audioLevel = 0;
            for (let i = 0; i < int16Data.length; i++) {
                floatData[i] = int16Data[i] / 32767;
                audioLevel += floatData[i] * floatData[i];
            }
            audioLevel = Math.sqrt(audioLevel / int16Data.length);
            // Update user activity in the overlay
            this.updateUserActivity(parsed.u, audioLevel);
            // Play the audio
            this.playAudio(floatData);
        }
        catch (error) {
            console.error("Audio processing error:", error);
        }
    }
    playAudio(floatData) {
        if (!this.audioCtx)
            return;
        const buffer = this.audioCtx.createBuffer(1, floatData.length, this.audioCtx.sampleRate);
        buffer.getChannelData(0).set(floatData);
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        source.start();
    }
    stopVoiceChat() {
        this.cleanup();
        this.hideOverlay();
    }
    cleanup() {
        if (this.processor) {
            this.processor.disconnect();
            this.processor = null;
        }
        if (this.micSource) {
            this.micSource.disconnect();
            this.micSource = null;
        }
        if (this.micStream) {
            this.micStream.getTracks().forEach(track => track.stop());
            this.micStream = null;
        }
        if (this.audioCtx) {
            this.audioCtx.close();
            this.audioCtx = null;
        }
        if (this.activityCheckInterval) {
            window.clearInterval(this.activityCheckInterval);
            this.activityCheckInterval = null;
        }
    }
    toggleVoiceChat() {
        var _a, _b;
        if (this.kxsClient.isVoiceChatEnabled) {
            (_a = this.kxsNetwork.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                op: 98,
                d: { isVoiceChat: true }
            }));
            this.startVoiceChat();
        }
        else {
            this.stopVoiceChat();
            (_b = this.kxsNetwork.ws) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                op: 98,
                d: { isVoiceChat: false }
            }));
        }
    }
    createOverlayContainer() {
        if (this.overlayContainer)
            return;
        this.overlayContainer = document.createElement('div');
        this.overlayContainer.id = 'kxs-voice-chat-overlay';
        Object.assign(this.overlayContainer.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '200px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '1000',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            display: 'none',
            cursor: 'move'
        });
        // Charger la position sauvegardée si elle existe
        const savedPosition = localStorage.getItem('kxs-voice-chat-position');
        if (savedPosition) {
            try {
                const { x, y } = JSON.parse(savedPosition);
                this.overlayContainer.style.left = `${x}px`;
                this.overlayContainer.style.top = `${y}px`;
                this.overlayContainer.style.right = 'auto';
            }
            catch (e) { }
        }
        // Add title and controls container (for title and mute button)
        const controlsContainer = document.createElement('div');
        Object.assign(controlsContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            paddingBottom: '5px'
        });
        // Title
        const title = document.createElement('div');
        title.textContent = 'Voice Chat';
        Object.assign(title.style, {
            fontWeight: 'bold'
        });
        // Fonction pour mettre à jour l'état draggable selon la visibilité du menu RSHIFT
        const updateVoiceChatDraggable = () => {
            const isMenuOpen = this.kxsClient.secondaryMenu.getMenuVisibility();
            if (isMenuOpen) {
                this.overlayContainer.style.pointerEvents = 'auto';
                this.overlayContainer.style.cursor = 'move';
                this.kxsClient.makeDraggable(this.overlayContainer, 'kxs-voice-chat-position');
            }
            else {
                this.overlayContainer.style.pointerEvents = 'none';
                this.overlayContainer.style.cursor = 'default';
            }
        };
        // Initial state
        updateVoiceChatDraggable();
        // Observer les changements du menu
        const observer = new MutationObserver(updateVoiceChatDraggable);
        if (this.kxsClient.secondaryMenu && this.kxsClient.secondaryMenu.menu) {
            observer.observe(this.kxsClient.secondaryMenu.menu, { attributes: true, attributeFilter: ['style', 'class'] });
        }
        // Fallback timer pour s'assurer de l'état correct
        setInterval(updateVoiceChatDraggable, 500);
        // Create local mute button
        this.localMuteButton = this.createLocalMuteButton();
        // Add elements to controls container
        controlsContainer.appendChild(title);
        controlsContainer.appendChild(this.localMuteButton);
        this.overlayContainer.appendChild(controlsContainer);
        // Container for users
        const usersContainer = document.createElement('div');
        usersContainer.id = 'kxs-voice-chat-users';
        this.overlayContainer.appendChild(usersContainer);
        document.body.appendChild(this.overlayContainer);
        this.startActivityCheck();
    }
    showOverlay() {
        if (!this.overlayContainer)
            return;
        this.overlayContainer.style.display = 'block';
        this.isOverlayVisible = true;
        if (!this.activityCheckInterval) {
            this.startActivityCheck();
        }
    }
    hideOverlay() {
        if (!this.overlayContainer)
            return;
        this.overlayContainer.style.display = 'none';
        this.isOverlayVisible = false;
    }
    toggleOverlay() {
        if (this.isOverlayVisible) {
            this.hideOverlay();
        }
        else {
            this.showOverlay();
        }
        return this.isOverlayVisible;
    }
    updateUserActivity(username, audioLevel) {
        const now = Date.now();
        const isActive = audioLevel > this.ACTIVITY_THRESHOLD;
        let user = this.activeUsers.get(username);
        if (!user) {
            user = {
                username,
                isActive,
                lastActivity: now,
                audioLevel,
                isMuted: this.mutedUsers.has(username)
            };
            this.activeUsers.set(username, user);
        }
        else {
            user.isActive = isActive;
            user.lastActivity = now;
            user.audioLevel = audioLevel;
            user.isMuted = this.mutedUsers.has(username);
        }
        this.updateOverlayUI();
    }
    startActivityCheck() {
        this.activityCheckInterval = window.setInterval(() => {
            const now = Date.now();
            let updated = false;
            this.activeUsers.forEach((user, username) => {
                // Set inactive if no activity for the specified timeout
                if (now - user.lastActivity > this.INACTIVITY_TIMEOUT && user.isActive) {
                    user.isActive = false;
                    updated = true;
                }
                // Remove users inactive for longer period
                if (now - user.lastActivity > this.REMOVAL_TIMEOUT) {
                    this.activeUsers.delete(username);
                    updated = true;
                }
            });
            if (updated) {
                this.updateOverlayUI();
            }
        }, this.ACTIVITY_CHECK_INTERVAL);
    }
    updateOverlayUI() {
        if (!this.overlayContainer || !this.isOverlayVisible)
            return;
        const usersContainer = document.getElementById('kxs-voice-chat-users');
        if (!usersContainer)
            return;
        // Clear existing users
        usersContainer.innerHTML = '';
        // Add users or show "no users" message
        if (this.activeUsers.size === 0) {
            this.renderNoUsersMessage(usersContainer);
        }
        else {
            this.activeUsers.forEach(user => {
                this.renderUserElement(usersContainer, user);
            });
        }
    }
    renderNoUsersMessage(container) {
        const noUsers = document.createElement('div');
        noUsers.textContent = 'No active users';
        Object.assign(noUsers.style, {
            color: 'rgba(255, 255, 255, 0.6)',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '5px'
        });
        container.appendChild(noUsers);
    }
    renderUserElement(container, user) {
        const userElement = document.createElement('div');
        userElement.className = 'kxs-voice-chat-user';
        Object.assign(userElement.style, {
            display: 'flex',
            alignItems: 'center',
            margin: '3px 0',
            padding: '3px',
            borderRadius: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        });
        // Status indicator
        const indicator = this.createStatusIndicator(user);
        // Username label
        const usernameLabel = document.createElement('span');
        usernameLabel.textContent = user.username;
        Object.assign(usernameLabel.style, {
            flexGrow: '1',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        });
        // Mute button - FIX: Create this element properly
        const muteButton = this.createMuteButton(user);
        // Add elements to container
        userElement.appendChild(indicator);
        userElement.appendChild(usernameLabel);
        userElement.appendChild(muteButton);
        container.appendChild(userElement);
    }
    createStatusIndicator(user) {
        const indicator = document.createElement('div');
        Object.assign(indicator.style, {
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            marginRight: '8px',
            cursor: 'pointer'
        });
        indicator.title = user.isMuted ? 'Unmute' : 'Mute';
        if (user.isActive) {
            const scale = 1 + Math.min(user.audioLevel * 3, 1);
            Object.assign(indicator.style, {
                backgroundColor: '#2ecc71',
                transform: `scale(${scale})`,
                boxShadow: '0 0 5px #2ecc71',
                transition: 'transform 0.1s ease-in-out'
            });
        }
        else {
            indicator.style.backgroundColor = '#7f8c8d';
        }
        return indicator;
    }
    createMuteButton(user) {
        const muteButton = document.createElement('button');
        muteButton.type = 'button'; // Important: specify type to prevent form submission behavior
        muteButton.textContent = user.isMuted ? 'UNMUTE' : 'MUTE';
        Object.assign(muteButton.style, {
            backgroundColor: user.isMuted ? '#e74c3c' : '#7f8c8d',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            padding: '2px 5px',
            marginLeft: '5px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            minWidth: '40px'
        });
        muteButton.addEventListener('mouseover', () => {
            muteButton.style.opacity = '0.8';
        });
        muteButton.addEventListener('mouseout', () => {
            muteButton.style.opacity = '1';
        });
        const handleMuteToggle = (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            const newMutedState = !user.isMuted;
            user.isMuted = newMutedState;
            if (newMutedState) {
                this.mutedUsers.add(user.username);
            }
            else {
                this.mutedUsers.delete(user.username);
            }
            this.sendMuteState(user.username, newMutedState);
            this.updateOverlayUI();
            return false;
        };
        ['click', 'mousedown', 'pointerdown'].forEach(eventType => {
            muteButton.addEventListener(eventType, handleMuteToggle, true);
        });
        muteButton.onclick = (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            const newMutedState = !user.isMuted;
            user.isMuted = newMutedState;
            if (newMutedState) {
                this.mutedUsers.add(user.username);
            }
            else {
                this.mutedUsers.delete(user.username);
            }
            this.sendMuteState(user.username, newMutedState);
            this.updateOverlayUI();
            return false;
        };
        return muteButton;
    }
    sendMuteState(username, isMuted) {
        if (!this.kxsNetwork.ws || this.kxsNetwork.ws.readyState !== WebSocket.OPEN) {
            return;
        }
        this.kxsNetwork.ws.send(JSON.stringify({
            op: 100,
            d: {
                user: username,
                isMuted: isMuted
            }
        }));
    }
    createLocalMuteButton() {
        const muteButton = document.createElement('button');
        muteButton.type = 'button';
        muteButton.textContent = this.isLocalMuted ? 'UNMUTE' : 'MUTE';
        muteButton.id = 'kxs-voice-chat-local-mute';
        Object.assign(muteButton.style, {
            backgroundColor: this.isLocalMuted ? '#e74c3c' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            padding: '2px 5px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            minWidth: '55px'
        });
        muteButton.addEventListener('mouseover', () => {
            muteButton.style.opacity = '0.8';
        });
        muteButton.addEventListener('mouseout', () => {
            muteButton.style.opacity = '1';
        });
        // Utiliser un gestionnaire d'événement unique plus simple avec une vérification pour éviter les multiples déclenchements
        muteButton.onclick = (e) => {
            // Arrêter complètement la propagation de l'événement
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            // Basculer l'état de mute
            this.toggleLocalMute();
            return false;
        };
        return muteButton;
    }
    toggleLocalMute() {
        // Inverser l'état
        this.isLocalMuted = !this.isLocalMuted;
        // Mettre à jour l'apparence du bouton si présent
        if (this.localMuteButton) {
            // Définir clairement le texte et la couleur du bouton en fonction de l'état
            this.localMuteButton.textContent = this.isLocalMuted ? 'UNMUTE' : 'MUTE';
            this.localMuteButton.style.backgroundColor = this.isLocalMuted ? '#e74c3c' : '#3498db';
        }
        // Type de notification en fonction de si nous sommes sur error, info ou success
        const notificationType = this.isLocalMuted ? 'error' : 'success';
        // Notification de changement d'état
        const message = this.isLocalMuted ? 'You are muted' : 'You are unmuted';
        this.kxsClient.nm.showNotification(message, notificationType, 2000);
    }
}


;// ./src/KxsClient.ts
var KxsClient_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


















class KxsClient {
    constructor() {
        this.onlineMenuElement = null;
        this.onlineMenuInterval = null;
        this.deathObserver = null;
        this.adBlockObserver = null;
        globalThis.kxsClient = this;
        this.logger = new Logger();
        this.config = config_namespaceObject;
        this.menu = document.createElement("div");
        this.lastFrameTime = performance.now();
        this.isFpsUncapped = false;
        this.isFpsVisible = true;
        this.isPingVisible = true;
        this.isKillsVisible = true;
        this.isDeathSoundEnabled = true;
        this.isWinSoundEnabled = true;
        this.isHealthWarningEnabled = true;
        this.isAutoUpdateEnabled = true;
        this.isWinningAnimationEnabled = true;
        this.isKillLeaderTrackerEnabled = true;
        this.isKillFeedBlint = false;
        this.isSpotifyPlayerEnabled = false;
        this.discordToken = null;
        this.counters = {};
        this.all_friends = '';
        this.isMainMenuCleaned = false;
        this.isNotifyingForToggleMenu = true;
        this.isGunOverlayColored = true;
        this.customCrosshair = null;
        this.isGunBorderChromatic = false;
        this.isKxsChatEnabled = true;
        this.isVoiceChatEnabled = false;
        this.isFocusModeEnabled = false;
        this.isHealBarIndicatorEnabled = true;
        this.brightness = 50;
        this.isKxsClientLogoEnable = true;
        this.defaultPositions = {
            fps: { left: 20, top: 160 },
            ping: { left: 20, top: 220 },
            kills: { left: 20, top: 280 },
            lowHpWarning: { left: 285, top: 742 },
        };
        this.defaultSizes = {
            fps: { width: 100, height: 30 },
            ping: { width: 100, height: 30 },
            kills: { width: 100, height: 30 },
        };
        this.kxsNetworkSettings = {
            nickname_anonymized: false,
        };
        this.soundLibrary = {
            win_sound_url: win_sound,
            death_sound_url: death_sound,
            background_sound_url: background_song,
        };
        this.gridSystem = new GridSystem();
        this.db = new browser/* SteganoDB */.w({ database: "KxsClient", tableName: "gameplay_history" });
        // Before all, load local storage
        this.loadLocalStorage();
        this.updateLocalStorage();
        this.changeSurvevLogo();
        this.nm = NotificationManager.getInstance();
        this.discordRPC = new DiscordWebSocket(this, this.parseToken(this.discordToken));
        this.updater = new UpdateChecker(this);
        this.kill_leader = new KillLeaderTracker(this);
        this.healWarning = new HealthWarning(this);
        this.historyManager = new GameHistoryMenu(this);
        this.kxsNetwork = new KxsNetwork(this);
        this.setAnimationFrameCallback();
        this.loadBackgroundFromLocalStorage();
        this.initDeathDetection();
        this.discordRPC.connect();
        this.hud = new KxsClientHUD(this);
        this.secondaryMenu = new KxsClientSecondaryMenu(this);
        this.discordTracker = new DiscordTracking(this, this.discordWebhookUrl);
        this.chat = new KxsChat(this);
        this.voiceChat = new KxsVoiceChat(this, this.kxsNetwork);
        if (this.isSpotifyPlayerEnabled) {
            this.createSimpleSpotifyPlayer();
        }
        this.MainMenuCleaning();
        this.kxsNetwork.connect();
        this.createOnlineMenu();
        this.voiceChat.startVoiceChat();
    }
    parseToken(token) {
        if (token) {
            return token.replace(/^(["'`])(.+)\1$/, '$2');
        }
        return null;
    }
    getPlayerName() {
        let config = localStorage.getItem("surviv_config");
        if (config) {
            let configObject = JSON.parse(config);
            return configObject.playerName;
        }
    }
    changeSurvevLogo() {
        var startRowHeader = document.querySelector("#start-row-header");
        if (startRowHeader) {
            startRowHeader.style.backgroundImage =
                `url("${full_logo}")`;
        }
    }
    createOnlineMenu() {
        const overlay = document.getElementById('start-overlay');
        if (!overlay)
            return;
        const menu = document.createElement('div');
        menu.id = 'kxs-online-menu';
        menu.style.position = 'absolute';
        menu.style.top = '18px';
        menu.style.left = '18px';
        menu.style.background = 'rgba(30,30,40,0.92)';
        menu.style.color = '#fff';
        menu.style.padding = '8px 18px';
        menu.style.borderRadius = '12px';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
        menu.style.fontSize = '15px';
        menu.style.zIndex = '999';
        menu.style.userSelect = 'none';
        menu.style.pointerEvents = 'auto';
        menu.style.fontFamily = 'inherit';
        menu.style.display = 'flex';
        menu.style.alignItems = 'center';
        menu.style.cursor = 'pointer';
        menu.innerHTML = `
		  <span id="kxs-online-dot" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#3fae2a;margin-right:10px;box-shadow:0 0 8px #3fae2a;animation:kxs-pulse 1s infinite alternate;"></span>
		  <b></b> <span id="kxs-online-count">...</span>
		`;
        const userListMenu = document.createElement('div');
        userListMenu.id = 'kxs-online-users-menu';
        userListMenu.style.position = 'absolute';
        userListMenu.style.top = '100%';
        userListMenu.style.left = '0';
        userListMenu.style.marginTop = '8px';
        userListMenu.style.background = 'rgba(30,30,40,0.95)';
        userListMenu.style.color = '#fff';
        userListMenu.style.padding = '10px';
        userListMenu.style.borderRadius = '8px';
        userListMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        userListMenu.style.fontSize = '14px';
        userListMenu.style.zIndex = '1000';
        userListMenu.style.minWidth = '180px';
        userListMenu.style.maxHeight = '300px';
        userListMenu.style.overflowY = 'auto';
        userListMenu.style.display = 'none';
        userListMenu.style.flexDirection = 'column';
        userListMenu.style.gap = '6px';
        userListMenu.innerHTML = '<div style="text-align:center;padding:5px;">Chargement...</div>';
        menu.appendChild(userListMenu);
        if (!document.getElementById('kxs-online-style')) {
            const style = document.createElement('style');
            style.id = 'kxs-online-style';
            style.innerHTML = `
			@keyframes kxs-pulse {
			  0% { box-shadow:0 0 8px #3fae2a; opacity: 1; }
			  100% { box-shadow:0 0 16px #3fae2a; opacity: 0.6; }
			}
		  `;
            document.head.appendChild(style);
        }
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
            if (userListMenu) {
                const isVisible = userListMenu.style.display === 'flex';
                userListMenu.style.display = isVisible ? 'none' : 'flex';
                if (userListMenu.style.display === 'flex') {
                    setTimeout(() => {
                        const closeMenuOnClickOutside = (event) => {
                            if (!menu.contains(event.target) && !userListMenu.contains(event.target)) {
                                userListMenu.style.display = 'none';
                                document.removeEventListener('click', closeMenuOnClickOutside);
                            }
                        };
                        document.addEventListener('click', closeMenuOnClickOutside);
                    }, 0);
                }
            }
        });
        userListMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        overlay.appendChild(menu);
        this.onlineMenuElement = menu;
        this.updateOnlineMenu();
        this.onlineMenuInterval = window.setInterval(() => this.updateOnlineMenu(), 2000);
    }
    updateOnlineMenu() {
        return KxsClient_awaiter(this, void 0, void 0, function* () {
            if (!this.onlineMenuElement)
                return;
            const countEl = this.onlineMenuElement.querySelector('#kxs-online-count');
            const dot = this.onlineMenuElement.querySelector('#kxs-online-dot');
            const userListMenu = this.onlineMenuElement.querySelector('#kxs-online-users-menu');
            try {
                const res = this.kxsNetwork.getOnlineCount();
                const count = typeof res === 'number' ? res : '?';
                if (countEl)
                    countEl.textContent = `${count} Kxs users`;
                if (dot) {
                    dot.style.background = '#3fae2a';
                    dot.style.boxShadow = '0 0 8px #3fae2a';
                    dot.style.animation = 'kxs-pulse 1s infinite alternate';
                }
                if (userListMenu) {
                    const users = this.kxsNetwork.getKxsUsers();
                    if (users && Array.isArray(users) && users.length > 0) {
                        let userListHTML = '';
                        userListHTML += '<div style="text-align:center;font-weight:bold;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.2);margin-bottom:8px;">Online users</div>';
                        users.forEach(user => {
                            userListHTML += `<div style="padding:4px 8px;border-radius:4px;background:rgba(255,255,255,0.05);">
							<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3fae2a;margin-right:8px;"></span>
							${user}
						</div>`;
                        });
                        userListMenu.innerHTML = userListHTML;
                    }
                    else {
                        userListMenu.innerHTML = '<div style="text-align:center;padding:5px;">No users online</div>';
                    }
                }
            }
            catch (e) {
                if (countEl)
                    countEl.textContent = 'API offline';
                if (dot) {
                    dot.style.background = '#888';
                    dot.style.boxShadow = 'none';
                    dot.style.animation = '';
                }
                if (userListMenu) {
                    userListMenu.innerHTML = '<div style="text-align:center;padding:5px;">API offline</div>';
                }
            }
        });
    }
    detectDeviceType() {
        const ua = navigator.userAgent;
        if (/Mobi|Android/i.test(ua)) {
            if (/Tablet|iPad/i.test(ua)) {
                return "tablet";
            }
            return "mobile";
        }
        if (/iPad|Tablet/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
            return "tablet";
        }
        return "desktop";
    }
    isMobile() {
        return this.detectDeviceType() !== "desktop";
    }
    updateLocalStorage() {
        localStorage.setItem("userSettings", JSON.stringify({
            isFpsVisible: this.isFpsVisible,
            isPingVisible: this.isPingVisible,
            isFpsUncapped: this.isFpsUncapped,
            isKillsVisible: this.isKillsVisible,
            discordWebhookUrl: this.discordWebhookUrl,
            isDeathSoundEnabled: this.isDeathSoundEnabled,
            isWinSoundEnabled: this.isWinSoundEnabled,
            isHealthWarningEnabled: this.isHealthWarningEnabled,
            isAutoUpdateEnabled: this.isAutoUpdateEnabled,
            isWinningAnimationEnabled: this.isWinningAnimationEnabled,
            discordToken: this.discordToken,
            isKillLeaderTrackerEnabled: this.isKillLeaderTrackerEnabled,
            isKillFeedBlint: this.isKillFeedBlint,
            all_friends: this.all_friends,
            isSpotifyPlayerEnabled: this.isSpotifyPlayerEnabled,
            isMainMenuCleaned: this.isMainMenuCleaned,
            isNotifyingForToggleMenu: this.isNotifyingForToggleMenu,
            soundLibrary: this.soundLibrary,
            customCrosshair: this.customCrosshair,
            isGunOverlayColored: this.isGunOverlayColored,
            isGunBorderChromatic: this.isGunBorderChromatic,
            isVoiceChatEnabled: this.isVoiceChatEnabled,
            isKxsChatEnabled: this.isKxsChatEnabled,
            kxsNetworkSettings: this.kxsNetworkSettings,
            isHealBarIndicatorEnabled: this.isHealBarIndicatorEnabled,
            brightness: this.brightness,
            isKxsClientLogoEnable: this.isKxsClientLogoEnable
        }));
    }
    ;
    applyBrightness(value) {
        this.brightness = value;
        const brightnessValue = value / 50; // 0 à 2, avec 1 étant la luminosité normale
        document.documentElement.style.filter = `brightness(${brightnessValue})`;
        this.updateLocalStorage();
    }
    initDeathDetection() {
        const config = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        };
        this.deathObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    this.checkForDeathScreen(mutation.addedNodes);
                }
            }
        });
        this.deathObserver.observe(document.body, config);
    }
    checkForDeathScreen(nodes) {
        let loseArray = [
            "died",
            "eliminated",
            "was"
        ];
        let winArray = [
            "Winner",
            "Victory",
            "dinner",
        ];
        nodes.forEach((node) => {
            var _a;
            if (node instanceof HTMLElement) {
                const deathTitle = node.querySelector(".ui-stats-header-title");
                const deathTitle_2 = node.querySelector(".ui-stats-title");
                if (loseArray.some((word) => { var _a; return (_a = deathTitle === null || deathTitle === void 0 ? void 0 : deathTitle.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(word); })) {
                    this.kxsNetwork.gameEnded();
                    this.handlePlayerDeath();
                }
                else if (winArray.some((word) => { var _a; return (_a = deathTitle === null || deathTitle === void 0 ? void 0 : deathTitle.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(word); })) {
                    this.kxsNetwork.gameEnded();
                    this.handlePlayerWin();
                }
                else if ((_a = deathTitle_2 === null || deathTitle_2 === void 0 ? void 0 : deathTitle_2.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("result")) {
                    this.kxsNetwork.gameEnded();
                    this.handlePlayerDeath();
                }
            }
        });
    }
    handlePlayerDeath() {
        return KxsClient_awaiter(this, void 0, void 0, function* () {
            try {
                if (this.isDeathSoundEnabled) {
                    const audio = new Audio(this.soundLibrary.death_sound_url);
                    audio.volume = 0.3;
                    audio.play().catch((err) => false);
                }
            }
            catch (error) {
                this.logger.error("Reading error:", error);
            }
            const stats = this.getPlayerStats(false);
            const body = {
                username: stats.username,
                kills: stats.kills,
                damageDealt: stats.damageDealt,
                damageTaken: stats.damageTaken,
                duration: stats.duration,
                position: stats.position,
                isWin: false,
            };
            yield this.discordTracker.trackGameEnd(body);
            this.db.set(new Date().toISOString(), body);
        });
    }
    handlePlayerWin() {
        return KxsClient_awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (this.isWinningAnimationEnabled) {
                this.felicitation();
            }
            const stats = this.getPlayerStats(true);
            const body = {
                username: stats.username,
                kills: stats.kills,
                damageDealt: stats.damageDealt,
                damageTaken: stats.damageTaken,
                duration: stats.duration,
                position: stats.position,
                isWin: true,
                stuff: {
                    main_weapon: (_a = document.querySelector('#ui-weapon-id-1 .ui-weapon-name')) === null || _a === void 0 ? void 0 : _a.textContent,
                    secondary_weapon: (_b = document.querySelector('#ui-weapon-id-2 .ui-weapon-name')) === null || _b === void 0 ? void 0 : _b.textContent,
                    soda: (_c = document.querySelector("#ui-loot-soda .ui-loot-count")) === null || _c === void 0 ? void 0 : _c.textContent,
                    melees: (_d = document.querySelector('#ui-weapon-id-3 .ui-weapon-name')) === null || _d === void 0 ? void 0 : _d.textContent,
                    grenades: (_e = document.querySelector(`#ui-weapon-id-4 .ui-weapon-name`)) === null || _e === void 0 ? void 0 : _e.textContent,
                    medkit: (_f = document.querySelector("#ui-loot-healthkit .ui-loot-count")) === null || _f === void 0 ? void 0 : _f.textContent,
                    bandage: (_g = document.querySelector("#ui-loot-bandage .ui-loot-count")) === null || _g === void 0 ? void 0 : _g.textContent,
                    pills: (_h = document.querySelector("#ui-loot-painkiller .ui-loot-count")) === null || _h === void 0 ? void 0 : _h.textContent,
                    backpack: (_j = document.querySelector("#ui-armor-backpack .ui-armor-level")) === null || _j === void 0 ? void 0 : _j.textContent,
                    chest: (_k = document.querySelector("#ui-armor-chest .ui-armor-level")) === null || _k === void 0 ? void 0 : _k.textContent,
                    helmet: (_l = document.querySelector("#ui-armor-helmet .ui-armor-level")) === null || _l === void 0 ? void 0 : _l.textContent,
                }
            };
            yield this.discordTracker.trackGameEnd(body);
            this.db.set(new Date().toISOString(), body);
        });
    }
    felicitation() {
        const goldText = document.createElement("div");
        goldText.textContent = "#1";
        goldText.style.position = "fixed";
        goldText.style.top = "50%";
        goldText.style.left = "50%";
        goldText.style.transform = "translate(-50%, -50%)";
        goldText.style.fontSize = "80px";
        goldText.style.color = "gold";
        goldText.style.textShadow = "2px 2px 4px rgba(0,0,0,0.3)";
        goldText.style.zIndex = "10000";
        document.body.appendChild(goldText);
        function createConfetti() {
            const colors = [
                "#ff0000",
                "#00ff00",
                "#0000ff",
                "#ffff00",
                "#ff00ff",
                "#00ffff",
                "gold",
            ];
            const confetti = document.createElement("div");
            confetti.style.position = "fixed";
            confetti.style.width = Math.random() * 10 + 5 + "px";
            confetti.style.height = Math.random() * 10 + 5 + "px";
            confetti.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = "50%";
            confetti.style.zIndex = "9999";
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.top = "-20px";
            document.body.appendChild(confetti);
            let posY = -20;
            let posX = parseFloat(confetti.style.left);
            let rotation = 0;
            let speedY = Math.random() * 2 + 1;
            let speedX = Math.random() * 2 - 1;
            function fall() {
                posY += speedY;
                posX += speedX;
                rotation += 5;
                confetti.style.top = posY + "px";
                confetti.style.left = posX + "vw";
                confetti.style.transform = `rotate(${rotation}deg)`;
                if (posY < window.innerHeight) {
                    requestAnimationFrame(fall);
                }
                else {
                    confetti.remove();
                }
            }
            fall();
        }
        const confettiInterval = setInterval(() => {
            for (let i = 0; i < 5; i++) {
                createConfetti();
            }
        }, 100);
        if (this.isWinSoundEnabled) {
            const audio = new Audio(this.soundLibrary.win_sound_url);
            audio.play().catch((err) => this.logger.error("Erreur lecture:", err));
        }
        setTimeout(() => {
            clearInterval(confettiInterval);
            goldText.style.transition = "opacity 1s";
            goldText.style.opacity = "0";
            setTimeout(() => goldText.remove(), 1000);
        }, 5000);
    }
    cleanup() {
        if (this.deathObserver) {
            this.deathObserver.disconnect();
            this.deathObserver = null;
        }
    }
    getUsername() {
        const configKey = "surviv_config";
        const savedConfig = localStorage.getItem(configKey);
        const config = JSON.parse(savedConfig);
        if (config.playerName) {
            return config.playerName;
        }
        else {
            return "Player";
        }
    }
    getPlayerStats(win) {
        const statsInfo = win
            ? document.querySelector(".ui-stats-info-player")
            : document.querySelector(".ui-stats-info-player.ui-stats-info-status");
        const rank = document.querySelector(".ui-stats-header-value");
        if (!(statsInfo === null || statsInfo === void 0 ? void 0 : statsInfo.textContent) || !(rank === null || rank === void 0 ? void 0 : rank.textContent)) {
            return {
                username: this.getUsername(),
                kills: 0,
                damageDealt: 0,
                damageTaken: 0,
                duration: "0s",
                position: "#unknown",
            };
        }
        const parsedStats = StatsParser.parse(statsInfo.textContent, rank === null || rank === void 0 ? void 0 : rank.textContent);
        parsedStats.username = this.getUsername();
        return parsedStats;
    }
    setAnimationFrameCallback() {
        this.animationFrameCallback = this.isFpsUncapped
            ? (callback) => setTimeout(callback, 1)
            : window.requestAnimationFrame.bind(window);
    }
    makeResizable(element, storageKey) {
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        // Add a resize area in the bottom right
        const resizer = document.createElement("div");
        Object.assign(resizer.style, {
            width: "10px",
            height: "10px",
            backgroundColor: "white",
            position: "absolute",
            right: "0",
            bottom: "0",
            cursor: "nwse-resize",
            zIndex: "10001",
        });
        element.appendChild(resizer);
        resizer.addEventListener("mousedown", (event) => {
            isResizing = true;
            startX = event.clientX;
            startY = event.clientY;
            startWidth = element.offsetWidth;
            startHeight = element.offsetHeight;
            event.stopPropagation(); // Empêche l'activation du déplacement
        });
        window.addEventListener("mousemove", (event) => {
            if (isResizing) {
                const newWidth = startWidth + (event.clientX - startX);
                const newHeight = startHeight + (event.clientY - startY);
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
                // Sauvegarde de la taille
                localStorage.setItem(storageKey, JSON.stringify({
                    width: newWidth,
                    height: newHeight,
                }));
            }
        });
        window.addEventListener("mouseup", () => {
            isResizing = false;
        });
        const savedSize = localStorage.getItem(storageKey);
        if (savedSize) {
            const { width, height } = JSON.parse(savedSize);
            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
        }
        else {
            element.style.width = "150px"; // Taille par défaut
            element.style.height = "50px";
        }
    }
    makeDraggable(element, storageKey) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        element.addEventListener("mousedown", (event) => {
            if (event.button === 0) {
                // Left click only
                isDragging = true;
                this.gridSystem.toggleGrid(); // Afficher la grille quand on commence à déplacer
                dragOffset = {
                    x: event.clientX - element.offsetLeft,
                    y: event.clientY - element.offsetTop,
                };
                element.style.cursor = "grabbing";
            }
        });
        window.addEventListener("mousemove", (event) => {
            if (isDragging) {
                const rawX = event.clientX - dragOffset.x;
                const rawY = event.clientY - dragOffset.y;
                // Get snapped coordinates from grid system
                const snapped = this.gridSystem.snapToGrid(element, rawX, rawY);
                // Prevent moving off screen
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                element.style.left = `${Math.max(0, Math.min(snapped.x, maxX))}px`;
                element.style.top = `${Math.max(0, Math.min(snapped.y, maxY))}px`;
                // Highlight nearest grid lines while dragging
                this.gridSystem.highlightNearestGridLine(rawX, rawY);
                // Save position
                localStorage.setItem(storageKey, JSON.stringify({
                    x: parseInt(element.style.left),
                    y: parseInt(element.style.top),
                }));
            }
        });
        window.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                this.gridSystem.toggleGrid(); // Masquer la grille quand on arrête de déplacer
                element.style.cursor = "move";
            }
        });
        // Load saved position
        const savedPosition = localStorage.getItem(storageKey);
        if (savedPosition) {
            const { x, y } = JSON.parse(savedPosition);
            const snapped = this.gridSystem.snapToGrid(element, x, y);
            element.style.left = `${snapped.x}px`;
            element.style.top = `${snapped.y}px`;
        }
        setTimeout(() => {
            this.gridSystem.updateCounterCorners();
        }, 100);
    }
    getKills() {
        const killElement = document.querySelector(".ui-player-kills.js-ui-player-kills");
        if (killElement) {
            const kills = parseInt(killElement.textContent || "", 10);
            return isNaN(kills) ? 0 : kills;
        }
        return 0;
    }
    getRegionFromLocalStorage() {
        let config = localStorage.getItem("surviv_config");
        if (config) {
            let configObject = JSON.parse(config);
            return configObject.region;
        }
        return null;
    }
    saveBackgroundToLocalStorage(image) {
        if (typeof image === "string") {
            localStorage.setItem("lastBackgroundUrl", image);
        }
        if (typeof image === "string") {
            localStorage.setItem("lastBackgroundType", "url");
            localStorage.setItem("lastBackgroundValue", image);
        }
        else {
            localStorage.setItem("lastBackgroundType", "local");
            const reader = new FileReader();
            reader.onload = () => {
                localStorage.setItem("lastBackgroundValue", reader.result);
            };
            reader.readAsDataURL(image);
        }
    }
    loadBackgroundFromLocalStorage() {
        const backgroundType = localStorage.getItem("lastBackgroundType");
        const backgroundValue = localStorage.getItem("lastBackgroundValue");
        const backgroundElement = document.getElementById("background");
        if (backgroundElement && backgroundType && backgroundValue) {
            if (backgroundType === "url") {
                backgroundElement.style.backgroundImage = `url(${backgroundValue})`;
            }
            else if (backgroundType === "local") {
                backgroundElement.style.backgroundImage = `url(${backgroundValue})`;
            }
        }
    }
    loadLocalStorage() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        const savedSettings = localStorage.getItem("userSettings")
            ? JSON.parse(localStorage.getItem("userSettings"))
            : null;
        if (savedSettings) {
            this.isFpsVisible = (_a = savedSettings.isFpsVisible) !== null && _a !== void 0 ? _a : this.isFpsVisible;
            this.isPingVisible = (_b = savedSettings.isPingVisible) !== null && _b !== void 0 ? _b : this.isPingVisible;
            this.isFpsUncapped = (_c = savedSettings.isFpsUncapped) !== null && _c !== void 0 ? _c : this.isFpsUncapped;
            this.isKillsVisible = (_d = savedSettings.isKillsVisible) !== null && _d !== void 0 ? _d : this.isKillsVisible;
            this.discordWebhookUrl = (_e = savedSettings.discordWebhookUrl) !== null && _e !== void 0 ? _e : this.discordWebhookUrl;
            this.isHealthWarningEnabled = (_f = savedSettings.isHealthWarningEnabled) !== null && _f !== void 0 ? _f : this.isHealthWarningEnabled;
            this.isAutoUpdateEnabled = (_g = savedSettings.isAutoUpdateEnabled) !== null && _g !== void 0 ? _g : this.isAutoUpdateEnabled;
            this.isWinningAnimationEnabled = (_h = savedSettings.isWinningAnimationEnabled) !== null && _h !== void 0 ? _h : this.isWinningAnimationEnabled;
            this.discordToken = (_j = savedSettings.discordToken) !== null && _j !== void 0 ? _j : this.discordToken;
            this.isKillLeaderTrackerEnabled = (_k = savedSettings.isKillLeaderTrackerEnabled) !== null && _k !== void 0 ? _k : this.isKillLeaderTrackerEnabled;
            this.isKillFeedBlint = (_l = savedSettings.isKillFeedBlint) !== null && _l !== void 0 ? _l : this.isKillFeedBlint;
            this.all_friends = (_m = savedSettings.all_friends) !== null && _m !== void 0 ? _m : this.all_friends;
            this.isSpotifyPlayerEnabled = (_o = savedSettings.isSpotifyPlayerEnabled) !== null && _o !== void 0 ? _o : this.isSpotifyPlayerEnabled;
            this.isMainMenuCleaned = (_p = savedSettings.isMainMenuCleaned) !== null && _p !== void 0 ? _p : this.isMainMenuCleaned;
            this.isNotifyingForToggleMenu = (_q = savedSettings.isNotifyingForToggleMenu) !== null && _q !== void 0 ? _q : this.isNotifyingForToggleMenu;
            this.customCrosshair = (_r = savedSettings.customCrosshair) !== null && _r !== void 0 ? _r : this.customCrosshair;
            this.isGunOverlayColored = (_s = savedSettings.isGunOverlayColored) !== null && _s !== void 0 ? _s : this.isGunOverlayColored;
            this.isGunBorderChromatic = (_t = savedSettings.isGunBorderChromatic) !== null && _t !== void 0 ? _t : this.isGunBorderChromatic;
            this.isVoiceChatEnabled = (_u = savedSettings.isVoiceChatEnabled) !== null && _u !== void 0 ? _u : this.isVoiceChatEnabled;
            this.isKxsChatEnabled = (_v = savedSettings.isKxsChatEnabled) !== null && _v !== void 0 ? _v : this.isKxsChatEnabled;
            this.kxsNetworkSettings = (_w = savedSettings.kxsNetworkSettings) !== null && _w !== void 0 ? _w : this.kxsNetworkSettings;
            this.isHealBarIndicatorEnabled = (_x = savedSettings.isHealBarIndicatorEnabled) !== null && _x !== void 0 ? _x : this.isHealBarIndicatorEnabled;
            this.isWinSoundEnabled = (_y = savedSettings.isWinSoundEnabled) !== null && _y !== void 0 ? _y : this.isWinSoundEnabled;
            this.isDeathSoundEnabled = (_z = savedSettings.isDeathSoundEnabled) !== null && _z !== void 0 ? _z : this.isDeathSoundEnabled;
            this.brightness = (_0 = savedSettings.brightness) !== null && _0 !== void 0 ? _0 : this.brightness;
            this.isKxsClientLogoEnable = (_1 = savedSettings.isKxsClientLogoEnable) !== null && _1 !== void 0 ? _1 : this.isKxsClientLogoEnable;
            // Apply brightness setting
            const brightnessValue = this.brightness / 50;
            document.documentElement.style.filter = `brightness(${brightnessValue})`;
            if (savedSettings.soundLibrary) {
                // Check if the sound value exists
                if (savedSettings.soundLibrary.win_sound_url) {
                    this.soundLibrary.win_sound_url = savedSettings.soundLibrary.win_sound_url;
                }
                if (savedSettings.soundLibrary.death_sound_url) {
                    this.soundLibrary.death_sound_url = savedSettings.soundLibrary.death_sound_url;
                }
                if (savedSettings.soundLibrary.background_sound_url) {
                    this.soundLibrary.background_sound_url = savedSettings.soundLibrary.background_sound_url;
                }
            }
        }
        this.updateKillsVisibility();
        this.updateFpsVisibility();
        this.updatePingVisibility();
    }
    updateFpsVisibility() {
        if (this.counters.fps) {
            this.counters.fps.style.display = this.isFpsVisible ? "block" : "none";
            this.counters.fps.style.backgroundColor = this.isFpsVisible
                ? "rgba(0, 0, 0, 0.2)"
                : "transparent";
        }
    }
    updatePingVisibility() {
        if (this.counters.ping) {
            this.counters.ping.style.display = this.isPingVisible ? "block" : "none";
        }
    }
    updateKillsVisibility() {
        if (this.counters.kills) {
            this.counters.kills.style.display = this.isKillsVisible
                ? "block"
                : "none";
            this.counters.kills.style.backgroundColor = this.isKillsVisible
                ? "rgba(0, 0, 0, 0.2)"
                : "transparent";
        }
    }
    createSimpleSpotifyPlayer() {
        // Ajouter une règle CSS globale pour supprimer toutes les bordures et améliorer le redimensionnement
        const styleElement = document.createElement('style');
        styleElement.textContent = `
			#spotify-player-container,
			#spotify-player-container *,
			#spotify-player-iframe,
			.spotify-resize-handle {
				border: none !important;
				outline: none !important;
				box-sizing: content-box !important;
			}
			#spotify-player-iframe {
				padding-bottom: 0 !important;
				margin-bottom: 0 !important;
			}
			.spotify-resize-handle {
				touch-action: none;
				backface-visibility: hidden;
			}
			.spotify-resizing {
				user-select: none !important;
				pointer-events: none !important;
			}
			.spotify-resizing .spotify-resize-handle {
				pointer-events: all !important;
			}
		`;
        document.head.appendChild(styleElement);
        // Main container
        const container = document.createElement('div');
        container.id = 'spotify-player-container';
        // Récupérer la position sauvegardée si disponible
        const savedLeft = localStorage.getItem('kxsSpotifyPlayerLeft');
        const savedTop = localStorage.getItem('kxsSpotifyPlayerTop');
        Object.assign(container.style, {
            position: 'fixed',
            width: '320px',
            backgroundColor: '#121212',
            borderRadius: '0px',
            boxShadow: 'none',
            overflow: 'hidden',
            zIndex: '10000',
            fontFamily: 'Montserrat, Arial, sans-serif',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: 'translateY(0)',
            opacity: '1'
        });
        // Appliquer la position sauvegardée ou la position par défaut
        if (savedLeft && savedTop) {
            container.style.left = savedLeft;
            container.style.top = savedTop;
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        }
        else {
            container.style.right = '20px';
            container.style.bottom = '20px';
        }
        // Player header
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#070707',
            color: 'white',
            borderBottom: 'none',
            position: 'relative' // For absolute positioning of the button
        });
        // Spotify logo
        const logo = document.createElement('div');
        logo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`;
        const title = document.createElement('span');
        title.textContent = 'Spotify Player';
        title.style.marginLeft = '8px';
        title.style.fontWeight = 'bold';
        const logoContainer = document.createElement('div');
        logoContainer.style.display = 'flex';
        logoContainer.style.alignItems = 'center';
        logoContainer.appendChild(logo);
        logoContainer.appendChild(title);
        // Control buttons
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        // Minimize button
        const minimizeBtn = document.createElement('button');
        Object.assign(minimizeBtn.style, {
            background: 'none',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
            marginLeft: '10px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        minimizeBtn.innerHTML = '−';
        minimizeBtn.title = 'Minimize';
        // Close button
        const closeBtn = document.createElement('button');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
            marginLeft: '10px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        closeBtn.innerHTML = '×';
        closeBtn.title = 'Close';
        controls.appendChild(minimizeBtn);
        controls.appendChild(closeBtn);
        header.appendChild(logoContainer);
        header.appendChild(controls);
        // Album cover image
        const albumArt = document.createElement('div');
        Object.assign(albumArt.style, {
            width: '50px',
            height: '50px',
            backgroundColor: '#333',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '4px',
            flexShrink: '0'
        });
        albumArt.style.backgroundImage = `url('https://i.scdn.co/image/ab67616d00001e02fe24b9ffeb3c3fdb4f9abbe9')`;
        // Track information
        const trackInfo = document.createElement('div');
        Object.assign(trackInfo.style, {
            flex: '1',
            overflow: 'hidden'
        });
        // Player content
        const content = document.createElement('div');
        content.style.padding = '0';
        // Spotify iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'spotify-player-iframe';
        iframe.src = 'https://open.spotify.com/embed/playlist/37i9dQZEVXcJZyENOWUFo7?utm_source=generator&theme=1';
        iframe.width = '100%';
        iframe.height = '152px';
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.style.border = 'none';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        iframe.style.boxSizing = 'content-box';
        iframe.style.display = 'block'; // Forcer display block pour éviter les problèmes d'espacement
        iframe.setAttribute('frameBorder', '0');
        iframe.setAttribute('allowtransparency', 'true');
        iframe.setAttribute('scrolling', 'no'); // Désactiver le défilement interne
        content.appendChild(iframe);
        // Playlist change button integrated in the header
        const changePlaylistContainer = document.createElement('div');
        Object.assign(changePlaylistContainer.style, {
            display: 'flex',
            alignItems: 'center',
            marginRight: '10px'
        });
        // Square button to enter a playlist ID
        const changePlaylistBtn = document.createElement('button');
        Object.assign(changePlaylistBtn.style, {
            width: '24px',
            height: '24px',
            backgroundColor: '#1DB954',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 8px 0 0'
        });
        changePlaylistBtn.innerHTML = `
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		`;
        changePlaylistBtn.addEventListener('click', () => {
            const id = prompt('Enter the Spotify playlist ID:', '37i9dQZEVXcJZyENOWUFo7');
            if (id) {
                iframe.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
                localStorage.setItem('kxsSpotifyPlaylist', id);
                // Simulate an album cover based on the playlist ID
                albumArt.style.backgroundImage = `url('https://i.scdn.co/image/ab67706f00000002${id.substring(0, 16)}')`;
            }
        });
        changePlaylistContainer.appendChild(changePlaylistBtn);
        // Load saved playlist
        const savedPlaylist = localStorage.getItem('kxsSpotifyPlaylist');
        if (savedPlaylist) {
            iframe.src = `https://open.spotify.com/embed/playlist/${savedPlaylist}?utm_source=generator&theme=0`;
            // Simulate an album cover based on the playlist ID
            albumArt.style.backgroundImage = `url('https://i.scdn.co/image/ab67706f00000002${savedPlaylist.substring(0, 16)}')`;
        }
        // Integrate the playlist change button into the controls
        controls.insertBefore(changePlaylistContainer, minimizeBtn);
        // Assemble the elements
        container.appendChild(header);
        container.appendChild(content);
        // Add a title to the button for accessibility
        changePlaylistBtn.title = "Change playlist";
        // Add to document
        document.body.appendChild(container);
        // Ajouter un bord redimensionnable au lecteur
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'spotify-resize-handle';
        Object.assign(resizeHandle.style, {
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '30px',
            height: '30px',
            cursor: 'nwse-resize',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: '10001',
            pointerEvents: 'all'
        });
        // Ajouter un indicateur visuel de redimensionnement plus visible
        resizeHandle.innerHTML = `
			<svg width="14" height="14" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; bottom: 4px; right: 4px;">
				<path d="M9 9L5 9L9 5L9 9Z" fill="white"/>
				<path d="M5 9L1 9L9 1L9 5L5 9Z" fill="white"/>
				<path d="M1 9L1 5L5 1L9 1L1 9Z" fill="white"/>
				<path d="M1 5L1 1L5 1L1 5Z" fill="white"/>
			</svg>
		`;
        // Logique de redimensionnement
        let isResizing = false;
        let startX = 0, startY = 0;
        let startWidth = 0, startHeight = 0;
        resizeHandle.addEventListener('mousedown', (e) => {
            // Arrêter la propagation pour éviter que d'autres éléments interceptent l'événement
            e.stopPropagation();
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = container.offsetWidth;
            startHeight = container.offsetHeight;
            // Ajouter une classe spéciale pendant le redimensionnement
            container.classList.add('spotify-resizing');
            // Appliquer le style pendant le redimensionnement
            container.style.transition = 'none';
            container.style.border = 'none';
            container.style.outline = 'none';
            iframe.style.border = 'none';
            iframe.style.outline = 'none';
            document.body.style.userSelect = 'none';
            // Ajouter un overlay de redimensionnement temporairement
            const resizeOverlay = document.createElement('div');
            resizeOverlay.id = 'spotify-resize-overlay';
            resizeOverlay.style.position = 'fixed';
            resizeOverlay.style.top = '0';
            resizeOverlay.style.left = '0';
            resizeOverlay.style.width = '100%';
            resizeOverlay.style.height = '100%';
            resizeOverlay.style.zIndex = '9999';
            resizeOverlay.style.cursor = 'nwse-resize';
            resizeOverlay.style.background = 'transparent';
            document.body.appendChild(resizeOverlay);
        });
        document.addEventListener('mousemove', (e) => {
            if (!isResizing)
                return;
            // Calculer les nouvelles dimensions
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            // Limiter les dimensions minimales
            const minWidth = 320; // Largeur minimale
            const minHeight = 200; // Hauteur minimale
            // Appliquer les nouvelles dimensions si elles sont supérieures aux minimums
            if (newWidth >= minWidth) {
                container.style.width = newWidth + 'px';
                iframe.style.width = '100%';
            }
            if (newHeight >= minHeight) {
                container.style.height = newHeight + 'px';
                iframe.style.height = (newHeight - 50) + 'px'; // Ajuster la hauteur de l'iframe en conséquence
            }
            // Empêcher la sélection pendant le drag
            e.preventDefault();
        });
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                container.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                container.style.border = 'none';
                container.style.outline = 'none';
                iframe.style.border = 'none';
                iframe.style.outline = 'none';
                document.body.style.userSelect = '';
                // Supprimer l'overlay de redimensionnement
                const overlay = document.getElementById('spotify-resize-overlay');
                if (overlay)
                    overlay.remove();
                // Supprimer la classe de redimensionnement
                container.classList.remove('spotify-resizing');
                // Sauvegarder les dimensions pour la prochaine fois
                localStorage.setItem('kxsSpotifyPlayerWidth', container.style.width);
                localStorage.setItem('kxsSpotifyPlayerHeight', container.style.height);
            }
        });
        // Ajouter la poignée de redimensionnement au conteneur
        container.appendChild(resizeHandle);
        // Player states
        let isMinimized = false;
        // Events
        minimizeBtn.addEventListener('click', () => {
            if (isMinimized) {
                content.style.display = 'block';
                changePlaylistContainer.style.display = 'block';
                container.style.transform = 'translateY(0)';
                minimizeBtn.innerHTML = '−';
            }
            else {
                content.style.display = 'none';
                changePlaylistContainer.style.display = 'none';
                container.style.transform = 'translateY(0)';
                minimizeBtn.innerHTML = '+';
            }
            isMinimized = !isMinimized;
        });
        closeBtn.addEventListener('click', () => {
            container.style.transform = 'translateY(150%)';
            container.style.opacity = '0';
            setTimeout(() => {
                container.style.display = 'none';
                showButton.style.display = 'flex';
                showButton.style.alignItems = 'center';
                showButton.style.justifyContent = 'center';
            }, 300);
        });
        // Make the player draggable
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            container.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.right = 'auto';
                container.style.bottom = 'auto';
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                // Sauvegarder la position pour la prochaine fois
                localStorage.setItem('kxsSpotifyPlayerLeft', container.style.left);
                localStorage.setItem('kxsSpotifyPlayerTop', container.style.top);
            }
        });
        // Button to show the player again
        const showButton = document.createElement('button');
        showButton.id = 'spotify-float-button';
        Object.assign(showButton.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#1DB954',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            zIndex: '9999',
            fontSize: '24px',
            transition: 'transform 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        showButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`;
        document.body.appendChild(showButton);
        showButton.addEventListener('mouseenter', () => {
            showButton.style.transform = 'scale(1.1)';
        });
        showButton.addEventListener('mouseleave', () => {
            showButton.style.transform = 'scale(1)';
        });
        showButton.addEventListener('click', () => {
            container.style.display = 'block';
            container.style.transform = 'translateY(0)';
            container.style.opacity = '1';
            showButton.style.display = 'none';
        });
        return container;
    }
    toggleSpotifyMenu() {
        if (this.isSpotifyPlayerEnabled) {
            this.createSimpleSpotifyPlayer();
        }
        else {
            this.removeSimpleSpotifyPlayer();
        }
    }
    applyCustomMainMenuStyle() {
        // Sélectionner le menu principal
        const startMenu = document.getElementById('start-menu');
        const playButtons = document.querySelectorAll('.btn-green, #btn-help, .btn-team-option');
        const playerOptions = document.getElementById('player-options');
        const serverSelect = document.getElementById('server-select-main');
        const nameInput = document.getElementById('player-name-input-solo');
        const helpSection = document.getElementById('start-help');
        if (startMenu) {
            // Apply styles to the main container
            Object.assign(startMenu.style, {
                background: 'linear-gradient(135deg, rgba(25, 25, 35, 0.95) 0%, rgba(15, 15, 25, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                padding: '15px',
                backdropFilter: 'blur(10px)',
                margin: '0 auto'
            });
        }
        // Style the buttons
        playButtons.forEach(button => {
            if (button instanceof HTMLElement) {
                if (button.classList.contains('btn-green')) {
                    // Boutons Play
                    Object.assign(button.style, {
                        background: 'linear-gradient(135deg, #4287f5 0%, #3b76d9 100%)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.2s ease',
                        color: 'white',
                        fontWeight: 'bold'
                    });
                }
                else {
                    // Autres boutons
                    Object.assign(button.style, {
                        background: 'rgba(40, 45, 60, 0.7)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.2s ease',
                        color: 'white'
                    });
                }
                // Hover effect for all buttons
                button.addEventListener('mouseover', () => {
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                    button.style.filter = 'brightness(1.1)';
                });
                button.addEventListener('mouseout', () => {
                    button.style.transform = 'translateY(0)';
                    button.style.boxShadow = button.classList.contains('btn-green') ?
                        '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none';
                    button.style.filter = 'brightness(1)';
                });
            }
        });
        // Styliser le sélecteur de serveur
        if (serverSelect instanceof HTMLSelectElement) {
            Object.assign(serverSelect.style, {
                background: 'rgba(30, 35, 50, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '8px 12px',
                outline: 'none'
            });
        }
        // Styliser l'input du nom
        if (nameInput instanceof HTMLInputElement) {
            Object.assign(nameInput.style, {
                background: 'rgba(30, 35, 50, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '8px 12px',
                outline: 'none'
            });
            // Focus style
            nameInput.addEventListener('focus', () => {
                nameInput.style.border = '1px solid #4287f5';
                nameInput.style.boxShadow = '0 0 8px rgba(66, 135, 245, 0.5)';
            });
            nameInput.addEventListener('blur', () => {
                nameInput.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                nameInput.style.boxShadow = 'none';
            });
        }
        // Styliser la section d'aide
        if (helpSection) {
            Object.assign(helpSection.style, {
                background: 'rgba(20, 25, 40, 0.7)',
                borderRadius: '8px',
                padding: '15px',
                margin: '15px 0',
                maxHeight: '300px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#4287f5 rgba(25, 25, 35, 0.5)'
            });
            // Style the help section titles
            const helpTitles = helpSection.querySelectorAll('h1');
            helpTitles.forEach(title => {
                if (title instanceof HTMLElement) {
                    Object.assign(title.style, {
                        color: '#4287f5',
                        fontSize: '18px',
                        marginTop: '15px',
                        marginBottom: '8px'
                    });
                }
            });
            // Style the paragraphs
            const helpParagraphs = helpSection.querySelectorAll('p');
            helpParagraphs.forEach(p => {
                if (p instanceof HTMLElement) {
                    p.style.color = 'rgba(255, 255, 255, 0.8)';
                    p.style.fontSize = '14px';
                    p.style.marginBottom = '8px';
                }
            });
            // Style the action terms and controls
            const actionTerms = helpSection.querySelectorAll('.help-action');
            actionTerms.forEach(term => {
                if (term instanceof HTMLElement) {
                    term.style.color = '#ffc107'; // Yellow
                    term.style.fontWeight = 'bold';
                }
            });
            const controlTerms = helpSection.querySelectorAll('.help-control');
            controlTerms.forEach(term => {
                if (term instanceof HTMLElement) {
                    term.style.color = '#4287f5'; // Bleu
                    term.style.fontWeight = 'bold';
                }
            });
        }
        // Apply specific style to double buttons
        const btnsDoubleRow = document.querySelector('.btns-double-row');
        if (btnsDoubleRow instanceof HTMLElement) {
            btnsDoubleRow.style.display = 'flex';
            btnsDoubleRow.style.gap = '10px';
            btnsDoubleRow.style.marginTop = '10px';
        }
    }
    MainMenuCleaning() {
        // Déconnecter l'observateur précédent s'il existe
        if (this.adBlockObserver) {
            this.adBlockObserver.disconnect();
            this.adBlockObserver = null;
        }
        // Select elements to hide/show
        const newsWrapper = document.getElementById('news-wrapper');
        const adBlockLeft = document.getElementById('ad-block-left');
        const socialLeft = document.getElementById('social-share-block-wrapper');
        const leftCollun = document.getElementById('left-column');
        const elementsToMonitor = [
            { element: newsWrapper, id: 'news-wrapper' },
            { element: adBlockLeft, id: 'ad-block-left' },
            { element: socialLeft, id: 'social-share-block-wrapper' },
            { element: leftCollun, id: 'left-column' }
        ];
        // Appliquer le style personnalisé au menu principal
        this.applyCustomMainMenuStyle();
        if (this.isMainMenuCleaned) {
            // Clean mode: hide elements
            elementsToMonitor.forEach(item => {
                if (item.element)
                    item.element.style.display = 'none';
            });
            // Create an observer to prevent the site from redisplaying elements
            this.adBlockObserver = new MutationObserver((mutations) => {
                let needsUpdate = false;
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const target = mutation.target;
                        // Check if the element is one of those we are monitoring
                        if (elementsToMonitor.some(item => item.id === target.id && target.style.display !== 'none')) {
                            target.style.display = 'none';
                            needsUpdate = true;
                        }
                    }
                });
                // If the site tries to redisplay an advertising element, we prevent it
                if (needsUpdate) {
                    this.logger.log('Detection of attempt to redisplay ads - Forced hiding');
                }
            });
            // Observe style changes on elements
            elementsToMonitor.forEach(item => {
                if (item.element && this.adBlockObserver) {
                    this.adBlockObserver.observe(item.element, {
                        attributes: true,
                        attributeFilter: ['style']
                    });
                }
            });
            // Vérifier également le document body pour de nouveaux éléments ajoutés
            const bodyObserver = new MutationObserver(() => {
                // Réappliquer notre nettoyage après un court délai
                setTimeout(() => {
                    if (this.isMainMenuCleaned) {
                        elementsToMonitor.forEach(item => {
                            const element = document.getElementById(item.id);
                            if (element && element.style.display !== 'none') {
                                element.style.display = 'none';
                            }
                        });
                    }
                }, 100);
            });
            // Observe changes in the DOM
            bodyObserver.observe(document.body, { childList: true, subtree: true });
        }
        else {
            // Mode normal: rétablir l'affichage
            elementsToMonitor.forEach(item => {
                if (item.element)
                    item.element.style.display = 'block';
            });
        }
    }
    removeSimpleSpotifyPlayer() {
        // Supprimer le conteneur principal du lecteur
        const container = document.getElementById('spotify-player-container');
        if (container) {
            container.remove();
        }
        // Supprimer aussi le bouton flottant grâce à son ID
        const floatButton = document.getElementById('spotify-float-button');
        if (floatButton) {
            floatButton.remove();
        }
    }
}

;// ./src/HUD/MOD/LoadingScreen.ts
/**
 * LoadingScreen.ts
 *
 * This module provides a loading animation with a logo and a rotating loading circle
 * that displays during the loading of game resources.
 */
class LoadingScreen {
    /**
     * Creates a new instance of the loading screen
     * @param logoUrl URL of the Kxs logo to display
     */
    constructor(logoUrl) {
        this.logoUrl = logoUrl;
        this.container = document.createElement('div');
        this.initializeStyles();
        this.createContent();
    }
    /**
     * Initializes CSS styles for the loading screen
     */
    initializeStyles() {
        // Styles for the main container
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
            transition: 'opacity 0.5s ease-in-out',
            animation: 'fadeIn 0.5s ease-in-out',
            backdropFilter: 'blur(5px)'
        });
    }
    /**
     * Creates the loading screen content (logo and loading circle)
     */
    createContent() {
        // Create container for the logo
        const logoContainer = document.createElement('div');
        Object.assign(logoContainer.style, {
            width: '200px',
            height: '200px',
            marginBottom: '20px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });
        // Create the logo element
        const logo = document.createElement('img');
        logo.src = this.logoUrl;
        Object.assign(logo.style, {
            width: '150px',
            height: '150px',
            objectFit: 'contain',
            position: 'absolute',
            zIndex: '2',
            animation: 'pulse 2s ease-in-out infinite'
        });
        // Create the main loading circle
        const loadingCircle = document.createElement('div');
        Object.assign(loadingCircle.style, {
            width: '180px',
            height: '180px',
            border: '4px solid transparent',
            borderTopColor: '#3498db',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite',
            position: 'absolute',
            zIndex: '1'
        });
        // Create a second loading circle (rotating in the opposite direction)
        const loadingCircle2 = document.createElement('div');
        Object.assign(loadingCircle2.style, {
            width: '200px',
            height: '200px',
            border: '2px solid transparent',
            borderLeftColor: '#e74c3c',
            borderRightColor: '#e74c3c',
            borderRadius: '50%',
            animation: 'spin-reverse 3s linear infinite',
            position: 'absolute',
            zIndex: '0'
        });
        // Add animations
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes spin-reverse {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(-360deg); }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            @keyframes fadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(styleSheet);
        // Ajout d'un texte de chargement
        const loadingText = document.createElement('div');
        loadingText.textContent = 'Loading...';
        Object.assign(loadingText.style, {
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            marginTop: '20px',
            animation: 'pulse 1.5s ease-in-out infinite'
        });
        // Ajout d'un sous-texte
        const subText = document.createElement('div');
        subText.textContent = 'Initializing resources...';
        Object.assign(subText.style, {
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            marginTop: '5px'
        });
        // Assemble the elements
        logoContainer.appendChild(loadingCircle2);
        logoContainer.appendChild(loadingCircle);
        logoContainer.appendChild(logo);
        this.container.appendChild(logoContainer);
        this.container.appendChild(loadingText);
        this.container.appendChild(subText);
    }
    /**
     * Shows the loading screen
     */
    show() {
        document.body.appendChild(this.container);
    }
    /**
     * Hides the loading screen with a fade transition
     */
    hide() {
        this.container.style.opacity = '0';
        setTimeout(() => {
            if (this.container.parentNode) {
                document.body.removeChild(this.container);
            }
        }, 500); // Wait for the transition to finish before removing the element
    }
}

;// ./src/HUD/ServerSelector.ts
class ServerSelector {
    constructor(servers, onServerSelect) {
        this.isActive = false;
        this.serverContainer = null;
        this.serverCards = [];
        this.selectedIndex = 0;
        this.originalBodyContent = '';
        this.animation = null;
        this.servers = [];
        this.onServerSelect = null;
        this.servers = this.processServerUrls(servers);
        this.onServerSelect = onServerSelect || null;
    }
    /**
     * Process server URLs from match patterns to display-friendly names
     */
    processServerUrls(servers) {
        return servers.map(server => {
            // Remove wildcards and protocol
            return server.replace(/^\*:\/\//, '')
                // Remove trailing wildcards
                .replace(/\/\*$/, '')
                // Handle special case for IP addresses
                .replace(/\/+$/, '');
        });
    }
    /**
     * Show the server selection interface
     */
    show() {
        // If already active, close first to reset properly
        if (this.isActive) {
            this.close();
        }
        this.isActive = true;
        // Store original content if not already stored
        if (!this.originalBodyContent) {
            this.originalBodyContent = document.body.innerHTML;
        }
        // Create overlay
        this.createInterface();
        // Start animations
        this.startAnimations();
        // Add keyboard navigation
        this.setupKeyboardNavigation();
    }
    /**
     * Create the server selection interface
     */
    createInterface() {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '10000';
        overlay.style.perspective = '1000px';
        overlay.style.fontFamily = 'Arial, sans-serif';
        // Create header
        const header = document.createElement('h1');
        header.textContent = 'Select Server';
        header.style.color = '#fff';
        header.style.marginBottom = '40px';
        header.style.fontSize = '36px';
        header.style.textShadow = '0 0 10px rgba(255,0,0,0.8)';
        overlay.appendChild(header);
        // Create server container
        this.serverContainer = document.createElement('div');
        this.serverContainer.style.position = 'relative';
        this.serverContainer.style.width = '80%';
        this.serverContainer.style.height = '300px';
        this.serverContainer.style.display = 'flex';
        this.serverContainer.style.justifyContent = 'center';
        this.serverContainer.style.alignItems = 'center';
        this.serverContainer.style.transformStyle = 'preserve-3d';
        overlay.appendChild(this.serverContainer);
        // Create instructions
        const instructions = document.createElement('div');
        instructions.style.position = 'absolute';
        instructions.style.bottom = '20px';
        instructions.style.color = '#aaa';
        instructions.style.fontSize = '16px';
        instructions.innerHTML = 'Use <strong>←/→</strong> arrows to navigate | <strong>Enter</strong> to select | <strong>Esc</strong> to close';
        overlay.appendChild(instructions);
        // Create server cards
        this.createServerCards();
        // Add the overlay to the body
        document.body.appendChild(overlay);
    }
    /**
     * Create 3D rotating cards for each server
     */
    createServerCards() {
        if (!this.serverContainer)
            return;
        const totalServers = this.servers.length;
        const radius = 300; // Radius of the circle
        const cardWidth = 200;
        const cardHeight = 120;
        this.servers.forEach((server, index) => {
            const card = document.createElement('div');
            card.className = 'server-card';
            card.style.position = 'absolute';
            card.style.width = `${cardWidth}px`;
            card.style.height = `${cardHeight}px`;
            card.style.backgroundColor = index === this.selectedIndex ? '#500' : '#333';
            card.style.color = '#fff';
            card.style.borderRadius = '10px';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'center';
            card.style.alignItems = 'center';
            card.style.cursor = 'pointer';
            card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
            card.style.transition = 'background-color 0.3s ease';
            card.style.padding = '15px';
            card.style.backfaceVisibility = 'hidden';
            // Create server name
            const serverName = document.createElement('h2');
            serverName.textContent = server;
            serverName.style.margin = '0 0 10px 0';
            serverName.style.fontSize = '20px';
            card.appendChild(serverName);
            // Add status indicator
            const status = document.createElement('div');
            status.style.width = '10px';
            status.style.height = '10px';
            status.style.borderRadius = '50%';
            status.style.backgroundColor = '#0f0'; // Green for online
            status.style.marginTop = '10px';
            card.appendChild(status);
            // Add click event
            card.addEventListener('click', () => {
                this.selectedIndex = index;
                this.updateCardPositions();
                this.selectServer();
            });
            this.serverCards.push(card);
            if (this.serverContainer) {
                this.serverContainer.appendChild(card);
            }
        });
        // Position the cards in a circle
        this.updateCardPositions();
    }
    /**
     * Update the positions of all server cards in a 3D circle
     */
    updateCardPositions() {
        const totalServers = this.servers.length;
        const radius = Math.max(300, totalServers * 40); // Adjust radius based on number of servers
        this.serverCards.forEach((card, index) => {
            // Calculate position on the circle
            const theta = ((index - this.selectedIndex) / totalServers) * 2 * Math.PI;
            const x = radius * Math.sin(theta);
            const z = radius * Math.cos(theta) - radius;
            // Update card style
            card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${-theta * 180 / Math.PI}deg)`;
            card.style.zIndex = z < 0 ? '-1' : '1';
            card.style.opacity = (1 - Math.abs(index - this.selectedIndex) / totalServers).toString();
            card.style.backgroundColor = index === this.selectedIndex ? '#500' : '#333';
            // Add glow effect to selected card
            if (index === this.selectedIndex) {
                card.style.boxShadow = '0 0 20px rgba(255,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)';
            }
            else {
                card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
            }
        });
    }
    /**
     * Start animations for the 3D carousel
     */
    startAnimations() {
        // Subtle continuous movement for more 3D effect
        let angle = 0;
        this.animation = window.setInterval(() => {
            angle += 0.005;
            if (this.serverContainer) {
                this.serverContainer.style.transform = `rotateY(${Math.sin(angle) * 5}deg) rotateX(${Math.cos(angle) * 3}deg)`;
            }
        }, 16);
    }
    /**
     * Set up keyboard navigation
     */
    setupKeyboardNavigation() {
        const keyHandler = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.navigate(-1);
                    break;
                case 'ArrowRight':
                    this.navigate(1);
                    break;
                case 'Enter':
                    this.selectServer();
                    break;
                case 'Escape':
                    this.close();
                    break;
            }
        };
        document.addEventListener('keydown', keyHandler);
        // Store the handler reference so it can be removed when the selector is closed
        this._keyHandler = keyHandler;
    }
    /**
     * Navigate between servers
     */
    navigate(direction) {
        const totalServers = this.servers.length;
        this.selectedIndex = (this.selectedIndex + direction + totalServers) % totalServers;
        this.updateCardPositions();
    }
    /**
     * Select current server and close the selector
     */
    selectServer() {
        const selectedServer = this.servers[this.selectedIndex];
        if (this.onServerSelect && selectedServer) {
            this.onServerSelect(selectedServer);
        }
        this.close();
    }
    /**
     * Close the server selector
     */
    close() {
        var _a;
        if (!this.isActive)
            return;
        this.isActive = false;
        // Stop animations
        if (this.animation !== null) {
            clearInterval(this.animation);
            this.animation = null;
        }
        // Remove keyboard event listener
        if (this._keyHandler) {
            document.removeEventListener('keydown', this._keyHandler);
            this._keyHandler = null;
        }
        // Remove the overlay
        document.querySelectorAll('div.server-card').forEach(el => el.remove());
        if (this.serverContainer && this.serverContainer.parentNode) {
            const parent = this.serverContainer.parentNode;
            if (parent && parent instanceof HTMLElement) {
                parent.remove();
            }
            else if (parent) {
                // Fallback if parentNode exists but isn't an HTMLElement
                const parentEl = parent;
                (_a = parentEl.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(parentEl);
            }
        }
        // Reset state for next use
        this.serverContainer = null;
        this.serverCards = [];
        this.selectedIndex = 0;
    }
}

;// ./src/HUD/EasterEgg.ts


class EasterEgg {
    constructor() {
        this.originalStyles = {};
        this.zelda3Sound = null;
        this.periodSound = null;
        this.ambientSound = null;
        this.buttonClickSound = null;
        this.arrowKeySound = null;
        this.enterKeySound = null;
        this.closeMenuSound = null;
        this.textElement = null;
        this.fireElements = [];
        this.pillars = [];
        this.isActive = false;
        this.isInitialized = false;
        this.overlayElement = null;
        this.animationFrameId = null;
        this.originalBodyContent = '';
        this.serverSelector = null;
        this.serverButton = null;
        this.messageChangeInterval = null;
        this.originalPageTitle = '';
        this.messages = [
            "You're already in",
            "You didnt have found Kxs, is kxs who found you",
            "The prophecies are true",
            "Kxs is the chosen one",
            "Kxs is the one who will save you",
            "I am Kxs, the one who will save you"
        ];
        this.globalEventHandlersInitialized = false;
        this.init();
    }
    init() {
        // Save original page title
        this.originalPageTitle = document.title;
        // Check if we're on the target website
        if (window.location.hostname === 'kxs.rip' || window.location.hostname === 'www.kxs.rip') {
            // Initialize sounds
            this.zelda3Sound = new Audio('https://kxs.rip/assets/message.mp3'); // Replace with actual Zelda sound
            this.periodSound = new Audio('https://kxs.rip/assets/message-finish.mp3'); // Sound for the final period
            this.ambientSound = new Audio('https://kxs.rip/assets/hell_ambiance.m4a'); // Replace with actual ambient URL
            this.buttonClickSound = new Audio('https://kxs.rip/assets/enter.mp3'); // Button click sound
            this.arrowKeySound = new Audio('https://kxs.rip/assets/arrow.mp3'); // Arrow key sound
            this.enterKeySound = new Audio('https://kxs.rip/assets/enter.mp3'); // Enter key sound
            this.closeMenuSound = new Audio('https://kxs.rip/assets/close.mp3'); // Close menu sound
            if (this.ambientSound) {
                this.ambientSound.loop = true;
            }
            // Create the initial overlay with Click prompt instead of immediately applying Easter egg
            this.createInitialOverlay();
            // Initialize global event handlers for interaction sounds
            this.initGlobalEventHandlers();
        }
    }
    /**
     * Creates the initial blur overlay with Click text
     */
    createInitialOverlay() {
        // Store original body content to restore it later if needed
        this.originalBodyContent = document.body.innerHTML;
        // Save original styles
        this.saveOriginalStyles();
        // Create the overlay
        this.overlayElement = document.createElement('div');
        const overlay = this.overlayElement;
        // Set full screen styles
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        overlay.style.backdropFilter = 'blur(10px)';
        overlay.style['-webkit-backdrop-filter'] = 'blur(10px)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.cursor = 'pointer';
        overlay.style.zIndex = '9999';
        overlay.style.transition = 'opacity 0.5s ease';
        // Create the Click text
        const clickText = document.createElement('div');
        clickText.textContent = 'Click';
        clickText.style.color = '#fff';
        clickText.style.fontSize = '3rem';
        clickText.style.fontWeight = 'bold';
        clickText.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
        clickText.style.fontFamily = '"Cinzel", "Trajan Pro", serif';
        clickText.style.letterSpacing = '5px';
        // Add font for the text
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap';
        document.head.appendChild(fontLink);
        // Add click event to start the Easter egg
        overlay.addEventListener('click', () => {
            this.removeOverlay();
            this.applyEasterEgg();
        });
        // Add the text to the overlay
        overlay.appendChild(clickText);
        // Add the overlay to the body
        document.body.appendChild(overlay);
    }
    /**
     * Removes the initial overlay
     */
    removeOverlay() {
        if (this.overlayElement && this.overlayElement.parentNode) {
            // Fade out
            this.overlayElement.style.opacity = '0';
            // Remove after transition
            setTimeout(() => {
                if (this.overlayElement && this.overlayElement.parentNode) {
                    this.overlayElement.parentNode.removeChild(this.overlayElement);
                    this.overlayElement = null;
                }
            }, 500);
        }
    }
    /**
     * Initialize global event handlers for sounds
     */
    initGlobalEventHandlers() {
        if (this.globalEventHandlersInitialized)
            return;
        this.globalEventHandlersInitialized = true;
        // Play sound on button clicks
        document.addEventListener('click', (e) => {
            if (e.target instanceof HTMLButtonElement ||
                e.target instanceof HTMLAnchorElement ||
                (e.target instanceof HTMLElement && e.target.role === 'button')) {
                this.playButtonSound();
            }
        });
        // Play sound on arrow keys and enter key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.playArrowKeySound();
            }
            else if (e.key === 'Enter') {
                this.playEnterKeySound();
            }
        });
    }
    applyEasterEgg() {
        if (this.isActive)
            return;
        this.isActive = true;
        this.isInitialized = true;
        // Transform the website
        this.transformWebsite();
        // Start animations
        this.startAnimations();
        // Play ambient sound
        this.playAmbientSound();
        // Display the message with sound effect
        setTimeout(() => {
            this.displayMessage();
            // Add server selector button after the message is displayed
            this.addServerSelectorButton();
        }, 2000);
    }
    saveOriginalStyles() {
        this.originalStyles = {
            bodyBackground: document.body.style.background,
            bodyColor: document.body.style.color,
            bodyOverflow: document.body.style.overflow
        };
    }
    transformWebsite() {
        // Clear the existing content
        document.body.innerHTML = '';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.backgroundColor = '#000';
        document.body.style.color = '#fff';
        document.body.style.fontFamily = '"Times New Roman", serif';
        document.body.style.height = '100vh';
        document.body.style.display = 'flex';
        document.body.style.flexDirection = 'column';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        document.body.style.perspective = '1000px';
        // Create a temple background
        const temple = document.createElement('div');
        temple.style.position = 'absolute';
        temple.style.top = '0';
        temple.style.left = '0';
        temple.style.width = '100%';
        temple.style.height = '100%';
        temple.style.background = 'linear-gradient(to bottom, #000, #300)';
        temple.style.zIndex = '-2';
        document.body.appendChild(temple);
        // Create pillars
        for (let i = 0; i < 6; i++) {
            const pillar = document.createElement('div');
            pillar.style.position = 'absolute';
            pillar.style.width = '80px';
            pillar.style.height = '100%';
            pillar.style.background = 'linear-gradient(to bottom, #222, #111)';
            pillar.style.transform = `rotateY(${i * 60}deg) translateZ(400px)`;
            pillar.style.boxShadow = 'inset 0 0 20px #500';
            pillar.style.transition = 'transform 0.5s ease-in-out';
            this.pillars.push(pillar);
            document.body.appendChild(pillar);
        }
        // Create floor
        const floor = document.createElement('div');
        floor.style.position = 'absolute';
        floor.style.bottom = '0';
        floor.style.width = '100%';
        floor.style.height = '40%';
        floor.style.background = 'radial-gradient(circle, #300, #100)';
        floor.style.zIndex = '-1';
        document.body.appendChild(floor);
        // Create text container for the message
        this.textElement = document.createElement('div');
        this.textElement.style.position = 'relative';
        this.textElement.style.fontSize = '3.5em';
        this.textElement.style.fontWeight = 'bold';
        this.textElement.style.fontFamily = '"Cinzel", "Trajan Pro", serif';
        this.textElement.style.color = '#f00';
        this.textElement.style.textShadow = '0 0 10px #f00, 0 0 20px #f00, 0 0 30px #900';
        this.textElement.style.letterSpacing = '2px';
        this.textElement.style.opacity = '0';
        this.textElement.style.transition = 'opacity 2s';
        // Add a fancy font from Google Fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap';
        document.head.appendChild(fontLink);
        document.body.appendChild(this.textElement);
        // Create fire elements as 3D rotating rectangles
        for (let i = 0; i < 20; i++) {
            const fire = document.createElement('div');
            fire.style.position = 'absolute';
            fire.style.width = `${Math.random() * 40 + 20}px`;
            fire.style.height = `${Math.random() * 60 + 40}px`;
            fire.style.background = 'radial-gradient(circle, #f50, #900, transparent)';
            fire.style.borderRadius = '10%';
            fire.style.filter = 'blur(3px)';
            fire.style.opacity = `${Math.random() * 0.5 + 0.5}`;
            const randomX = Math.random() * 100;
            fire.style.left = `${randomX}%`;
            fire.style.bottom = '0';
            fire.style.zIndex = '-1';
            fire.style.transformStyle = 'preserve-3d';
            fire.style.perspective = '1000px';
            fire.dataset.velocityY = `${Math.random() * 2 + 1}`;
            fire.dataset.posX = randomX.toString();
            fire.dataset.posY = '0';
            fire.dataset.rotateX = `${Math.random() * 4 - 2}`; // Random rotation speed X
            fire.dataset.rotateY = `${Math.random() * 4 - 2}`; // Random rotation speed Y
            fire.dataset.rotateZ = `${Math.random() * 4 - 2}`; // Random rotation speed Z
            fire.dataset.rotationX = '0';
            fire.dataset.rotationY = '0';
            fire.dataset.rotationZ = '0';
            this.fireElements.push(fire);
            document.body.appendChild(fire);
        }
    }
    startAnimations() {
        // Animate fire and pillars
        this.animateFireElements();
        this.animatePillars();
    }
    animateFireElements() {
        if (!this.isActive)
            return;
        this.fireElements.forEach(fire => {
            let posY = parseFloat(fire.dataset.posY || '0');
            const velocityY = parseFloat(fire.dataset.velocityY || '1');
            // Update position
            posY += velocityY;
            fire.dataset.posY = posY.toString();
            // Update rotation
            let rotX = parseFloat(fire.dataset.rotationX || '0');
            let rotY = parseFloat(fire.dataset.rotationY || '0');
            let rotZ = parseFloat(fire.dataset.rotationZ || '0');
            rotX += parseFloat(fire.dataset.rotateX || '0');
            rotY += parseFloat(fire.dataset.rotateY || '0');
            rotZ += parseFloat(fire.dataset.rotateZ || '0');
            fire.dataset.rotationX = rotX.toString();
            fire.dataset.rotationY = rotY.toString();
            fire.dataset.rotationZ = rotZ.toString();
            // Apply transform
            fire.style.transform = `translateY(${-posY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
            // Reset fire when it goes off screen
            if (posY > 100) {
                posY = 0;
                fire.dataset.posY = '0';
                fire.style.opacity = `${Math.random() * 0.5 + 0.5}`;
                fire.style.width = `${Math.random() * 40 + 20}px`;
                fire.style.height = `${Math.random() * 60 + 40}px`;
                const randomX = Math.random() * 100;
                fire.style.left = `${randomX}%`;
                fire.dataset.posX = randomX.toString();
                // Reset rotation speeds
                fire.dataset.rotateX = `${Math.random() * 4 - 2}`;
                fire.dataset.rotateY = `${Math.random() * 4 - 2}`;
                fire.dataset.rotateZ = `${Math.random() * 4 - 2}`;
            }
            fire.style.opacity = `${Math.max(0, 1 - posY / 100)}`;
        });
        this.animationFrameId = requestAnimationFrame(() => this.animateFireElements());
    }
    animatePillars() {
        if (!this.isActive)
            return;
        // Create a slow rotation effect for the pillars
        let angle = 0;
        setInterval(() => {
            angle += 0.5;
            this.pillars.forEach((pillar, index) => {
                pillar.style.transform = `rotateY(${index * 60 + angle}deg) translateZ(400px)`;
            });
        }, 100);
    }
    playAmbientSound() {
        // Play ambient sound
        if (this.ambientSound) {
            this.ambientSound.volume = 0.3;
            this.ambientSound.play().catch(err => {
                console.error('Failed to play ambient sound:', err);
            });
        }
    }
    /**
     * Temporarily reduce ambient sound volume to allow other sounds to be heard better
     */
    lowerAmbientVolume() {
        if (this.ambientSound) {
            // Store current volume if we need it
            const originalVolume = this.ambientSound.volume;
            // Lower volume
            this.ambientSound.volume = 0.1; // Lower to 1/3 of original volume
            // Restore volume after a delay
            setTimeout(() => {
                if (this.ambientSound) {
                    this.ambientSound.volume = 0.3; // Restore to original volume
                }
            }, 500); // Half second delay
        }
    }
    /**
     * Play button click sound
     */
    playButtonSound() {
        if (this.buttonClickSound) {
            // Lower ambient volume
            this.lowerAmbientVolume();
            this.buttonClickSound.currentTime = 0;
            this.buttonClickSound.volume = 0.3;
            this.buttonClickSound.play().catch(err => {
                console.error('Failed to play button sound:', err);
            });
        }
    }
    /**
     * Play arrow key sound
     */
    playArrowKeySound() {
        if (this.arrowKeySound) {
            // Lower ambient volume
            this.lowerAmbientVolume();
            this.arrowKeySound.currentTime = 0;
            this.arrowKeySound.volume = 0.3;
            this.arrowKeySound.play().catch(err => {
                console.error('Failed to play arrow key sound:', err);
            });
        }
    }
    /**
     * Play enter key sound
     */
    playEnterKeySound() {
        if (this.enterKeySound) {
            // Lower ambient volume
            this.lowerAmbientVolume();
            this.enterKeySound.currentTime = 0;
            this.enterKeySound.volume = 0.3;
            this.enterKeySound.play().catch(err => {
                console.error('Failed to play enter key sound:', err);
            });
        }
    }
    displayMessage() {
        if (!this.textElement)
            return;
        // Set the message text and start with the first message
        this.typeMessage(this.messages[0]);
        // Set up message changing at random intervals
        this.setupMessageChanging();
    }
    /**
     * Type out a message with the typewriter effect
     */
    typeMessage(message) {
        if (!this.textElement)
            return;
        // Clear current text and ensure visibility
        this.textElement.textContent = '';
        this.textElement.style.opacity = '1';
        // Update page title with message
        document.title = message;
        // Calculate typing speed based on message length
        // Longer messages type faster (inversely proportional)
        const baseSpeed = 300; // Base speed in ms
        const minSpeed = 40; // Minimum speed for very long messages
        const typeSpeed = Math.max(minSpeed, baseSpeed - (message.length * 5));
        // Type writer effect with Zelda sound
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < message.length && this.textElement) {
                // Check if we're at the last character and it's not already a period
                const isLastChar = i === message.length - 1;
                const shouldAddPeriod = isLastChar && message.charAt(i) !== '.';
                // Play the appropriate sound
                if (isLastChar && this.periodSound) {
                    // Play special sound for the last character
                    this.periodSound.currentTime = 0;
                    this.periodSound.volume = 0.3;
                    this.periodSound.play().catch(err => {
                        console.error('Failed to play period sound:', err);
                    });
                }
                else if (this.zelda3Sound) {
                    // Play regular typing sound
                    this.zelda3Sound.currentTime = 0;
                    this.zelda3Sound.volume = 0.2;
                    this.zelda3Sound.play().catch(err => {
                        console.error('Failed to play Zelda sound:', err);
                    });
                }
                // Add character to text element
                this.textElement.textContent += message.charAt(i);
                // Update page title in real-time with the current text
                document.title = this.textElement.textContent || message;
                // If last character and we should add a period, do it with a pause
                if (shouldAddPeriod) {
                    setTimeout(() => {
                        if (this.textElement && this.periodSound) {
                            this.periodSound.currentTime = 0;
                            this.periodSound.volume = 0.4;
                            this.periodSound.play().catch(err => {
                                console.error('Failed to play period sound:', err);
                            });
                            this.textElement.textContent += '.';
                            // Update title with the final period
                            document.title = this.textElement.textContent || (message + '.');
                        }
                    }, 400);
                }
                i++;
            }
            else {
                clearInterval(typeInterval);
            }
        }, typeSpeed); // Dynamic typing speed based on message length
    }
    /**
     * Setup changing messages at random intervals
     */
    setupMessageChanging() {
        // Function to change to a random message
        const changeMessage = () => {
            // Get a random message that's different from the current one
            if (!this.textElement)
                return;
            const currentMessage = this.textElement.textContent || '';
            let newMessage = currentMessage;
            // Make sure we pick a different message
            while (newMessage === currentMessage) {
                const randomIndex = Math.floor(Math.random() * this.messages.length);
                newMessage = this.messages[randomIndex];
            }
            // Type the new message
            this.typeMessage(newMessage);
            // Schedule the next message change
            this.scheduleNextMessageChange();
        };
        // Schedule the first message change
        this.scheduleNextMessageChange();
    }
    /**
     * Schedule the next message change with a random delay
     */
    scheduleNextMessageChange() {
        // Clear any existing timer
        if (this.messageChangeInterval !== null) {
            clearTimeout(this.messageChangeInterval);
        }
        // Random delay between 4 and 19 seconds
        const delay = Math.floor(Math.random() * 15000) + 4000; // 4-19 seconds
        // Set timeout for next message change
        this.messageChangeInterval = window.setTimeout(() => {
            // Get a random message that's different from the current one
            if (!this.textElement)
                return;
            const currentMessage = this.textElement.textContent || '';
            let newMessage = currentMessage;
            // Make sure we pick a different message
            while (newMessage === currentMessage) {
                const randomIndex = Math.floor(Math.random() * this.messages.length);
                newMessage = this.messages[randomIndex];
            }
            // Type the new message
            this.typeMessage(newMessage);
            // Schedule the next message change
            this.scheduleNextMessageChange();
        }, delay);
    }
    /**
     * Add a button to open the server selector
     */
    addServerSelectorButton() {
        // Create a button
        this.serverButton = document.createElement('button');
        const button = this.serverButton;
        // Set button text
        button.textContent = 'SELECT SERVER';
        // Position and base styling
        button.style.position = 'absolute';
        button.style.bottom = '30px';
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)';
        // Enhanced styling
        button.style.backgroundColor = 'transparent';
        button.style.color = '#ff9';
        button.style.border = '2px solid #900';
        button.style.padding = '15px 30px';
        button.style.fontSize = '20px';
        button.style.fontFamily = '"Cinzel", "Trajan Pro", serif';
        button.style.fontWeight = 'bold';
        button.style.letterSpacing = '3px';
        button.style.borderRadius = '3px';
        button.style.textTransform = 'uppercase';
        button.style.boxShadow = '0 0 20px rgba(255, 30, 0, 0.6), inset 0 0 10px rgba(255, 50, 0, 0.4)';
        button.style.textShadow = '0 0 10px rgba(255, 150, 0, 0.8), 0 0 5px rgba(255, 100, 0, 0.5)';
        button.style.cursor = 'pointer';
        button.style.zIndex = '100';
        button.style.opacity = '0';
        button.style.transition = 'all 0.5s ease-in-out';
        button.style.background = 'linear-gradient(to bottom, rgba(80, 0, 0, 0.8), rgba(30, 0, 0, 0.9))';
        button.style.backdropFilter = 'blur(3px)';
        // Add enhanced hover effects
        button.addEventListener('mouseover', () => {
            button.style.color = '#fff';
            button.style.borderColor = '#f00';
            button.style.boxShadow = '0 0 25px rgba(255, 50, 0, 0.8), inset 0 0 15px rgba(255, 100, 0, 0.6)';
            button.style.textShadow = '0 0 15px rgba(255, 200, 0, 1), 0 0 10px rgba(255, 150, 0, 0.8)';
            button.style.transform = 'translateX(-50%) scale(1.05)';
            button.style.background = 'linear-gradient(to bottom, rgba(100, 0, 0, 0.9), rgba(50, 0, 0, 1))';
        });
        button.addEventListener('mouseout', () => {
            button.style.color = '#ff9';
            button.style.borderColor = '#900';
            button.style.boxShadow = '0 0 20px rgba(255, 30, 0, 0.6), inset 0 0 10px rgba(255, 50, 0, 0.4)';
            button.style.textShadow = '0 0 10px rgba(255, 150, 0, 0.8), 0 0 5px rgba(255, 100, 0, 0.5)';
            button.style.transform = 'translateX(-50%)';
            button.style.background = 'linear-gradient(to bottom, rgba(80, 0, 0, 0.8), rgba(30, 0, 0, 0.9))';
        });
        // Add active/press effect
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateX(-50%) scale(0.98)';
            button.style.boxShadow = '0 0 10px rgba(255, 30, 0, 0.8), inset 0 0 8px rgba(255, 100, 0, 0.8)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateX(-50%) scale(1.05)';
            button.style.boxShadow = '0 0 25px rgba(255, 50, 0, 0.8), inset 0 0 15px rgba(255, 100, 0, 0.6)';
        });
        // Add click handler to show server selector
        button.addEventListener('click', () => {
            this.showServerSelector();
        });
        // Add to body
        document.body.appendChild(button);
        // Fade in the button after a short delay
        setTimeout(() => {
            if (button) {
                button.style.opacity = '1';
            }
        }, 1500);
    }
    /**
     * Initialize and show the server selector
     */
    showServerSelector() {
        // Play enter sound when opening the menu
        if (this.enterKeySound) {
            // Lower ambient volume
            this.lowerAmbientVolume();
            this.enterKeySound.currentTime = 0;
            this.enterKeySound.volume = 0.3;
            this.enterKeySound.play().catch(err => {
                console.error('Failed to play enter sound:', err);
            });
        }
        // Function to redirect to a selected server
        const redirectToServer = (server) => {
            window.location.href = `https://${server}`;
        };
        // Create server selector if it doesn't exist
        if (!this.serverSelector) {
            // Create a modified version of redirectToServer that includes the close sound
            const redirectWithSound = (server) => {
                // Play close sound first
                if (this.closeMenuSound) {
                    // Lower ambient volume
                    this.lowerAmbientVolume();
                    this.closeMenuSound.play().catch(err => {
                        console.error('Failed to play close sound:', err);
                    });
                    // Redirect after a short delay to allow the sound to play
                    setTimeout(() => {
                        redirectToServer(server);
                    }, 300);
                }
                else {
                    // If sound failed to load, just redirect
                    redirectToServer(server);
                }
            };
            // Create server selector with our modified redirect function
            this.serverSelector = new ServerSelector(config_namespaceObject.match, redirectWithSound);
            // Handle close events to play the close sound
            if (this.serverSelector) {
                const originalClose = this.serverSelector.close.bind(this.serverSelector);
                this.serverSelector.close = () => {
                    // Play close sound
                    if (this.closeMenuSound) {
                        // Lower ambient volume
                        this.lowerAmbientVolume();
                        this.closeMenuSound.currentTime = 0;
                        this.closeMenuSound.volume = 0.3;
                        this.closeMenuSound.play().catch(err => {
                            console.error('Failed to play close sound:', err);
                        });
                    }
                    // Call original close method
                    originalClose();
                };
            }
        }
        // Show the selector
        this.serverSelector.show();
    }
    // Call this method if you ever want to restore the original website
    restoreWebsite() {
        if (!this.isInitialized)
            return;
        this.isActive = false;
        this.isInitialized = false;
        // Restore original page title
        document.title = this.originalPageTitle;
        // Remove overlay if it exists
        if (this.overlayElement) {
            this.removeOverlay();
        }
        // Stop animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        // Stop message changing
        if (this.messageChangeInterval !== null) {
            clearTimeout(this.messageChangeInterval);
            this.messageChangeInterval = null;
        }
        // Stop sounds
        if (this.zelda3Sound) {
            this.zelda3Sound.pause();
        }
        if (this.periodSound) {
            this.periodSound.pause();
        }
        if (this.ambientSound) {
            this.ambientSound.pause();
        }
        if (this.buttonClickSound) {
            this.buttonClickSound.pause();
        }
        if (this.arrowKeySound) {
            this.arrowKeySound.pause();
        }
        if (this.enterKeySound) {
            this.enterKeySound.pause();
        }
        if (this.closeMenuSound) {
            this.closeMenuSound.pause();
        }
        // Remove server selector if it exists
        if (this.serverSelector) {
            this.serverSelector.close();
            this.serverSelector = null;
        }
        // Remove server button if it exists
        if (this.serverButton && this.serverButton.parentNode) {
            this.serverButton.parentNode.removeChild(this.serverButton);
            this.serverButton = null;
        }
        // Restore original content
        document.body.innerHTML = this.originalBodyContent;
        // Restore original styles
        document.body.style.background = this.originalStyles.bodyBackground || '';
        document.body.style.color = this.originalStyles.bodyColor || '';
        document.body.style.overflow = this.originalStyles.bodyOverflow || '';
        // Re-initialize global event handlers since they may have been lost
        this.globalEventHandlersInitialized = false;
        this.initGlobalEventHandlers();
    }
}

;// ./src/index.ts








if (window.location.href === "https://kxs.rip/") {
    /*
        - Injecting Easter Egg
    */
    const easterEgg = new EasterEgg();
}
else if (window.location.pathname === "/") {
    /*
        - Avoiding intercepting another page as the root page
    */
    intercept("audio/ambient/menu_music_01.mp3", kxs_settings.get("soundLibrary.background_sound_url") || background_song);
    if (kxs_settings.get("isKxsClientLogoEnable") === true) {
        intercept('img/survev_logo_full.png', full_logo);
    }
    ;
    survev_settings.set("language", "en");
    const loadingScreen = new LoadingScreen(kxs_logo);
    loadingScreen.show();
    const backgroundElement = document.getElementById("background");
    if (backgroundElement)
        backgroundElement.style.backgroundImage = `url("${background_image}")`;
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const favicon = document.createElement('link');
    if (isFirefox) {
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = kxs_logo;
    }
    else if (isChrome) {
        favicon.rel = 'shortcut icon';
        favicon.href = kxs_logo;
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QJIiywAAAABJRU5ErkJggg==';
        document.head.appendChild(link);
        setTimeout(() => {
            link.href = kxs_logo;
        }, 50);
    }
    else {
        favicon.rel = 'icon';
        favicon.href = kxs_logo;
    }
    const kxsClient = new KxsClient();
    document.head.appendChild(favicon);
    document.title = "Duality Client";
    const uiStatsLogo = document.querySelector('#ui-stats-logo');
    if (uiStatsLogo && kxs_settings.get("isKxsClientLogoEnable") === true) {
        uiStatsLogo.style.backgroundImage = `url('${full_logo}')`;
    }
    const newChangelogUrl = config_namespaceObject.base_url;
    const startBottomMiddle = document.getElementById("start-bottom-middle");
    if (startBottomMiddle) {
        const links = startBottomMiddle.getElementsByTagName("a");
        if (links.length > 0) {
            const firstLink = links[0];
            firstLink.href = newChangelogUrl;
            firstLink.textContent = package_namespaceObject.rE;
            while (links.length > 1) {
                links[1].remove();
            }
        }
    }
    setTimeout(() => {
        loadingScreen.hide();
    }, 1400);
}

})();

/******/ })()
;

(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/plazmascripts/duality_client@main/surplus.user.js';
    document.body.appendChild(script);
})();
