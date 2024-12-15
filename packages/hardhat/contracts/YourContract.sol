// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CopyrightRegistry {
    // Структура контента
    struct Content {
        address author; // Адрес автора контента
        uint256 timestamp; // Время регистрации контента
        string contentHash; // Хэш контента
    }

    // Сопоставление хэша контента с его данными
    mapping(string => Content) private registeredContent;

    // Событие при регистрации контента
    event ContentRegistered(address indexed author, string contentHash, uint256 timestamp);
    // Событие при передаче прав на контент
    event OwnershipTransferred(string contentHash, address indexed previousOwner, address indexed newOwner);

    /// @notice Регистрация контента
    /// @param _contentHash Хэш контента для регистрации
    function registerContent(string memory _contentHash) public {
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty"); // Проверка, что хэш не пустой
        require(registeredContent[_contentHash].author == address(0), "Content already registered"); // Проверка, что контент еще не зарегистрирован

        // Сохранение данных о контенте
        registeredContent[_contentHash] = Content({
            author: msg.sender,
            timestamp: block.timestamp,
            contentHash: _contentHash
        });

        emit ContentRegistered(msg.sender, _contentHash, block.timestamp); // Эмитирование события
    }

    /// @notice Проверка регистрации контента
    /// @param _contentHash Хэш контента для проверки
    /// @return author Адрес владельца контента
    /// @return timestamp Метка времени регистрации
    function verifyContent(string memory _contentHash) public view returns (address author, uint256 timestamp) {
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty"); // Проверка, что хэш не пустой

        Content memory content = registeredContent[_contentHash]; // Получение данных о контенте
        require(content.author != address(0), "Content not registered"); // Проверка, что контент зарегистрирован

        return (content.author, content.timestamp); // Возвращение данных
    }

    /// @notice Получение владельца контента
    /// @param _contentHash Хэш контента
    /// @return owner Адрес владельца контента
    function getContentOwner(string memory _contentHash) public view returns (address owner) {
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty"); // Проверка, что хэш не пустой

        Content memory content = registeredContent[_contentHash]; // Получение данных о контенте
        require(content.author != address(0), "Content not registered"); // Проверка, что контент зарегистрирован

        return content.author; // Возвращение адреса владельца
    }

    /// @notice Передача владения контентом
    /// @param _contentHash Хэш контента
    /// @param _newOwner Новый владелец контента
    function transferOwnership(string memory _contentHash, address _newOwner) public {
        require(bytes(_contentHash).length > 0, "Content hash cannot be empty"); // Проверка, что хэш не пустой
        require(_newOwner != address(0), "New owner cannot be the zero address"); // Проверка, что новый владелец не является нулевым адресом

        Content storage content = registeredContent[_contentHash]; // Получение данных о контенте
        require(content.author != address(0), "Content not registered"); // Проверка, что контент зарегистрирован
        require(content.author == msg.sender, "Only the current owner can transfer ownership"); // Проверка, что вызывающий является владельцем

        address previousOwner = content.author; // Сохранение текущего владельца
        content.author = _newOwner; // Изменение владельца

        emit OwnershipTransferred(_contentHash, previousOwner, _newOwner); // Эмитирование события передачи прав
    }
}