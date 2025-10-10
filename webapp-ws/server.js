class ServerSocket {
    // Local Variables
    /**
     * 
     * @param {Number} port 
     * @param {(receivedChunks: object) => void} onMessage 
     */
    constructor (port, onMessage) {
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
            console.log(message);
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