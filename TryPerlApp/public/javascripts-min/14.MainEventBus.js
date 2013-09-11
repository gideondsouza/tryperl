Ext.define('MainEventBus', {
    extend: 'Ext.util.Observable',
    constructor: function () {
        var me = this;
        me.callParent();
        this.addEvents('runScript', 'saveScript', 'newScript', 'validateScript', 'logoff');
    }
});