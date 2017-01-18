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

//var nodeIdsConfig = require('./viewNodeIds.json');
var nodeIdsConfig = require('./allNodeIDs.json');


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

var endpointUrl = 'opc.tcp://' + argv.endpoint;
console.log(endpointUrl);


var app = express();


// start HttpServer
(function () {

    app.use(express.static(path.join(__dirname, '../../web_clients/ng2Hmi/dist')));

    // app.all('/*', function (req, res) {
    //     res.sendfile('index.html', { root: '../ng2Hmi/dist' });
    // });

    io = require('socket.io').listen(app.listen(appPort));
    console.log("Listening on port " + appPort);

})();


//var processOverviewNodeIDs = nodeIdsConfig.Process_Overview // array
var allNodeIDs = nodeIdsConfig.All_Node_IDs // array

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



        io.sockets.on('connection', function (socket) {
            console.log('connected to client'.green.bold);

            socket.on('LatestValues', function (view) {

                console.log("Getting Values for " + view);

                // get latest Values
                async.each(allNodeIDs, function (id, callback) {
                    if (the_session !== null) {
                        the_session.readVariableValue(id, function (err, dataValue) {
                            if (!err) {
                                console.log("READ: ".yellow + id.yellow + " is ", dataValue.toString());

                                socket.emit("NewData", {
                                    value: dataValue.value.value,
                                    timestamp: dataValue.serverTimestamp,
                                    nodeId: id.toString()
                                });
                            }
                            else {
                                console.log(err);
                            }
                        })
                    }
                });
            });
            // Start subscription
            socket.on('StartSubscription', function (view) {

            });

            // Start subscription
            socket.on('WriteBool', function _write_node_value(boolValue) {
                var nodeId = "ns=3;s=TF1.UR_STAC.AppLogic.Sim_Start";

                console.log(typeof (boolValue));
                console.log("WRITE: ".red + nodeId.red + " set to: " + boolValue);

                var dataToWrite = {
                    dataType: opcua.DataType.Boolean,
                    value: boolValue
                };

                the_session.writeSingleNode(nodeId, dataToWrite, function (err) {
                    if (!err) {
                        //statusCodes.length.should.equal(nodesToWrite.length);
                        //statusCodes[0].should.eql(opcua.StatusCodes.BadNotWritable);
                    }
                    //done(err);
                });

            }),


                socket.on('disconnect', function () {
                    console.log("Client disconnected");
                });

        });
    }


], function (err) {

    if (!err) {
        startSubscription();
    } else {
        // cannot connect to client
        console.log(err);
    }
});




function startSubscription() {
    console.log("subscription started");

    // check if subscription is already running for that view? or if subscription is running for variables?
    allNodeIDs.forEach(function (id) {
        var nodeID = id;

        var monitoredItem = the_subscription.monitor(
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
                io.sockets.emit('NewData', {
                    value: dataValue.value.value,
                    timestamp: dataValue.serverTimestamp,
                    nodeId: nodeID.toString()
                });
            }
        });
    });
}


// all in async series?


