<h1 align="center">
  <br>
  <a href="https://github.com/nullicorn/beemill"><img src="./src/assets/icon.png" alt="beemill" width="180" style= "margin-bottom: 1rem"></a>
  <br>
  beemill
  <br>
  <br>
</h1>

<h4 align="center">A secure and easy-to-use encryption app.</h4>
<p align="center">
    <a href="https://github.com/nullicorn/beemill/releases/latest">
        <img src="https://img.shields.io/badge/Download-1.0-blue.svg"
            alt="Download latest release" style= "margin-bottom: 0.5rem" height="25px">
    </a>
</p>

**beemill** is a cross-platform cryptography app that makes encrypting and decrypting files
of any size super easy while still upholding strong security.

### User Guide

* Encrypting a file:
  * Drag and drop any file or folder
  * Enter a secure password
  * A `[your_file].beemill` file will be created for you in the directory
    of your original file
* Decrypting a file:
  * Drag and drop your `[your_file].beemill` file
  * Enter the password you used to encrypt the file
  * The decrypted file will be created for you in the same directory

### Features

* Strong encryption
* Easy to use
* No BS
* Fast
* Large file friendly

### Details

* Crypto algorithm: `aes-256-gcm`
* Encryption flow: file1 -> tar -> zip -> aes -> file2
* Decryption flow: file2 -> aes -> zip -> tar -> file1
* Uses node stream to pipe large files

### Run

`npm run start`

### Test

`npm run test`

### Build

`npm run make`

### Libraries

* [tar](https://www.npmjs.com/package/tar)
* [electron](https://www.electronjs.org/)
* [react](https://reactjs.org/)
* [chakra-ui](https://chakra-ui.com/)
