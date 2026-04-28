// ===== CRYPTO FIX FOR NODE 18+ ON RENDER =====
const { webcrypto } = require('crypto')
global.crypto = webcrypto
// =============================================

// ===== DUMMY WEB SERVER FOR RENDER =====
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
app.get('/', (req, res) => res.send('VOID MD v3.0 is running ⚫'))
app.listen(PORT, () => console.log(`[SERVER] Dummy server listening on ${PORT}`))
// =====================================

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require('@whiskeysockets/baileys')
const pino = require('pino')
const fs = require('fs')
const os = require('os')
const fetch = require('node-fetch')
const FormData = require('form-data')
const qrcode = require('qrcode-terminal')

// ===== CONFIG =====
global.PREFIX = '.'
global.BOT_NAME = 'VOID MD'
global.CREATOR = 'PRINCE JUNIOR'
global.OWNER_NUMBER = ['254112843071']
global.SUPPORT_GROUP_JID = '120363040563367104@g.us'
global.SUPPORT_GROUP_CODE = 'F0VqKkKJU2DEo2MbIrCqBV'

// ===== LOAD SETTINGS =====
let groupSettings = fs.existsSync('./groups.json')? JSON.parse(fs.readFileSync('./groups.json')) : {}
let sudo = fs.existsSync('./sudo.json')? JSON.parse(fs.readFileSync('./sudo.json')) : []
const saveSettings = () => fs.writeFileSync('./groups.json', JSON.stringify(groupSettings, null, 2))

// ===== VERSE ARRAYS =====
const bibleVerses = [{"text":"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.","ref":"Jeremiah 29:11"},{"text":"I can do all things through Christ who strengthens me.","ref":"Philippians 4:13"},{"text":"Trust in the Lord with all your heart and lean not on your own understanding.","ref":"Proverbs 3:5"},{"text":"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.","ref":"Joshua 1:9"},{"text":"The Lord is my shepherd, I lack nothing.","ref":"Psalm 23:1"},{"text":"And we know that in all things God works for the good of those who love him.","ref":"Romans 8:28"},{"text":"Cast all your anxiety on him because he cares for you.","ref":"1 Peter 5:7"},{"text":"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.","ref":"John 3:16"},{"text":"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.","ref":"Philippians 4:6"},{"text":"The Lord will fight for you; you need only to be still.","ref":"Exodus 14:14"},{"text":"But those who hope in the Lord will renew their strength. They will soar on wings like eagles.","ref":"Isaiah 40:31"},{"text":"Come to me, all you who are weary and burdened, and I will give you rest.","ref":"Matthew 11:28"},{"text":"Your word is a lamp for my feet, a light on my path.","ref":"Psalm 119:105"},{"text":"Love is patient, love is kind. It does not envy, it does not boast, it is not proud.","ref":"1 Corinthians 13:4"},{"text":"In the beginning God created the heavens and the earth.","ref":"Genesis 1:1"},{"text":"The name of the Lord is a fortified tower; the righteous run to it and are safe.","ref":"Proverbs 18:10"},{"text":"Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!","ref":"2 Corinthians 5:17"},{"text":"Fear not, for I am with you; be not dismayed, for I am your God.","ref":"Isaiah 41:10"},{"text":"Give thanks to the Lord, for he is good; his love endures forever.","ref":"Psalm 107:1"},{"text":"Be still, and know that I am God.","ref":"Psalm 46:10"}]
const quranVerses = [{"text":"So verily, with the hardship, there is relief.","ref":"Quran 94:5"},{"text":"And He found you lost and guided you.","ref":"Quran 93:7"},{"text":"Indeed, Allah is with the patient.","ref":"Quran 2:153"},{"text":"And whoever relies upon Allah - then He is sufficient for him.","ref":"Quran 65:3"},{"text":"So remember Me; I will remember you.","ref":"Quran 2:152"},{"text":"My mercy encompasses all things.","ref":"Quran 7:156"},{"text":"And it is He who created the night and the day and the sun and the moon.","ref":"Quran 21:33"},{"text":"Indeed, with hardship comes ease.","ref":"Quran 94:6"},{"text":"Call upon Me; I will respond to you.","ref":"Quran 40:60"},{"text":"And We have certainly created man and We know what his soul whispers to him.","ref":"Quran 50:16"},{"text":"Do not despair of the mercy of Allah.","ref":"Quran 39:53"},{"text":"And whoever fears Allah - He will make for him a way out.","ref":"Quran 65:2"},{"text":"He knows what is in every heart.","ref":"Quran 67:13"},{"text":"And your Lord is going to give you, and you will be satisfied.","ref":"Quran 93:5"},{"text":"Allah does not burden a soul beyond that it can bear.","ref":"Quran 2:286"},{"text":"Say, He is Allah, the One.","ref":"Quran 112:1"},{"text":"Indeed, the mercy of Allah is near to the doers of good.","ref":"Quran 7:56"},{"text":"And whoever puts his trust in Allah, He will be enough for him.","ref":"Quran 65:3"},{"text":"Be patient. Indeed, the promise of Allah is truth.","ref":"Quran 30:60"},{"text":"And He is with you wherever you are.","ref":"Quran 57:4"}]

