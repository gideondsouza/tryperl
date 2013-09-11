Ext.define('AboutWindow', {
	extend : 'Ext.window.Window',
    title: 'Help',
    height: 200,
    width: 400,
    layout: 'fit',
    items: {
        xtype: 'label',
        html  : 'www.tryperl.com was built with ExtJS, Perl, Dancer, Amazon EC2 on RHEL.<br/>'+
        'Built by <a href="http://www.gideondsouza.com"/>Gideon Dsouza</a>'
    }
});