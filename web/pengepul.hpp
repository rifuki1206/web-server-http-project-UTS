#pragma once 
#include "httpParser.hpp"
httpRequest tempo;
unsigned int globaltimer;
bool pengepulan(const std::string msg,httpresponse& respons){
    
    if (tempo.size == 0) {
        tempo = httpParser::parser(msg);
    } else {
        tempo.body += msg;
    }

    if (tempo.body.length() < tempo.size) {
        return false; // masih menunggu data
    }

    respons = responsfunc(tempo);
    tempo.bersihkan();
    return true;
}
std::vector<std::string> cacahan(const httpresponse& respo){
    if(respo.header.size()==0){
        return{};
    }
    if(respo.bodysize==0){
        return {respo.header};
    }
    std::vector<std::string> hasil;
    constexpr unsigned int eminem=1024*3;
    if((respo.bodysize+respo.header.size())<eminem){
        return{respo.header+respo.body.substr(0,respo.bodysize)};
    }
    hasil.push_back(respo.header);
    auto pen=respo.getbodybychunk(eminem);
    hasil.insert(hasil.end(),pen.begin(),pen.end());
    return hasil;
}