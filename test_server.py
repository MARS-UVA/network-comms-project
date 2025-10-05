import socket

# Server configuration
UDP_IP = "0.0.0.0"  # Listen on all interfaces
UDP_PORT = 9000     # You can change this port

# Create UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))

print(f"UDP server listening on {UDP_IP}:{UDP_PORT}")

try:
    while True:
        data, addr = sock.recvfrom(1024)  # buffer size is 1024 bytes
        print(f"Received message from {addr}: {data.decode('utf-8')}")
except KeyboardInterrupt:
    print("\nServer shutting down.")
finally:
    sock.close()
