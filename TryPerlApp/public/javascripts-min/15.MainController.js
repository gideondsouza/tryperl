Ext.define('MainController', {
    singleton: true,
    prepareHandlers: function () {
        Globals.getEventBus().on('runScript', this.onRunScript);
        Globals.getEventBus().on('validateScript', this.onValidateScript);
        Globals.getEventBus().on('saveScript', this.onSaveScript);
        Globals.getEventBus().on('newScript', this.onNewScript);
        Globals.getEventBus().on('openFile', this.onOpenFile);
    },
    onRunScript: function (data) {
        PerlCompiler.runCode(data.content, data.stdin, function (res) {
            // if (res.success) {
                Globals.showSuccessMessage(res.output);
            // } else {
            //     Globals.showFailureMessage(res.output);
            // }
        });

    },
    onValidateScript: function (data) {
        PerlCompiler.compileCode(data.content, function (res) {
            if (res.success) {
                Globals.showSuccessMessage(res.output);
            } else {
 				if(res.output == "") {
	 				Globals.showFailureMessage("Tip: Balance or remove any single quotes inside comments. This is a known issue.");
 				}  else {
                	Globals.showFailureMessage(res.output);
                }
            }
        });
    },
    onSaveScript: function (data) {
       if(Globals.CurrentFileId != Globals.DefaultFile) {
		   Globals.disableCodeEditor();
		   Globals.disableGrid();
		   TryPerl.CodeManager.editFile(Globals.CurrentFileName, Globals.CurrentFileId, data.content, 
		   function() {
		    		Globals.showSuccessMessage(Globals.CurrentFileName+" was saved");
		    		Globals.enableCodeEditor();
		    		Globals.enableGrid();
		    });
		} else {
			Ext.Msg.alert("Error","Whoops! This is a shared default file. Please don't save it.");
		}
    },
    onNewScript: function (data) {
        TryPerl.CodeManager.newFile(data.filename+".pl", function() {
			Globals.reloadAllFiles();
        	Globals.showSuccessMessage(data.filename+".pl was created on gists.github.com. You should see this file on the left grid. DOUBLE-CLICK or click EDIT icon to open.");
		});
    },
    onOpenFile: function (data) {
	    Globals.showLoadingFileMessage();
	    Globals.disableCodeEditor();
        TryPerl.CodeManager.getFileContent(data.file_id, function(content) {
			Globals.openFile(data.file_id, content, data.filename);
			Globals.enableCodeEditor();
		});   
    }
});