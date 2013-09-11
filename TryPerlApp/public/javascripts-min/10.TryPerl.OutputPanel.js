Ext.define('TryPerl.OutputPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tryperloutputpanel',
    id: 'outputpanel',

    preventHeader: true,
    height: '100%',
    tpl: Ext.create('Ext.XTemplate','<pre>{msg}</pre>',{compiled:true}),
   /*
   I tried to make a 100% filled textarea inside this panel and wasted a loong long time. :(
 scroll: 'vertical',

    items : [
	    {
	    	id : 'outputtextarea',
			xtype: 'textareafield',
		    layout:'fit',
		    height: "100%",
		    width: 1024,
			setScrollable: 'vertical',
			padding : 5
			
		}
    ],
    afterRender : function() {
		this.callParent(arguments);  
    },
*/

    showSuccessMessage: function (theMsg) {
        this.update({msg:theMsg});
        this.body.setStyle('background-color', TryPerl.Constants.OUTPUT_SUCCESS_COLOR);
        this.body.setStyle('color', TryPerl.Constants.OUTPUT_SUCCESS_COLOR_TEXT);
    },
    showFailureMessage: function (msg) {
        this.update(msg);
        this.body.setStyle('background-color', TryPerl.Constants.OUTPUT_FAILURE_COLOR);
        this.body.setStyle('color', TryPerl.Constants.OUTPUT_FAILURE_COLOR_TEXT);
        
    }
});