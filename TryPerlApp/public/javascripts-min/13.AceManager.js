Ext.define('AceManager', {
    singleton: true,
    Editor: undefined,
    _defaultMode: "perl",
    _defaultTheme: "textmate",
    aceify: function (id) {
        this.Editor = ace.edit(id);
        this.setTheme(this._defaultTheme);
        this.Editor.getSession().setMode('ace/mode/' + this._defaultMode);
        this._setShortcuts();
        //Ext.get('codeEditor').setStyle('width', '100%');
    },
    setTheme: function (theme) {
        this.Editor.setTheme('ace/theme/' + theme);
    },
    _setShortcuts: function () {
        this.Editor.commands.addCommand({
            name: 'saveCommand',
            bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
            exec: function (editor) {
                console.log('Called Saved on editor..');
            }
        });
        this.Editor.commands.addCommand({
            name: 'validateCommand',
            bindKey: { win: 'Ctrl-Shift-V', mac: 'Ctrl-Shift-V' },
            exec: function (editor) {
            }
        });
        this.Editor.commands.addCommand({
            name: 'runCommand',
            bindKey: { win: 'Ctrl-R', mac: 'Command-R' },
            exec: function (editor) {
            }
        });
    }
    //fn to fix width :(
});