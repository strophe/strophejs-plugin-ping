/*
* Based on Ping Strophejs plugins (https://github.com/metajack/strophejs-plugins/tree/master/ping)
* This plugin is distributed under the terms of the MIT licence.
* Please see the LICENCE file for details.
*
* Copyright (c) Markus Kohlhase, 2010
* Refactored by Pavel Lang, 2011
* AMD Support added by Thierry
* UMD support by LeartS
*/

/**
* File: strophe.ping.js
* A Strophe plugin for XMPP Ping ( http://xmpp.org/extensions/xep-0199.html )
*/
import { $iq, Strophe } from 'strophe.js';

Strophe.addConnectionPlugin('ping', {
    _c: null,

    // called by the Strophe.Connection constructor
    init: function(conn) {
        this._c = conn;
        Strophe.addNamespace('PING', "urn:xmpp:ping");
    },

    /**
    * Function: ping
    *
    * @param {string} to - The JID you want to ping
    * @param {function} success - Callback function on success
    * @param {function} error - Callback function on error
    * @param {number} timeout - Timeout in milliseconds
    */
    ping: function(jid, success, error, timeout) {
        var id = this._c.getUniqueId('ping');
        var iq = $iq({type: 'get', to: jid, id: id}).c(
                        'ping', {xmlns: Strophe.NS.PING});
        this._c.sendIQ(iq, success, error, timeout);
    },

    /**
    * Function: pong
    *    
    * @param {Object} ping - The ping stanza from the server 
    */
    pong: function(ping) {
        var from = ping.getAttribute('from');
        var id = ping.getAttribute('id');
        var iq = $iq({type: 'result', to: from,id: id});
        this._c.sendIQ(iq);
    },

    /**
    * Function: addPingHandler
    *    
    * @param {Function} handler - Ping handler
    *
    * @returns A reference to the handler that can be used to remove it.
    */
    addPingHandler: function(handler) {
        return this._c.addHandler(handler, Strophe.NS.PING, "iq", "get");
    }
});
