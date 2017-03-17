"use strict"

var argv = require('yargs')
    .demand("endpoint")
    .string("endpoint")
    .describe("endpoint", "the opcua server to connect to ")
    .usage("\n Usage: node $0 <endpointUrl:portNumber>")
    .alias('e', 'endpoint')
    .example('node $0 --endpoint 192.168.1.1:9999')
    .argv;

var express = require("express");
var appPort = 3700;

var opcua = require("node-opcua");
var async = require("async");
var color = require("colors");
var path = require('path');
var io;

var sessionmgr = require('sessionmanager');
var nodeIDs = require('view_variables/viewNodeIDs.json');

var options = {
    keepSessionAlive: true,
    connectionStrategy: {
        maxRetry: 10,
        initialDelay: 2000,
        maxDelay: 10 * 1000
    }
};

var client = new opcua.OPCUAClient(options);

var the_subscription, the_session;
var userIdentity = null;
//xx var  userIdentity = { userName: "opcuauser", password: "opcuauser" };

var endpointUrl = 'opc.tcp://' + argv.endpoint;
console.log(endpointUrl);


var app = express();

// start HttpServer
(function () {
    app.use(express.static(path.join(__dirname, '../ng2Hmi/dist')));

    io = require('socket.io').listen(app.listen(appPort));
    console.log("Listening on port " + appPort);
})();


// create the Session
async.series([
    function (callback) {
        console.log(" connecting to ", endpointUrl.magenta.bold);
        client.connect(endpointUrl, callback);
    },
    function (callback) {
        console.log(" connect callback".yellow);

        client.createSession(userIdentity, function (err, session) {
            if (!err) {
                the_session = session;
                console.log(" session created".yellow);
            }
            callback(err);
        });
    },
    function (callback) {
        the_subscription = new opcua.ClientSubscription(the_session, {
            requestedPublishingInterval: 200,
            requestedMaxKeepAliveCount: 10,
            requestedLifetimeCount: 6000,
            maxNotificationsPerPublish: 2,
            publishingEnabled: true,
            priority: 6
        });
        //xx the_subscription.monitor("i=155",DataType.Value,function onchanged(dataValue){
        //xx    console.log(" temperature has changed " + dataValue.value.value);
        //xx });
        the_subscription.on("started", function () {
            console.log("subscription started");
            callback();

        }).on("keepalive", function () {
            console.log("keepalive");

        }).on("terminated", function () {
            console.log(" TERMINATED ------------------------------>")
        });


        io = require('socket.io').listen(app.listen(appPort));
        console.log("Listening on port " + appPort);


        io.sockets.on('connection', function (socket) {
            console.log('connected to client'.green.bold);

            session = new Object();
            session.sesSocket = socket;
            session.socketId = socket.id;
            session.view = "";
            sessionmgr.add(session);

            socket.on('getViewNodeIds', function (view) {
                // TODO:Check view
                console.log("Get Values for" + view);

                // unscubscribe from old room
                currentView = sessionmgr.getSessionView(socket.id);
                socket.leave(currentView);
                // set new View
                sessionmgr.setSessionView(socket.id, view);

                // getting latest values from server and writing in latestViewVars
                let viewNodeIDs = nodeIDs.view;
                let latestViewVars = [];

                async.each(viewNodeIDs, function (id, callback) {
                    if (the_session !== null) {
                        the_session.readVariableValue(id, function (err, dataValue) {
                            if (!err) {
                                console.log(" READ: ".yellow + id.yellow + " has Value: ", dataValue.toString());
                                // Transforms Array of nodes from our current view to an object with nodes as keys and the values as value 
                                latestViewVars = viewNodeIDs.reduce(function (result, dataValue, viewNodeIds) {
                                    result[viewNodeIDs] = dataValue;
                                    return result;
                                }, {});
                            }
                            else {
                                console.log(err);
                            }
                        })
                    }
                })
                // sending parsed object with latest Values to client
                socket.emit("IdListLatestValues", latestViewVars);
            });
            // Starting subscription for view
            socket.on('StartSubscription', function (view) {
                // TODO: Check view

                // join channel
                socket.join(view);

                if (!sessionmgr.isViewSubscribed(view)) {
                    let viewNodeIDs = nodeIDs.view;
                    viewNodeIDs.forEach(function (id) {
                        let nodeID = id;
                        let monitoredItem = the_subscription.monitor(
                            {
                                nodeId: opcua.resolveNodeId(nodeID),
                                attributeId: 13,
                            },
                            {
                                samplingInterval: 150,
                                discardOldest: true,
                                queueSize: 1
                            }, opcua.read_service.TimestampsToReturn.Both, function (err) {
                                if (err) {
                                    console.log("Monitor  " + nodeID.toString() + " failed");
                                    console.loo("ERr = ", err.message);
                                }
                            });

                        monitoredItem.on("changed", function (dataValue) {
                            console.log("SUBSCRIPTION: ".cyan + id.cyan + " has changed " + dataValue.toString());
                            if (io != null) {
                                io.to(view).emit('NewData', {
                                    value: dataValue.value.value,
                                    timestamp: dataValue.serverTimestamp,
                                    nodeId: nodeID.toString()
                                });
                            }
                        });
                    });
                }
                
                // TODO unsubscribe from NodeIds not beeing viewed 

                console.log("Subscrition for " + view + " subscription started");
            });

            socket.on('disconnect', function () {
                currentView = sessionmgr.getSessionView(socket.id);
                socket.leave(currentView);
                sessionmgr.remove(socket.id)
                // TODO: Unsubscribe from Vars in View

            });
        });
    }
], function (err) {

    if (!err) {
        // startSubscription();
    } else {
        // cannot connect to client
        console.log(err);
    }
});



