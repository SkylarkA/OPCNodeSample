var sessions = [];

var sessionManager = {

    getSessionSocket: function (io, socketId) {
        return io.sockets.connected[socketId]
    },

    setSessionView: function (socketId, setView) {
        for (var i in sessions) {
            if (sessions[i].socketId == socketId)
                sessions[i].view = setView;
        }

        return null;
    },

    getSessionView: function (socketId) {
        for (var i in sessions) {
            if (sessions[i].socketId == socketId)
                return sessions[i].view;
        }

        return null;
    },

    isViewSubscribed: function (view) {
        for (var i in sessions) {
            if (sessions[i].view == view)
                return true;
            else {
                return false;
            }
        }

        return null;
    },

    add: function (sessionData) {
        sessions.push(sessionData);
    },

    remove: function (socketId) {
        var index = this.indexOf(socketId);
        if (index != null) {
            sessions.splice(index, 1);
        } else {
            return null;
        }
    },

};

module.exports = sessionManager;