module.exports = {
  apps : [
    {
      name: "FDS-2000 API",
      script: "./api/index.mjs"
    },
    {
      name: "FDS-2000 NFC Handler",
      script: "./nfc-handler/index.js"
    }
  ]
}
