import CryptoJS from 'crypto-js';

export function decryptUserId(encryptedUserId) {
    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedUserId, process.env.REACT_APP_ENCRYPTION_KEY);
        const decryptedUserId = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return decryptedUserId.replace(/"/g, "");
    } catch (error) {
        console.log("Decryption error:", error);
        return "";
    }
}
