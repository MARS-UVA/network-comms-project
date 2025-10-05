import socket
import time

def main():
    # Create UDP socket
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    # Destination (localhost:8080)
    server_address = ("127.0.0.1", 8080)

    try:
        while True:
            message = "Hello from UDP publisher!"
            udp_socket.sendto(message.encode("utf-8"), server_address)
            print(f"Sent: {message}")
            time.sleep(1)  # send once per second
    except KeyboardInterrupt:
        print("\nStopped by user.")
    finally:
        udp_socket.close()

if __name__ == "__main__":
    main()
