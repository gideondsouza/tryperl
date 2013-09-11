//this isn't any sort of compiler. 
//Just a wrapper that will make ajax calls to my server and send a program to compile or run
Ext.define('PerlCompiler', {
    singleton: true,
    compileCode: function (code, callBack) {
        console.log('Code I got to COMPILE:');
        console.log(code);
		this._makeRequest('/compile',code.replace(/(\r\n|\n|\r)/gm,""),callBack);
    },
    runCode: function (code, callBack) {
        console.log('Code I got to RUN:');
        console.log(code);
		this._makeRequest('/run',code,callBack);
    },
    _makeRequest: function (the_url, code, callBack) {
        Ext.Ajax.request({
		    url: the_url,
			method : 'POST',
			params : { content : code },
		    success: function(response){
				var result = Ext.decode(response.responseText);
				console.log(result);
				callBack(result);
			}
		});
    }
});