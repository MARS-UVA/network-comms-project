// import dgram from node.js
const dgram = require('dgram');

const MESSAGE_LENGTH = 1500; // Message Length (in bytes) of data from the Jetson, kinda arbitrary?

// declare server socket class
class ServerSocket {
    /**
        * @param {number} port - port number used to bind the server to
        * @param {(rcvdMessage: Object) => ()} onRecvMessage 
        *   - Callback function, invoked when server receives a message
    */
    constructor(port, onRecvMessage) {

        // Create a UDP server socket
        this.server = dgram.createSocket('udp4');

        // Event: When socket binds to port or sends message for the first time. Sets server address and
        // receive buffer size
        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`Server is listening on ${address.address}:${address.port}`);
            this.server.setRecvBufferSize(MESSAGE_LENGTH * 1000);    // Set receive buffer size to be large enough for  1000 messages
        });

        // Event: When receiving a message
        this.server.on('message', (message, remote) => {
            console.log(message.subarray(0, 10));
            //console.log(`Received message from IP: ${remote.address} and port: ${remote.port}`);
            //console.log(`Msg from client: ${message.toString()}`);

            // const receivedChunks = {}
            const sequenceNumber = (message[1] << 8) | message[0];
            const totalPackets = (message[3] << 8) | message[2];
            const chunkData = message.subarray(10);

            console.log(`Received packet ${sequenceNumber + 1} of ${totalPackets}`);
            console.log(chunkData.length);
            this.receivedChunks[sequenceNumber] = chunkData;
            const totalChunks = totalPackets;
            //Check if all packets have been received
            //Probably keep check recievedChunks length in default, rest in logic
            if(sequenceNumber+1 >= totalChunks) {
                // This variable (function) does logic speicific to type of data socket handles
                onMessage(this.receivedChunks)
                this.receivedChunks = {}
            }
            
            /*
            // Echo the message back to the client
            server.send(message, 0, message.length, remote.port, remote.address, (err) => {
                if (err) {
                    console.error("Error sending message:", err.message);
                } else {
                    console.log("Message echoed back to client");
                }
            });
            */
        });

        // Event: When error, occurs handle error
        this.server.on('error', (err) => {
            console.error(`Server error: ${err.stack}`);
            this.server.close();
        });

        // Event: When closing socket, log message
        this.server.on('close', () => {
            console.log("Server socket closed");
        });

        // bind socket to port
        this.server.bind(this.PORT, '0.0.0.0', () => { // listen at specified port and address 0.0.0.0
            console.log("Socket bound successfully");
        });        
        
        
    }
}

const imageOnMessage = (receivedChunks) => {
    console.log("All chunks received. Reassembling image.");
    console.log(Object.keys(receivedChunks));
    const fullImage = Buffer.concat(Object.values(receivedChunks));
    lastImageBuffer = fullImage;

    // Send to websocket
    websockets.image.send(lastImageBuffer);
    console.log("sent image to client");
}

// launch server sockets for image and motor feedback
zachServer = new ServerSocket(7, imageOnMessage);
console.log(" this runs");