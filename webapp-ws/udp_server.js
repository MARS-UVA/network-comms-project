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
        this.PORT = port;
        this.receivedChunks = {}

        // Create a UDP server socket
        this.server = dgram.createSocket('udp4');

        // Event: When socket binds to port or sends message for the first time. Sets server address and
        // receive buffer size
        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`Server is listening on ${address.address}:${address.port}`);
            this.server.setRecvBufferSize(MESSAGE_LENGTH * 1000);    // Set receive buffer size to be large enough for  1000 messages
        });

        // Event: When receiving a datagram, check total number of datagrams we're receiving and 
        // call a callback function to process the received data
        this.server.on('message', (message, remote) => {
            console.log(message.subarray(0, 10));
            //console.log(`Received message from IP: ${remote.address} and port: ${remote.port}`);
            //console.log(`Msg from client: ${message.toString()}`);

            const sequenceNumber = (message[1] << 8) | message[0];
            const totalPackets = (message[3] << 8) | message[2];
            const chunkData = message.subarray(10); // data starts from index 10 of message

            console.log(`Received packet ${sequenceNumber + 1} of ${totalPackets}`);
            console.log("Length of received packet: %d", chunkData.length);
            this.receivedChunks[sequenceNumber] = chunkData;
            const totalChunks = totalPackets;
            console.log(this.receivedChunks)

            //If all packets have been received, invoke callback function
            if(sequenceNumber+1 >= totalChunks) {
                // This variable (function) does logic speicific to type of data socket handles
                onRecvMessage(this.receivedChunks)
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


// dummy callback function that prints the chunk of data that's received
/**
        * @param {Array} receivedChunks - an array of bytes received by the server
*/
const testOnMessage = (receivedChunks) => {
    console.log("Printing received bytes")
    const fullMessage = Buffer.concat(Object.values(receivedChunks));
    fullMessage.forEach((dataByte, index) => {console.log("Byte %d: %x", index, dataByte)})
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
testServer = new ServerSocket(54000, testOnMessage);
console.log("this runs");