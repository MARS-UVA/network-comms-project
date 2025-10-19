const dgram = require('dgram');
const { buffer } = require('stream/consumers');

const PORT = 10000

function client(ip, data, dataType) {
    // Create a UDP socket
    const socket = dgram.createSocket('udp4');

    let header = new Array(5);
    header[0]= dataType;
    header[1]= 1;
    header[2]=1;
    header[3]=data.length;
    header[4]=1;

    headerBuffer= Buffer.from(header);
    dataBuffer = Buffer.from(data);

    sendBuffer = Buffer.concat([headerBuffer, dataBuffer]);

    // Send the message to the server
    socket.send(sendBuffer, PORT, ip, (err) => {
        if (err) {
            console.error('Error while sending message:', err.message);
            socket.close();
            return;
        }
        console.log('Message sent successfully');
        socket.close();
    });
}

function sleep (ms){
    return new Promise (resolve => setTimeout (resolve,ms));
}

async function main (){ 
    while(true) {
        client("127.0.0.1", "Hello", 1);
        await sleep (10000);
    }
}

main ();