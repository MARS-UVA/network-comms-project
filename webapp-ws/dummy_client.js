// import dgram from node.js
const dgram = require('dgram');
const { Buffer } = require('node:buffer');
const PORT = 54000;

// Dummy client socket that sends a message
class ClientSocket {

    constructor() {
        this.client = dgram.createSocket('udp4');

        // Handle socket errors
        this.client.on('error', (err) => {
            console.error('Socket error:', err.message);
            socket.close();
        });

        // // dummy message has sequence number of 0, total packets of 1
        const dummyMessage = Buffer.from([0x0, 0x0, 0x1, 0x0, 'a', 'b', 'c', 'd', 'e', 'f', 'g']);
        this.client.send(dummyMessage, PORT, 'localhost', (err) => {
              this.client.close();
        });
    }
}

clientSocket = new ClientSocket();
console.log("This runs")