const dgram = require('dgram');

MESSAGE_LENGTH = 100;

class ServerSocket {
    // Local Variables
    /**
     * 
     * @param {Number} port
     */
    constructor (port) {
        this.PORT = port;
        this.receivedChunks = {}
        this.packetCount = 0;
        
        // Create a UDP socket
        this.server = dgram.createSocket('udp4');
    
        // Event: On server start
        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`Server is listening on ${address.address}:${address.port}`);
            // Set buffer size
            this.server.setRecvBufferSize(MESSAGE_LENGTH * 10000);    // This buffer could change size here to be more optimal im sure
        });

        this.receivedChunks = {}
        this.packetCount = 0;

        // Event: On receiving a message
        this.server.on('message', (message, remote) => {
            let header = message.subarray(0,10);
            //Interpret Numbers
            const dataType = (header[1] << 8) | header[0];
            const packetNum = (header[3] << 8) | header[2];
            const totalPackets = (header[5] << 8) | header[4];
            const fragmentSize = (header[7] << 8) | header[6];
            const crc = (header[9] << 8) | header[8];
            //Extract message
            const data = message.subarray(10,fragmentSize);


            console.log(data.toString());
        });

        // Bind the server to the port and IP
        this.server.bind(this.PORT, '0.0.0.0', () => {
            console.log("Socket bound successfully");
        });

        // Event: On error
        this.server.on('error', (err) => {
            console.error(`Server error: ${err.stack}`);
            this.server.close();
        });

        // Event: On close
        this.server.on('close', () => {
            console.log("Server socket closed");
        });
    }
}

socket = new ServerSocket(9000);