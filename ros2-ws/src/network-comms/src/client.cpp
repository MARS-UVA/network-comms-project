#include <stdexcept>
#include <cstring>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include "main.hpp"

#define CHUNK_SIZE 1024

void client_send(unsigned char *data, size_t bytes_to_send)
{
    int client_socket_fd = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (client_socket_fd < 0)
        throw std::runtime_error("Error while creating socket");

    struct sockaddr_in control_station_addr;
    control_station_addr.sin_family = AF_INET;
    control_station_addr.sin_port = htons(9000);
    control_station_addr.sin_addr.s_addr = inet_addr("192.168.64.4"); // replace with real IP

    char sendBuffer[CHUNK_SIZE];
    memset(sendBuffer, '\0', sizeof(sendBuffer));
    memcpy(sendBuffer, data, bytes_to_send);

    ssize_t result = sendto(client_socket_fd,
                            sendBuffer,
                            bytes_to_send,
                            0,
                            (struct sockaddr *)&control_station_addr,
                            sizeof(control_station_addr));
    if (result < 0)
        throw std::runtime_error("Unable to send message");

    close(client_socket_fd);
}