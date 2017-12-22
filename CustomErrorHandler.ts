import { ErrorHandler } from '@angular/core';

export class CustomErrorHandler extends ErrorHandler {

    constructor() {
        super();
        this.initTraking();
    }

    static initConfigTraking(args) {
        console.debugmode = (!!args.debugmode ? args.debugmode : false);

        console.onerror = function(err){
            console._log(err);
        }
    }

    public handleError(error): void {
        console.error(error);
    }

    public initTraking() {
        console._log = console.log
        console._info = console.info
        console._warn = console.warn
        console._error = console.error

        console.log = function () { return console._intercept('log', arguments) }
        console.info = function () { return console._intercept('info', arguments) }
        console.warn = function () { return console._intercept('warn', arguments) }
        console.error = function () { return console._intercept('error', arguments) }

        console._intercept = function (type, args) {
            console._collect(type, args)
        }

        console._collect = function (type, args) {
            var time = new Date().toUTCString()
            if (!type) type = 'log'
            if (!args || args.length === 0) return
            if (!!console.debugmode){
                console['_' + type].apply(console, args)
            }
            var stack = false
            try { throw Error('') } catch (error) {
                var stackParts = error.stack.split('\n')
                let stack = []
                for (var i = 0; i < stackParts.length; i++) {
                    if (stackParts[i] === 'Error') {
                        continue
                    }
                    
                    stack.push(stackParts[i].trim())
                }
            }

            console.onerror({ type: type, timestamp: time, arguments: args, stack: stack, browser: navigator.userAgent });
        }

    }

}

interface Console {
    debugmode;
    assert(value: any, message?: string, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
    onerror(errorObject: any): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    time(label: string): void;
    timeEnd(label: string): void;
    trace(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    _intercept(type: any, args: any): void;
    _collect(type: any, args: any): void;
    _log(message?: any, ...optionalParams: any[]): void;
    _error(message?: any, ...optionalParams: any[]): void;
    _info(message?: any, ...optionalParams: any[]): void;
    _warn(message?: any, ...optionalParams: any[]): void;
}

declare var console: Console;
