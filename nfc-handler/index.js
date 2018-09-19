const { NFC } = require('nfc-pcsc')
const io = require('socket.io')(3022)
const CONFIG = require('./config')
const nfc = new NFC()

const KEY_A = CONFIG.KEY_A
const KEY_B = CONFIG.KEY_B
const KEY_TYPE_A = 0x60
const KEY_TYPE_B = 0x61

const SECTORS           = 40
const SECTOR_THRESHOLD  = 32 // When sector size changes
const SECTOR_SIZE_SMALL = 4  // Number of blocks / sector (small sector)
const SECTOR_SIZE_LARGE = 16 // Number of blocks / sector (large sector)
const BLOCK_SIZE        = 16

let sector_info = (sector_number) => {
  // Small
  if (sector_number < SECTOR_THRESHOLD) {
    return {
      first_block: sector_number * SECTOR_SIZE_SMALL,
      sector_size: SECTOR_SIZE_SMALL
    }

  // Large
  } else {
    let prev_small_blocks = SECTOR_THRESHOLD
    let prev_large_blocks = sector_number - SECTOR_THRESHOLD
    return {
      first_block: prev_small_blocks * SECTOR_SIZE_SMALL + prev_large_blocks * SECTOR_SIZE_LARGE,
      sector_size: SECTOR_SIZE_LARGE
    }
  }
}

let auth_sector = async (reader, first_block) => {
  let authenticated = false

  // Try AUTH with key A
  try {
    authenticated = await reader.authenticate(first_block, KEY_TYPE_A, KEY_A)
    console.log('A')
  } catch (err) {
    console.error(`[BLOCK ${first_block}]: failed to authenticate with key A`)
  }

  // Try AUTH with key B
  if (authenticated == false) {
    try {
      authenticated = await reader.authenticate(first_block, KEY_TYPE_A, KEY_B)
      console.log('B')
    } catch (err) {
      console.error(`[BLOCK ${first_block}]: failed to authenticate with key B`)
    }
  }

  return authenticated
}

let read_sector = async (reader, first_block, sector_size, include_trailer = true) => {
  let bytes = include_trailer ? BLOCK_SIZE * sector_size : BLOCK_SIZE * (sector_size - 1)
  return await reader.read(first_block, bytes, BLOCK_SIZE)
}

nfc.on('reader', async reader => {
  reader.autoProcessing = false

  console.log(`${reader.reader.name}  device attached`);

  reader.on('card', async card => {

    console.log(`${reader.reader.name}  card inserted`)//, card);

    // Read card number
    let sector = 15
    try {
      let si = sector_info(sector)
      let auth = await auth_sector(reader, si.first_block)
      if (!auth)
        return

      let data = await read_sector(reader, si.first_block, si.sector_size, true)

      // Card number position:
      // Sector: 15
      // Block:  2
      // First 10 bytes
      const card_number = data.slice(15, 25) // 16, 26

      console.log(card_number)
      console.log(card_number.toString())
      io.emit('broadcast', { cid: card_number.toString() });

    } catch (e) {
      console.error(`Error reading sector: ${sector}:`, e)
    }

  })

  reader.on('card.off', card => {
    console.log(`${reader.reader.name}  card removed`)//, card)
  })

  reader.on('error', err => {
    console.log(`${reader.reader.name}  an error occurred`, err)
  })

  reader.on('end', () => {
    console.log(`${reader.reader.name}  device removed`)
  })
})

nfc.on('error', err => {
  console.log('an error occurred', err)
})
