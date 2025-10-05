struct ThreadInfo{
    char client_message[1024];
    bool flag;
};

int create_server (ThreadInfo* info);

void client_send(unsigned char *data, size_t bytes_to_send);
