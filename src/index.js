/**
 * Build styles
 */
require('./index.css').toString();

/**
 * Base Sapo Block for the Editor.js.
 * Represents simple Sapo for article
 *
 * @author chanhha (chanhqh.dev@gmail.com)
 * @copyright Chanh Ha 2020
 * @license The MIT License (MIT)
 */

/**
 * @typedef {object} SapoConfig
 * @property {string} placeholder - placeholder for the empty Sapo
 * @property {boolean} preserveBlank - Whether or not to keep blank Sapo when saving editor data
 */

/**
 * @typedef {Object} SapoData
 * @description Tool's input and output data format
 * @property {String} text — Sapo's content.
 */
class Sapo {
  /**
   * Default placeholder for Sapo Tool
   *
   * @return {string}
   * @constructor
   */
  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  constructor({ data, config, api }) {
    this.api = api;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-sapo'
    };

    this._placeholder = config.placeholder ? config.placeholder : Sapo.DEFAULT_PLACEHOLDER;
    this._data = {};
    this._element = this.drawView();
    this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;

    this.data = data;
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let div = document.createElement('div');

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = true;
    div.dataset.placeholder = this.api.i18n.t(this._placeholder);

    return div;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    return this._element;
  }

  /**
   * Validate Sapo block data:
   * - check for emptiness
   *
   * @param {SapoData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    if (savedData.text.trim() === '' && !this._preserveBlank) {
      return false;
    }

    return true;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Sapo tools rendered view
   * @returns {SapoData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: toolsContent.innerHTML
    };
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML
    };

    this.data = data;
  }

  /**
   * Enable Conversion Toolbar. Sapo can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: 'text', // to convert Sapo to other block, use 'text' property of saved data
      import: 'text' // to covert other block's exported string to Sapo, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      }
    };
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle only H1 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['H1'],
    };
  }

  /**
   * Get current Tools`s data
   * @returns {SapoData} Current data
   * @private
   */
  get data() {
    let text = this._element.innerHTML;

    this._data.text = text;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {SapoData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    this._element.innerHTML = this._data.text || '';
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['P']
    };
  }

  /**
   * Icon and Sapo for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: require('../assets/icon.svg').default,
      title: 'Sapo'
    };
  }
}

module.exports = Sapo;