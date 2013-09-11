Ext.define('CodeFileViewModel', {
    extend: 'Ext.data.Model',
    fields: [

            { name: 'filename', type: 'string' },
            { name: 'file_id', type: 'string' },
            { name: 'starred', type: 'bool' },
            { name: 'created_at', type: 'string' },
            { name: 'url', type: 'string' },
            { name: 'comment_count', type: 'int' },
            { name: 'description', type: 'string' }
        ]
});