const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const public_key = fs.readFileSync(path.join(__dirname, "../config/keys/public.key"), "utf-8")
const private_key = fs.readFileSync(path.join(__dirname, "../config/keys/private.key"), "utf-8")

const signData = (data) => {
    return crypto.sign("sha256", Buffer.from(data), private_key).toString("base64");
};

const verifySignature = (data, signature) => {
    return crypto.verify("sha256", Buffer.from(data), public_key, Buffer.from(signature, "base64"));
};

module.exports = { signData, verifySignature };