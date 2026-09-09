const mineflayer = require('mineflayer');
const http = require('http');

// 1. سيرفر ويب عشان الاستضافة تفضل صاحية
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.write("Bot is running!");
  res.end();
}).listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

// 2. إعدادات السيرفر الخاص بيك
const botOptions = {
  host: 'o_magedSMP.aternos.me', // IP السيرفر
  port: 53981,                    // البورت الخاص بيك
  username: 'AFK_Bot_OMaged',     // اسم البوت داخل اللعبة
  version: false                  // يكتشف إصدار ماين كرافت تلقائيًا
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log(`[+] دخل البوت السيرفر بنجاح باسم: ${bot.username}`);

    // حركة عشوائية كل 5 ثواني لمنع الطرد (AFK Kick)
    setInterval(() => {
      const actions = ['forward', 'back', 'left', 'right', 'jump'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      if (randomAction === 'jump') {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      } else {
        bot.setControlState(randomAction, true);
        setTimeout(() => bot.setControlState(randomAction, false), 1000);
      }

      // تحريك الكاميرا/الرأس عشوائيًا
      const yaw = (Math.random() * Math.PI * 2) - Math.PI;
      const pitch = (Math.random() * Math.PI) - (Math.PI / 2);
      bot.look(yaw, pitch, false);
    }, 5000);
  });

  // إعادة الاتصال تلقائيًا لو السيرفر رستر أو البوت اتفصل
  bot.on('end', () => {
    console.log('[-] اتفصل البوت، جاري محاولة الدخول مجدداً خلال 10 ثواني...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.error('خطأ في البوت:', err);
  });
}

createBot();