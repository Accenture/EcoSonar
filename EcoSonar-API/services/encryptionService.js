import crypto from 'crypto'

// NOTE: encryption Key must be 256 bits (32 characters)
// e.g xfn9P8L9rIpKtWKj68IZ3G865WfdYXNY

const secret_key =  process.env.ENCRYPTION_KEY || 'xfn9P8L9rIpKtWKj68IZ3G865WfdYXNY'
const IV_LENGTH = 16;

export function aesEncrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(secret_key),
        iv
    );

    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function aesDecrypt(text) {
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(secret_key),
        iv
    );

    // By default node uses PKCS padding, but Python uses null-byte
    // padding instead. So calling cipher.setAutoPadding(false); after
    // you create the decipher instance will make it work as expected:
    //decipher.setAutoPadding(false);

    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}