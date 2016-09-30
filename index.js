'use strict';

const osaScript = require('node-osascript');

class ActiveWindow {

    /**
     * Get current active window information
     *
     * @param callback
     */
    static getActiveWindow(callback) {

        switch (process.platform) {
            case 'linux':
                ActiveWindow._getActiveWindowLinux(callback);
                break;
            case 'win32':
                ActiveWindow._getActiveWindowWindow(callback);
                break;
            case 'darwin':
                ActiveWindow._getActiveWindowMacOs(callback);
                break;
            default:
                callback(new Error(`Platform "${process.platform}" is not supported`));
        }
    }

    static _getActiveWindowLinux(callback) {

        callback(new Error('TODO'));
    }

    static _getActiveWindowWindow(callback) {

        callback(new Error('TODO'));
    }

    static _getActiveWindowMacOs(callback) {

        osaScript.execute(`
                global frontApp, frontAppName, windowTitle
                set windowTitle to ""
                tell application "System Events"
                    set frontApp to first application process whose frontmost is true
                    set frontAppName to name of frontApp
                    tell process frontAppName
                        tell (1st window whose value of attribute "AXMain" is true)
                            set windowTitle to value of attribute "AXTitle"
                        end tell
                    end tell
                end tell
                return {frontAppName,windowTitle}
                `, (err, result) => {

            if (err) return callback(err);

            let data = {};

            if (result[0]) {

                data.application = result[0];

            } else {

                return callback(new Error(`Application name cat't be resolved`));
            }

            if (result[1]) {

                data.title = result[1];
            }

            callback(null, data);
        });
    }
}

module.exports = ActiveWindow;