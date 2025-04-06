const crypto = require('crypto');
const fs = require('fs')
const path = require('path');

const {publicKey, privateKey} = crypto.generateKeyPairSync("rsa", {
    modulusLength:2048,
    publicKeyEncoding:{type:'spki', format:'pem'},
    privateKeyEncoding:{type:'pkcs8', format: 'pem'}
})

const keysDir = path.join(__dirname, "keys");
if(!fs.existsSync(keysDir)) fs.mkdirSync(keysDir);

fs.writeFileSync(path.join(keysDir, "public.key"), publicKey)
fs.writeFileSync(path.join(keysDir, "private.key"), privateKey)

console.log("🔑 RSA keys generated successfully");

