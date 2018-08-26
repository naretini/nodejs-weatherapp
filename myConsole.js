var colors = require('colors/safe');



class MyConsole {
    static info(str){
        console.log(colors.gray(str));
    }

    static warn (str){
        console.log(colors.yellow(str));
    }

    static err(str) {
        console.log(colors.red(str));
    }

    static success(str) {
        console.log(colors.green(str));
    }
}


module.exports = MyConsole;