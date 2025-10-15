#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <thread>
#include "fileEdit.hpp"
#include "pengepul.hpp"
#include "httpParser.hpp"
#pragma comment(lib, "ws2_32.lib")
void print_full(const std::string& s) {
    std::cout.write(s.data(), static_cast<std::streamsize>(s.size()));
}
void setupfile(){
    if (fileEdit::checkFileExists("database/data.json")==false)
    {
        fileEdit::editFile("database/data.json","{\n\"data\":[]\n}");
    }
    
}
int main() {
    setupfile();
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        std::cerr << "WSAStartup failed\n";
        return 1;
    }

    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (serverSocket == INVALID_SOCKET) {
        std::cerr << "Socket creation failed. Error: " << WSAGetLastError() << "\n";
        WSACleanup();
        return 1;
    }

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY; // listen di semua IP
    serverAddr.sin_port = htons(8080);

    if (bind(serverSocket, (SOCKADDR*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        std::cerr << "Bind failed. Error: " << WSAGetLastError() << "\n";
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }

    if (listen(serverSocket, SOMAXCONN) == SOCKET_ERROR) {
        std::cerr << "Listen failed. Error: " << WSAGetLastError() << "\n";
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }
    u_long a=1;
    ioctlsocket(serverSocket,FIONBIO,&a);
    std::cout << "HTTP Server running on http://127.0.0.1:8080 \n";
    
    bool clientbaru=false;
    while (true) {
        SOCKET clientSocket;
        
            sockaddr_in clientAddr{};
            int clientSize = sizeof(clientAddr);
            clientSocket = accept(serverSocket, (SOCKADDR*)&clientAddr, &clientSize);
            if (clientSocket == INVALID_SOCKET) {
                int erro=WSAGetLastError();
                if(erro==WSAEWOULDBLOCK){
                    continue;
                }else{
                    std::cerr << "Accept failed. Error: " << WSAGetLastError() << "\n";
                    continue;
                }
            }
        //std::cout<<"asep";
        httpresponse kirim;
        while(!clientbaru){
            char buffer[1024*4];
            int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
            globaltimer++;
            
            if (bytesReceived > 0) {
                buffer[bytesReceived] = '\0';
                std::cout<<"byte:"<<bytesReceived<<"\ndata:\n";
                std::string requestStr(buffer,bytesReceived);
                print_full(requestStr);
                std::cout<<"\n";
                // HTTP response sederhana
                clientbaru=pengepulan(requestStr,kirim);
            }
            if(globaltimer>600){
                globaltimer=0;
                clientbaru=true;
            }
        }
        std::vector<std::string> pengiriman=cacahan(kirim);
        for (size_t i = 0; i < pengiriman.size(); i++)
        {
            /* code */
            std::cout << "Response:\n" << pengiriman[i] << "\n";
            send(clientSocket, pengiriman[i].c_str(), (int)pengiriman[i].length(), 0);
        }
        
        
        closesocket(clientSocket);
        clientbaru=false;
    }

    closesocket(serverSocket);
    WSACleanup();
    return 0;
}
