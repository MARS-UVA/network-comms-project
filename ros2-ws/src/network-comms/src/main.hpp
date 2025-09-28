struct ThreadInfo{
    char client_message[1024];
    bool flag;
};

int create_server (ThreadInfo* info);

