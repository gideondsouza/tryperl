Ext.define('HelpWindow', {
	extend : 'Ext.window.Window',
    title: 'Help',
    height: 200,
    width: 400,
    layout: 'fit',
    items: {
        xtype: 'label',
        html  : '<p>Shortcuts:</p><ol>'+
        '<li>>Ctrl + / toggle comment.</li> <li>Yes, it\'s a lot like textmate :). Note: Replace Ctrl with Cmd on Mac.</li></ol>'
    }
});