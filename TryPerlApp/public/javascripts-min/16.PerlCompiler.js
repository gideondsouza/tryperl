//this isn't any sort of compiler. 
//Just a wrapper that will make ajax calls to my server and send a program to compile or run
Ext.define('PerlCompiler', {
    singleton: true,
    compileCode: function (code, callBack) {
        console.log('Code I got to COMPILE:');
        console.log(code);
		//now i don't remember why the hell I added this regex thingie here! :(
		this._makeRequest('/compile', { content : code.replace(/(\r\n|\n|\r)/gm,"") },callBack);
    },
    runCode: function (code, stdin, callBack) {
        console.log('Code I got to RUN:');
        console.log(code);
		console.log("I got this many STDIN chars:" + stdin.length);
		this._makeRequest('/run',{content : code, arg : stdin},callBack);
    },
    _makeRequest: function (the_url, the_params, callBack) {
        Ext.Ajax.request({
		    url: the_url,
			method : 'POST',
			params : the_params,
		    success: function(response){
				var result = Ext.decode(response.responseText);
				console.log(result);
				callBack(result);
			}
		});
    }
});