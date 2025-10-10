function client(ip, data) {
    // Create a UDP socket
    const socket = dgram.createSocket('udp4');
    buffer = Buffer.from(data);

    // Send the message to the server
    socket.send(buffer, PORT, ip, (err) => {
        if (err) {
            console.error('Error while sending message:', err.message);
            socket.close();
            return;
        }
        console.log('Message sent successfully');
        socket.close();
    });
}