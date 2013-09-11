//you'll have to create the store somewhere.

Ext.define('TryPerl.FileGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tryperlfilegrid',
    id : 'tryperlfilegrid',
    
    preventHeader: true,
    title: 'Files',
    columns: [
        { text: 'File Name', dataIndex: 'filename', flex: 1 },
        { text: 'Id', dataIndex: 'file_id' }
        ,
        {
            xtype: 'actioncolumn',
            width: 50,
            items: [
			{
                icon: TryPerl.Constants.EDIT_ICON_URL,
                tooltip: 'Open for Edit',
                handler: function (grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
        			Globals.getEventBus().fireEvent('openFile', rec.data);
                }
            },
                {
                    icon: TryPerl.Constants.OCTOCAT_ICON_URL,
                    tooltip: 'Open in Github',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        window.open(TryPerl.Constants.GITHUB_GIST_URL + rec.get('file_id'));
                    }
            }]
        }
    ],
    //grid might go invisible
    //height: '100%',
    minheight: '100px',
    width: '100%',
    initComponent: function () {
        this.initStore();
        this.on('afterrender', this.onAfterRender);
        this.callParent(arguments);
    }
    ,
    initStore: function () {
        Ext.create('TryPerl.CodeFileStore');
        Ext.applyIf(this, {
            store: Ext.data.StoreManager.lookup('codeFileStore')
        });
    },
    onItemDblClick: function (view, record, item, index, e, eOpts) {
        Globals.getEventBus().fireEvent('openFile', record.data);
    },
    onAfterRender: function () {
		var me = this;
		this.loadAllFiles();
        this.on('itemdblclick', this.onItemDblClick);
    },
    loadAllFiles : function	() {
    	var me = this;
    	me.disable();
	    TryPerl.CodeManager.getAllFiles(function(files) {
	    	// I should do something like this here ? me.suspendLayout(true);
	        me.store.loadData(files, false);
   	    	//me.suspendLayout();
   	    	me.enable();
		});
    }


});