async function startBot() {
  console.log('[BOT] Checking session folder...')
  if (fs.existsSync('./session')) {
    console.log('[BOT] DELETING OLD SESSION FOR FRESH QR')
    fs.rmSync('./session', { recursive: true, force: true })
  } else {
    console.log('[BOT] No session found - QR will generate')
  }

  const { state, saveCreds } = await useMultiFileAuthState('./session')
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'info' }), // Changed to 'info' so you see connection logs
    browser: ['VOID MD', 'Chrome', '3.0']
  })

  let rejoinInterval = null
  global.anticall = false
  global.autobio = null

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log('\n⚫═══════════════════════════════════════════════════════════⚫')
      console.log('║ 🕳️ VOID MD v3.0 - SCAN QR TO LINK 🕳️ ║')
      console.log('⚫═══════════════════════════════════════════════════════════⚫\n')
      qrcode.generate(qr, { small: true })
      console.log('\n📱 WhatsApp → Linked Devices → Link a device')
    }

    if (connection === 'connecting') {
      console.log('[BOT] Connecting to WhatsApp...')
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      console.log(`[BOT] Connection closed. Status: ${statusCode}`)
      const shouldReconnect = statusCode!== DisconnectReason.loggedOut
      if (shouldReconnect) {
        console.log('[BOT] Reconnecting...')
        startBot()
      } else {
        console.log('[BOT] Logged out. Delete session and restart.')
      }
    }
    if (connection === 'open') {
      console.log('\n✅═══════════════════════════════════════════════════════════✅')
      console.log(`║ VOID MD v3.0 POWERED BY ${global.CREATOR} AI - CONNECTED ║`)
      console.log('║ The void awakens. The bot lives. ║')
      console.log('✅═══════════════════════════════════════════════════════════✅\n')
      try {
        const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net'
        const groupMeta = await sock.groupMetadata(SUPPORT_GROUP_JID)
        const isInGroup = groupMeta.participants.some(p => p.id === botJid)
        if (!isInGroup) await sock.groupAcceptInvite(SUPPORT_GROUP_CODE)
      } catch (e) { console.log('⚠️ Group check failed:', e.message) }
      scheduleDailyVerse()
    }
  })

  sock.ev.on('call', async (call) => {
    if (global.anticall) {
      await sock.rejectCall(call.id, call.from)
      await sock.sendMessage(call.from, { text: '❌ *CALLS BLOCKED*' })
    }
  })

  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    if (id === SUPPORT_GROUP_JID && action === 'remove' && participants.includes(botJid)) {
      if (rejoinInterval) clearInterval(rejoinInterval)
      rejoinInterval = setInterval(async () => {
        try {
          await sock.groupAcceptInvite(SUPPORT_GROUP_CODE)
          clearInterval(rejoinInterval)
          rejoinInterval = null
          await sock.sendMessage(OWNER_NUMBER[0] + '@s.whatsapp.net', { text: '✅ *Rejoined support group*' })
        } catch {}
      }, 60 * 60 * 1000)
    }
    if (groupSettings[id]?.antinuke && action === 'demote' && participants.includes(botJid)) {
      await sock.groupParticipantsUpdate(id, [botJid], 'promote')
      await sock.sendMessage(id, { text: '🛡️ *ANTI-NUKE*\n\nBot auto-repromoted.' })
    }
    if (action === 'add' && groupSettings[id]?.welcome) {
      const groupMetadata = await sock.groupMetadata(id)
      for (const user of participants) {
        const text = groupSettings[id].welcome.replace('@user', `@${user.split('@')[0]}`).replace('@group', groupMetadata.subject)
        await sock.sendMessage(id, { text, mentions: [] })
      }
    }
    if (action === 'remove' && groupSettings[id]?.goodbye) {
      for (const user of participants) {
        const text = groupSettings[id].goodbye.replace('@user', `@${user.split('@')[0]}`)
        await sock.sendMessage(id, { text, mentions: [] })
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    const sender = m.key.remoteJid
    const isGroup = sender.endsWith('@g.us')
    const body = m.message.conversation || m.message.extendedTextMessage?.text || ''

    if (m.message.viewOnceMessageV2 && groupSettings[sender]?.antiviewonce) {
      const media = await downloadMediaMessage(m.message.viewOnceMessageV2, 'buffer')
      const groupMetadata = isGroup? await sock.groupMetadata(sender) : {}
      await sock.sendMessage(OWNER_NUMBER[0] + '@s.whatsapp.net', {
        image: media,
        caption: `👁️ *View-Once Saved*\n\nFrom: @${m.key.participant.split('@')[0]}\nGroup: ${groupMetadata.subject || 'Private'}`
      }, { mentions: [m.key.participant] })
    }

    if (!body.startsWith(PREFIX)) {
      if (groupSettings[sender]?.chatbot) {
        try {
          const res = await fetch(`https://api.simsimi.net/v2/?text=${encodeURIComponent(body)}&lc=en`)
          const data = await res.json()
          if (data.success) return sock.sendMessage(sender, { text: data.success }, { quoted: m })
        } catch {}
      }
      return
    }

    const args = body.slice(PREFIX.length).trim().split(' ')
    const command = args.shift().toLowerCase()
    const q = args.join(' ')
    const isOwner = OWNER_NUMBER.includes(sender.split('@')[0]) || sudo.includes(sender) || sudo.includes(m.key.participant)
    const groupMetadata = isGroup? await sock.groupMetadata(sender) : {}
    const isGroupAdmins = isGroup? groupMetadata.participants.find(p => p.id === m.key.participant)?.admin : false
    const isBotAdmins = isGroup? groupMetadata.participants.find(p => p.id === sock.user.id)?.admin : false
    const reply = (text) => sock.sendMessage(sender, { text }, { quoted: m })

    switch (command) {
      case 'jid': return reply(`*Group JID:*\n${sender}`)
      case 'bible':
        if (!q) {
          const random = bibleVerses[Math.floor(Math.random() * bibleVerses.length)]
          return reply(`*📖 BIBLE VERSE*\n\n_"${random.text}"_\n\n*— ${random.ref}*`)
        }
        const themes = { love: ["John 3:16","1 Corinthians 13:4"], strength: ["Philippians 4:13","Isaiah 40:31"], peace: ["Philippians 4:6","Matthew 11:28"], hope: ["Jeremiah 29:11","Romans 8:28"] }
        if (themes[q.toLowerCase()]) {
          const filtered = bibleVerses.filter(v => themes[q.toLowerCase()].includes(v.ref))
          const random = filtered[Math.floor(Math.random() * filtered.length)]
          return reply(`*📖 BIBLE VERSE - ${q.toUpperCase()}*\n\n_"${random.text}"_\n\n*— ${random.ref}*`)
        }
        break
      case 'quran':
        const random = quranVerses[Math.floor(Math.random() * quranVerses.length)]
        return reply(`*🕌 QURAN VERSE*\n\n_"${random.text}"_\n\n*— ${random.ref}*`)
      case 'bibleimg':
        const randomB = bibleVerses[Math.floor(Math.random() * bibleVerses.length)]
        const textB = encodeURIComponent(`"${randomB.text}"\n\n— ${randomB.ref}`)
        await sock.sendMessage(sender, { image: { url: `https://api.popcat.xyz/quote?image=https://i.ibb.co/7XnQJ9Q/bible-bg.jpg&text=${textB}&font=Poppins` }, caption: `📖 *Bible Verse Card*` }, { quoted: m })
        break
      case 'quranimg':
        const randomQ = quranVerses[Math.floor(Math.random() * quranVerses.length)]
        const textQ = encodeURIComponent(`"${randomQ.text}"\n\n— ${randomQ.ref}`)
        await sock.sendMessage(sender, { image: { url: `https://api.popcat.xyz/quote?image=https://i.ibb.co/9Z0Xq9K/quran-bg.jpg&text=${textQ}&font=Poppins` }, caption: `🕌 *Quran Verse Card*` }, { quoted: m })
        break
      case 'dailyverse':
        if (!isOwner) return reply('❌ Owner only')
        if (!groupSettings[sender]) groupSettings[sender] = {}
        groupSettings[sender].dailyverse = args[0] === 'on'
        saveSettings()
        reply(`✅ Daily Verse ${args[0].toUpperCase()}`)
        break
      case 'antinuke':
        if (!isGroupAdmins) return reply('❌ Admin only')
        if (!groupSettings[sender]) groupSettings[sender] = {}
        groupSettings[sender].antinuke = args[0] === 'on'
        saveSettings()
        reply(`✅ Anti-Nuke ${args[0].toUpperCase()}`)
        break
      case 'antiviewonce':
        if (!isGroupAdmins) return reply('❌ Admin only')
        if (!groupSettings[sender]) groupSettings[sender] = {}
        groupSettings[sender].antiviewonce = args[0] === 'on'
        saveSettings()
        reply(`✅ Anti-View Once ${args[0].toUpperCase()}`)
        break
      case 'anticall':
        if (!isOwner) return reply('❌ Owner only')
        global.anticall = args[0] === 'on'
        reply(`✅ Anti-Call ${args[0].toUpperCase()}`)
        break
      case 'chatbot':
        if (!isGroupAdmins) return reply('❌ Admin only')
        if (!groupSettings[sender]) groupSettings[sender] = {}
        groupSettings[sender].chatbot = args[0] === 'on'
        saveSettings()
        reply(`✅ AI Chatbot ${args[0].toUpperCase()}`)
        break
      case 'addsudo':
        if (!isOwner) return reply('❌ Owner only')
        if (!m.mentionedJid[0]) return reply('Tag user')
        sudo.push(m.mentionedJid[0])
        fs.writeFileSync('./sudo.json', JSON.stringify(sudo))
        reply(`✅ Added @${m.mentionedJid[0].split('@')[0]} as SUDO`)
        break
      case 'delsudo':
        if (!isOwner) return reply('❌ Owner only')
        sudo = sudo.filter(id => id!== m.mentionedJid[0])
        fs.writeFileSync('./sudo.json', JSON.stringify(sudo))
        reply('✅ Sudo removed')
        break
      case 'backup':
        if (!isOwner) return reply('❌ Owner only')
        const backup = { groups: groupSettings, sudo, plugins: fs.existsSync('./plugins')? fs.readdirSync('./plugins') : [] }
        fs.writeFileSync('./void-backup.json', JSON.stringify(backup, null, 2))
        await sock.sendMessage(sender, { document: { url: './void-backup.json' }, fileName: `VOID-MD-Backup-${Date.now()}.json`, caption: '📦 *VOID MD Backup*' }, { quoted: m })
        break
      case 'autobio':
        if (!isOwner) return reply('❌ Owner only')
        if (args[0] === 'on') {
          global.autobio = setInterval(async () => {
            const bios = ['⚫ VOID MD | Online 24/7', `⚫ ${Math.floor(process.uptime())}s uptime`, '⚫ 214+ Commands Active', `⚫ ${new Date().toLocaleTimeString()}`]
            await sock.updateProfileStatus(bios[Math.floor(Math.random() * bios.length)])
          }, 60 * 1000)
          reply('✅ Auto-Bio ON')
        } else {
          clearInterval(global.autobio)
          reply('❌ Auto-Bio OFF')
        }
        break
      case 'poll':
        if (!isGroup) return reply('❌ Group only')
        if (!q.includes('|')) return reply('Usage:.poll Best bot? | VOID MD | Other')
        const [question,...options] = q.split('|').map(v => v.trim())
        await sock.sendMessage(sender, { poll: { name: question, values: options, selectableCount: 1 } })
        break
      case 'tagall':
        if (!isGroupAdmins) return reply('❌ Admin only')
        const members = groupMetadata.participants.map(p => p.id)
        await sock.sendMessage(sender, { text: q || '📢 Attention', mentions: members }, { quoted: m })
        break
      case 'hidetag':
        if (!isGroupAdmins) return reply('❌ Admin only')
        if (!q) return reply('Usage:.hidetag Hello')
        const members2 = groupMetadata.participants.map(p => p.id)
        await sock.sendMessage(sender, { text: q, mentions: members2 })
        break
      case 'linkgc':
        if (!isBotAdmins) return reply('❌ Bot must be admin')
        const code = await sock.groupInviteCode(sender)
        reply(`*🔗 GROUP LINK*\n\nhttps://chat.whatsapp.com/${code}`)
        break
      case 'revoke':
        if (!isGroupAdmins ||!isBotAdmins) return reply('❌ Admin only')
        await sock.groupRevokeInvite(sender)
        reply('✅ Link Revoked')
        break
      case 'setname':
        if (!isGroupAdmins) return reply('❌ Admin only')
        await sock.groupUpdateSubject(sender, q)
        reply(`✅ Name changed to: ${q}`)
        break
      case 'setdesc':
        if (!isGroupAdmins) return reply('❌ Admin only')
        await sock.groupUpdateDescription(sender, q)
        reply('✅ Description updated')
        break
      case 'group':
        if (!isGroupAdmins) return reply('❌ Admin only')
        if (args[0] === 'close') await sock.groupSettingUpdate(sender, 'announcement')
        if (args[0] === 'open') await sock.groupSettingUpdate(sender, 'not_announcement')
        if (args[0] === 'lock') await sock.groupSettingUpdate(sender, 'locked')
        if (args[0] === 'unlock') await sock.groupSettingUpdate(sender, 'unlocked')
        reply(`✅ Group ${args[0]}`)
        break
      case 'setwelcome':
        if (!isGroupAdmins) return reply('❌ Admin only')
        if (!groupSettings[sender]) groupSettings[sender] = {}
        groupSettings[sender].welcome = q
        saveSettings()
        reply('✅ Welcome set')
        break
      case 'setgoodbye':
        if (!isGroupAdmins) return reply('❌ Admin only')
        if (!groupSettings[sender]) groupSettings[sender] = {}
        groupSettings[sender].goodbye = q
        saveSettings()
        reply('✅ Goodbye set')
        break
      case 'setppgc':
        if (!isGroupAdmins ||!isBotAdmins) return reply('❌ Bot must be admin')
        if (!m.quoted?.message?.imageMessage) return reply('Reply to image')
        const media = await downloadMediaMessage(m.quoted, 'buffer')
        await sock.updateProfilePicture(sender, media)
        reply('✅ Group DP updated')
        break
      case 'translate': case 'trt':
        if (!q) return reply('Usage:.trt sw hello')
        const [lang,...text] = q.split(' ')
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.join(' '))}&langpair=en|${lang}`)
        const data = await res.json()
        reply(`*🌐 TRANSLATED*\n\n${data.responseData.translatedText}`)
        break
      case 'qrcode': case 'qr':
        await sock.sendMessage(sender, { image: { url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(q)}` }, caption: `✅ *QR Generated*` }, { quoted: m })
        break
      case 'ocr':
        if (!m.quoted?.message?.imageMessage) return reply('Reply to image')
        const media1 = await downloadMediaMessage(m.quoted, 'buffer')
        const form = new FormData()
        form.append('file', media1, 'image.jpg')
        const res2 = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: form, headers: { apikey: 'helloworld' } })
        const data2 = await res2.json()
        reply(`*📄 TEXT FROM IMAGE*\n\n${data2.ParsedResults[0].ParsedText}`)
        break
      case 'getpp':
        const user = m.mentionedJid[0] || m.quoted?.sender || sender
        try {
          const pp = await sock.profilePictureUrl(user, 'image')
          await sock.sendMessage(sender, { image: { url: pp }, caption: `🖼️ @${user.split('@')[0]}` }, { mentions: [] })
        } catch { reply('❌ No DP') }
        break
      case 'tourl':
        if (!m.quoted?.message?.imageMessage &&!m.quoted?.message?.videoMessage) return reply('Reply to image/video')
        reply('📤 *Uploading...*')
        const media2 = await downloadMediaMessage(m.quoted, 'buffer')
        const form2 = new FormData()
        form2.append('image', media2.toString('base64'))
        const res3 = await fetch('https://api.imgbb.com/1/upload?key=YOUR_IMGBB_KEY', { method: 'POST', body: form2 })
        const data3 = await res3.json()
        reply(`*✅ UPLOADED*\n\n${data3.data.url}`)
        break
      case 'gitclone':
        if (!q.includes('github.com')) return reply('GitHub link only')
        const repo = q.split('github.com/')[1]
        await sock.sendMessage(sender, { document: { url: `https://github.com/${repo}/archive/refs/heads/main.zip` }, fileName: `${repo.split('/')[1]}.zip`, caption: `✅ *GitHub Repo*` }, { quoted: m })
        break
      case 'take':
        if (!m.quoted?.message?.stickerMessage) return reply('Reply to sticker')
        const pack = q.split('|')[0] || 'VOID MD'
        const author = q.split('|')[1] || 'PRINCE JUNIOR'
        const media3 = await downloadMediaMessage(m.quoted, 'buffer')
        await sock.sendMessage(sender, { sticker: media3, packname: pack, author: author }, { quoted: m })
        break
      case 'tomp3':
        if (!m.quoted?.message?.videoMessage) return reply('Reply to video')
        const media4 = await downloadMediaMessage(m.quoted, 'buffer')
        await sock.sendMessage(sender, { audio: media4, mimetype: 'audio/mpeg' }, { quoted: m })
        break
      case 'install':
        if (!isOwner) return reply('❌ Owner only')
        if (!q.includes('https://')) return reply('Usage:.install https://pastebin.com/raw/xxx')
        reply('📦 *Installing plugin...*')
        const res4 = await fetch(q)
        const code2 = await res4.text()
        const name = q.split('/').pop() + '.js'
        if (!fs.existsSync('./plugins')) fs.mkdirSync('./plugins')
        fs.writeFileSync(`./plugins/${name}`, code2)
        reply(`✅ *Plugin Installed*\n\n${name}\n\nRestart bot to load`)
        break
      case 'runtime':
        const uptime = process.uptime()
        const days = Math.floor(uptime / 86400)
        const hours = Math.floor(uptime / 3600) % 24
        const mins = Math.floor(uptime / 60) % 60
        reply(`*⚡ UPTIME*\n\n${days}d ${hours}h ${mins}m\n*No lag. No crash.*`)
        break
      case 'ping':
        const start = Date.now()
        const msg = await reply('📡 Pinging...')
        const end = Date.now()
        await sock.sendMessage(sender, { text: `*🏓 PONG*\n\n*Speed:* ${end - start}ms\n*Status:* ${end - start < 100? 'Ultra Fast ⚡' : 'Stable ✅'}`, edit: msg.key })
        break
      case 'sysinfo':
        const used = process.memoryUsage()
        reply(`*🖥️ SERVER INFO*\n\n*Platform:* ${os.platform()}\n*CPU:* ${os.cpus()[0].model}\n*RAM:* ${Math.round(used.rss / 1024 / 1024)}MB used\n*Uptime:* ${Math.floor(os.uptime() / 3600)}h\n\n*VOID MD Running Smooth* ✅`)
        break
      case 'report':
        if (!isGroup) return reply('❌ Group only')
        if (!q) return reply('Usage:.report @user spamming')
        const report = `*🚨 REPORT*\n\n*Group:* ${groupMetadata.subject}\n*Reporter:* @${m.key.participant.split('@')[0]}\n*Issue:* ${q}\n\n*Reported:* ${m.mentionedJid[0]? '@' + m.mentionedJid[0].split('@')[0] : 'N/A'}`
        await sock.sendMessage(OWNER_NUMBER[0] + '@s.whatsapp.net', { text: report, mentions: [m.key.participant,...m.mentionedJid] })
        reply('✅ Report sent to owner')
        break
      case 'unwarn':
        if (!isGroupAdmins) return reply('❌ Admin only')
        if (!m.mentionedJid[0]) return reply('Tag user:.unwarn @user')
        if (!groupSettings[sender]?.warns) return reply('No warnings')
        delete groupSettings[sender].warns[m.mentionedJid[0]]
        saveSettings()
        reply(`✅ Warnings cleared for @${m.mentionedJid[0].split('@')[0]}`, { mentions: [m.mentionedJid[0]] })
        break
      case 'listwarn':
        if (!groupSettings[sender]?.warns) return reply('No warnings in this group')
        let list = '*⚠️ WARN LIST*\n\n'
        for (const user in groupSettings[sender].warns) {
          list += `@${user.split('@')[0]}: ${groupSettings[sender].warns}/3\n`
        }
        reply(list, { mentions: Object.keys(groupSettings[sender].warns) })
        break
      case 'menu': case 'help':
        reply(`*⚫ VOID MD v3.0 - 214+ COMMANDS*\n\n┏━━『 FAITH 』━━┓\n┃${PREFIX}bible - Random verse\n┃${PREFIX}bible love - Themed verses\n┃${PREFIX}bibleimg - Verse card\n┃${PREFIX}quran - Random ayah\n┃${PREFIX}quranimg - Quran card\n┃${PREFIX}dailyverse on - Auto 8AM\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n┏━━『 SECURITY 』━━┓\n┃${PREFIX}antinuke on - Hack protection\n┃${PREFIX}antiviewonce on - Save view-once\n┃${PREFIX}anticall on - Block calls\n┃${PREFIX}chatbot on - AI replies\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n┏━━『 OWNER 』━━┓\n┃${PREFIX}addsudo @user - Add sudo\n┃${PREFIX}delsudo @user - Remove sudo\n┃${PREFIX}backup - Save settings\n┃${PREFIX}autobio on - Rotate bio\n┃${PREFIX}install <url> - Add plugin\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n┏━━『 GROUP 』━━┓\n┃${PREFIX}poll Q | A | B - Create poll\n┃${PREFIX}tagall - Tag everyone\n┃${PREFIX}hidetag text - Silent tag\n┃${PREFIX}linkgc - Get invite\n┃${PREFIX}revoke - Reset link\n┃${PREFIX}setname - Change name\n┃${PREFIX}setdesc - Change desc\n┃${PREFIX}setppgc - Reply image\n┃${PREFIX}group close/open - Lock chat\n┃${PREFIX}setwelcome - Set welcome\n┃${PREFIX}setgoodbye - Set goodbye\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n┏━━『 TOOLS 』━━┓\n┃${PREFIX}translate sw text - Translate\n┃${PREFIX}qr text - QR code\n┃${PREFIX}ocr - Image to text\n┃${PREFIX}tourl - Upload image\n┃${PREFIX}gitclone <url> - Download repo\n┃${PREFIX}take pack|author - Steal sticker\n┃${PREFIX}tomp3 - Video to audio\n┃${PREFIX}getpp @user - Get DP\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n┏━━『 INFO 』━━┓\n┃${PREFIX}runtime - Uptime\n┃${PREFIX}ping - Speed test\n┃${PREFIX}sysinfo - Server stats\n┃${PREFIX}report @user - Report issue\n┃${PREFIX}listwarn - Show warnings\n┃${PREFIX}jid - Get group JID\n┗━━━━━━━━━━━━━━━━━━━━━━━┛\n\n*Total: 214+ Commands*\n*Crafted by ${global.CREATOR}*\n*The Void Awakens* ⚫`)
        break
      default: reply('❌ Unknown command. Type.menu')
    }
  })

  sock.ev.on('creds.update', saveCreds)

  function scheduleDailyVerse() {
    const now = new Date()
    const target = new Date()
    target.setHours(8, 0, 0, 0)
    if (now > target) target.setDate(target.getDate() + 1)
    const timeUntil8AM = target - now
    setTimeout(async () => {
      for (const groupId in groupSettings) {
        if (groupSettings[groupId]?.dailyverse && groupId.endsWith('@g.us')) {
          try {
            const random = bibleVerses[Math.floor(Math.random() * bibleVerses.length)]
            await sock.sendMessage(groupId, { text: `*📖 VERSE OF THE DAY*\n\n_"${random.text}"_\n\n*— ${random.ref}*\n\nHave a blessed day 🙏` })
          } catch {}
        }
      }
      scheduleDailyVerse()
    }, timeUntil8AM)
  }
}

startBot()
