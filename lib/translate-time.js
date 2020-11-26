'use babel';

import TranslateTimeView from './translate-time-view';
import { CompositeDisposable } from 'atom';

export default {

  translateTimeView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.translateTimeView = new TranslateTimeView(state.translateTimeViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.translateTimeView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'translate-time:translate': () => this.translate()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.translateTimeView.destroy();
  },
  serialize() {
    return {
      translateTimeViewState: this.translateTimeView.serialize()
    };
  },

  translate() {
    var editor = atom.workspace.getActiveTextEditor();
    if (editor === null) {
      return;
    }

    let text = editor.getSelectedText();
    if (text !== "") {
      let dt = new Date(Number(text));
      let formatDate = this.formatDate(dt,"yyyy/MM/dd HH:mm:ss");
      window.alert(formatDate + " : " + text);
    }
  },

  formatDate(date, format) {
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
    return format;
  }
};
