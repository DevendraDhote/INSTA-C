const Redis = require('ioredis');

const cacheSystem = new Redis({
    host: "127.0.0.1",  
    port: 6379,
});

cacheSystem.on("connect", () => console.log("Connected to Redis"));
cacheSystem.on("error", (err) => console.error("Redis Connection Error:", err));


module.exports = cacheSystem;