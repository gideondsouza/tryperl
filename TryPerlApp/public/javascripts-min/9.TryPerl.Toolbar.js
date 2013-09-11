Ext.define('TryPerl.Toolbar',
{
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.tryperltoolbar',
    //this is needed for the toolbar to show up
    width: "100%",
    items: [
    '<b>TryPerl</b>',
	{
	    text: 'New',
	    iconCls: 'newIcon',
	    handler: function (evt, data) {
	        //show ask for a new file here?
	        Ext.Msg.prompt('New Script File', 'Please enter a Filename:', function (btn, text) {
	            if (btn == 'ok' && text != '') {
	                Globals.getEventBus().fireEvent('newScript', { filename: text });
	            }
	        }, this, false, 'Untitled');
	    }
	},
    {
        text: 'Save',
        iconCls: 'saveIcon',
        handler: function (evt, data) {
            Globals.getEventBus().fireEvent('saveScript', { content: AceManager.Editor.getValue() });
        }

    },
    {
        text: 'Run',
        iconCls: 'goIcon',
        handler: function (evt, data) {
			if(Globals.getSTDINTextArea().isValid()) {
            	Globals.getEventBus().fireEvent('runScript', { content: AceManager.Editor.getValue(),  stdin : Globals.getSTDINTextArea().getValue()});
			} else {
				Ext.Msg.alert("Error","Data in STDIN is too long. Please keep it under 10KB. Contact me if you think you need more.");
			}
        }

    },
    {
        text: 'Validate',
        iconCls: 'checkIcon',
        handler: function (evt, data) {
            Globals.getEventBus().fireEvent('validateScript', { content: AceManager.Editor.getValue() });
        }
    },
	'->', // same as { xtype: 'tbfill' }
	'-',
	{
	    xtype: 'splitbutton',
	    text : 'Share',
		iconCls: 'shareIcon',
		menu : new Ext.menu.Menu({
		        items: [
		            // these will render as dropdown menu items when the arrow is clicked:
		            {
						text: 'Google+', 
						iconCls: 'googleplusIcon',
						handler: function()
						{ 
							window.open('https://plus.google.com/share?url=' + encodeURIComponent(window.location));
						}
					},
					{
						text: 'Twitter', 
						iconCls: 'twitterIcon',
						handler: function()
						{ 
							window.open('https://twitter.com/intent/tweet?text=Check out my %23perl script at ' + encodeURIComponent(window.location));
						}
					},
					{
						text : 'Facebook',
						iconCls: 'facebookIcon',
						handler: function()
						{ 
							window.open('http://www.facebook.com/share.php?u=' + encodeURIComponent(window.location));
						}
					},
					{
						text: 'Email', 
						iconCls: 'emailIcon',
						handler: function()
						{ 
							window.open('mailto:?body=Check out my perl script ' + encodeURIComponent(window.location) +'&subject=Hey, try perl!');
						}
					}
		        ]
		    })
	},
	'-', // same as {xtype: 'tbseparator'} to create Ext.toolbar.Separator
	{
		id : 'btnLogin',
	    text: 'Login w/ GitHub',
	    iconCls : 'octocatIcon',
	    handler: function (evt, data) {
			window.location.href = Globals.LoginUrl;
		}
	},
    {
		id : 'btnUserName',
	    text: Globals.Username,
	    icon: Globals.getGravatarUrl(),
	    handler: function (evt, data) {
			window.open(TryPerl.Constants.GITHUB_USER_URL);
		}
	},
	{
		id : 'btnLogOff',
	    text: 'Log Off',
	    iconCls: 'dooroutIcon',
	    handler: function () {
	        window.location.href = Globals.getBaseUrl() + TryPerl.Constants.LOGOFF_URL_PART;
	    }
	},
	'-',	
	{
		text: "Help",
		iconCls: 'helpIcon',
	    handler: function () {
	      var win = Ext.create('HelpWindow');
	      win.show();
	      
	    }
	},
	{
		text: "About",
		iconCls: 'infoIcon',
	    handler: function () {
	        window.location.href = Globals.getBaseUrl() + TryPerl.Constants.ABOUT_PART;
	    }
	}
	]
});