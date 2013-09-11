Ext.define('Globals', {
    singleton: true,
    eventBus: undefined,
    Username : '::Default::',//public
	GravatarId : 'xxx',
	FileGrid : undefined,
	EditorTab : undefined,
	CurrentFileId : undefined,
	DefaultFile : '4641895',
	LoginUrl : '',
    setEventBus: function (value) {
        this.eventBus = value;
    },
    getEventBus: function () {
        return this.eventBus;
    },
    openFile: function (id, file, filename) {
    	this.CurrentFileId = id;
    	this.CurrentFileName = filename;
		this.setHash(id);
        AceManager.Editor.setValue(file);
        AceManager.Editor.clearSelection();
        Ext.getCmp('defaultTab').setTitle(filename);
    },
    showSuccessMessage: function (msg) {
        Ext.getCmp('outputpanel').showSuccessMessage(msg);
    },
    showFailureMessage: function (msg) {
        Ext.getCmp('outputpanel').showFailureMessage(msg);
    },
	getGravatarUrl : function() {
		return 'http://www.gravatar.com/avatar/'+ this.GravatarId +'?size=16';
	},
	getGrid : function() {
		if(this.EditorTab == undefined) {
			this.EditorTab = Ext.getCmp('tryperlfilegrid');
		}
		return this.EditorTab;
	},
	getCodeEditor : function() {
		if(this.FileGrid == undefined) {
			this.FileGrid = Ext.getCmp('defaultTab');
		}
		return this.FileGrid;
	},
	enableCodeEditor : function() {
	  this.getCodeEditor().enable();
	},
	disableCodeEditor : function() {
	  this.getCodeEditor().disable();	
	},
	disableGrid : function() {
		this.getGrid().disable();
	},
	enableGrid : function() {
		this.getGrid().enable();
	},
	reloadAllFiles : function() {
		this.getGrid().loadAllFiles();
	},
	showLoadingFileMessage : function() {
		 Ext.getCmp('defaultTab').setTitle("Loading.Please wait...");
	},
	getBaseUrl : function () {
	   return location.protocol + "//" + location.hostname + 
	      (location.port && ":" + location.port) + "/";
	},
	getLeftPanelTitle : function() 
	{ 
		if(Globals.Username == TryPerl.Constants.ANON_USER) 
		{ 
			return 'Recent Anonymous Files';
		} 
		return 'Your Files(Gists)'; 
	},
	getHash : function () {
		if(window.location.hash) {
			return window.location.hash.slice(1);			
		}
		return "";
	},
	setHash : function (hash) {
		return window.location.hash = "#" + hash;			
		return "";
	}

});