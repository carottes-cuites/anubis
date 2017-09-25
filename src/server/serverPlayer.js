module.exports = class ServerPlayer {
    
    constructor() {
        
    }

    play() {
        channel.join().then(connection => {
            return connection.playStream(path);
        })
        .then(dispatcher => {

            //Handle queue list behavior from here
            dispatcher.on('end', () => {
                console.log("Stream end.");
                return true;
            });
            dispatcher.on('speaking', () => {
                console.log("Streaming...");
            });
            dispatcher.on('start', () => {
                console.log("Stream starts...");
            });
            dispatcher.on('error', console.error);
        })
        .catch(console.error);
    }
}  