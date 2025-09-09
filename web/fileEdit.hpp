#pragma once
#include <fstream>
#include <sstream>
#include <string>

namespace fileEdit
{
    void editFile(const std::string& filePath, const std::string& newContent){
        std::ofstream outFile(filePath);
        if (outFile) {
            outFile << newContent;
        }
        
    }
    
    std::string readFile(const std::string& filePath){
        std::ifstream inFile(filePath);
        std::stringstream buffer;
        buffer << inFile.rdbuf();
        return buffer.str();
    }
    bool checkFileExists(const std::string& filePath){
        std::ifstream inFile(filePath);
        return inFile.good();
    }
} // namespace fileEdit
