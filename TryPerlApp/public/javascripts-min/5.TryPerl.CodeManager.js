Ext.define('TryPerl.CodeManager', {
    singleton: true,
    getAllFiles: function (callBack) {
        var ret = [];
		Ext.Ajax.request({
		    url: '/getgists',
		    success: function(response){
		        var json = Ext.decode(response.responseText);
				for (var i=0; i < json.length; i++) {
					 var theFile = Ext.create('CodeFileModel', 
					{
						filename: json[i].filename,
			            file_id: json[i].file_id,
			            starred: false,
			            created_at: '',
			            url: '',
			            comment_count: json[i].comment_count,
			            description: json[i].description
					});
					ret.push(theFile);
				};
				callBack(ret);
		    }
		});
    },
    getFileContent: function (id, callBack) {
        Ext.Ajax.request({
		    url: '/getgistcontent/'+id,
		    success: function(response){
				var content = response.responseText;
				var filename = id;
				var srch = content.search("#F:");
				if(srch != -1) {
					filename = content.substr(srch+3);
					content = content.substr(0,srch-1);//-1 to remove the /n added by the server
				}
				callBack(content, filename);
			}
		});
    },
    newFile : function(theFilename, callBack) {
	    Ext.Ajax.request({
       		method: "POST",
		    url: '/newgist',
		    params: {
			    filename : theFilename
		    },
		    success: function(response){
		        console.log(response);
		        callBack();//should prolly return the id here?
		    }
		});
    },
    editFile: function (theFilename, theId, theContent, callBack) {
     Ext.Ajax.request({
     		method: "POST",
		    url: '/savegist',
		    params: {
			    filename : theFilename,
			    id : theId,
			    content : theContent 
		    },
		    success: function(response){
		        console.log(response);
		        callBack();//should prolly return the id here?
		    }
		});
    },
    starFile: function () {

    },
    deleteFile: function () {

    },
    //privates
    _makeAjaxCall: function () {

    }
    //add an error event in your event bus...

});