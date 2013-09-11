Ext.define('TryPerlIde', {
    extend: 'TryPerl.Viewport',
    items: [
	{
	    xtype: 'tryperltoolbar',
	    //this is needed for the toolbar to function.
	    renderTo: document.body
	},
	{
	    region: 'west',
	    collapsible: true,
	    title: Globals.getLeftPanelTitle(),
	    split: true,
	    width: 300,
	    items: { xtype: 'tryperlfilegrid' }
	}, {
	    region: 'south',
	    title: 'Output',
	    items: { xtype: 'tryperloutputpanel' },
	    collapsible: true,
	    split: true,
	    height: 150,
	    minHeight: 100
	}, {
	    region: 'center',
	    xtype: 'tabpanel', // TabPanel itself has no title
	    activeTab: 0,      // First tab active by default
	    //html: "<div id='codeEditor' style='height:\"100%\";width:\"900px;\"'></div>"
	    items: {
	        id: 'defaultTab',
	        title: '::Default::',
	        //finally finally! Panel is the one to work!!
	        items: [{ xtype: 'panel', text: 'Code', id: 'codeEditor', height: '100%', width: '97%'}]
	    }
	}]

});