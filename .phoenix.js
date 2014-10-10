// Keith's [Phoenix](https://github.com/Keithbsmiley/phoenix) config
var modifiers = ["ctrl", "shift"];
var padding = 2;

function windowToGrid(win, x, y, width, height) {
    var screen = win.screen().frameIncludingDockAndMenu();

    win.setFrame({
        x: Math.round(x * screen.width) + padding + screen.x,
        y: Math.round(y * screen.height) + padding + screen.y,
        width: Math.round(width * screen.width) - (2 * padding),
        height: Math.round(height * screen.height) - (2 * padding)
    });
}

function toGrid(x, y, width, height) {
    windowToGrid(Window.focusedWindow(), x, y, width, height);
}

Window.fullScreen = function() {
    toGrid(0, 0, 1, 1);
}

Window.leftHalf = function() {
    toGrid(0, 0, 0.5, 1);
}

Window.rightHalf = function() {
    toGrid(0.5, 0, 0.5, 1);
}

Window.bottomHalf = function() {
    toGrid(0, 0.5, 1, 0.5);
}

Window.topHalf = function() {
    toGrid(0, 0, 1, 0.5);
}

Window.topLeft = function() {
    toGrid(0, 0, 0.5, 0.5);
}

Window.bottomLeft = function() {
    toGrid(0, 0.5, 0.5, 0.5);
}

Window.topRight = function() {
    toGrid(0.5, 0, 0.5, 0.5);
}

Window.bottomRight = function() {
    toGrid(0.5, 0.5, 0.5, 0.5);
}

function center() {
    var win = Window.focusedWindow();
    var sframe = win.screen().frameWithoutDockOrMenu();
    var frame = win.frame();
    frame.x = sframe.x + ((sframe.width / 2) - (frame.width / 2));
    frame.y = sframe.y + ((sframe.height / 2) - (frame.height / 2));
    win.setFrame(frame);
}

function throwWindow() {
    var win = Window.focusedWindow();
    var frame = win.frame();
    var nextScreen = win.screen().nextScreen();
    var screenFrame = nextScreen.frameWithoutDockOrMenu();
    win.setFrame({
        x: screenFrame.x,
        y: screenFrame.y,
        width: frame.width,
        height: frame.height
    });
}

App.allWithTitle = function( title ) {
    return _(this.runningApps()).filter( function( app ) {
        if (app.title() === title) {
            return true;
        }
    });
};


App.focusOrStart = function ( title ) {
    var apps = App.allWithTitle( title );
    if (_.isEmpty(apps)) {
        api.alert(rageOfDongers + " Starting " + title);
        api.launch(title)
        return;
    }

    var windows = _.chain(apps)
    .map(function(x) { return x.allWindows(); })
    .flatten()
    .value();

    activeWindows = _(windows).reject(function(win) { return win.isWindowMinimized();});
    if (_.isEmpty(activeWindows)) {
        api.runCommand('/bin/bash', ['-c', 'open -a Terminal $HOME']);
        return;
    }

    activeWindows.forEach(function(win) {
        win.focusWindow();
    });
};

api.bind('a', modifiers, throwWindow);

api.bind('f', modifiers, Window.fullScreen);
api.bind('h', modifiers, Window.leftHalf);
api.bind('l', modifiers, Window.rightHalf);

api.bind('j', modifiers, Window.bottomHalf);
api.bind('k', modifiers, Window.topHalf);

//api.bind('n', modifiers, Window.topLeft);
//api.bind('m', modifiers, Window.bottomLeft);
//api.bind(',', modifiers, Window.topRight);
//api.bind('.', modifiers, Window.bottomRight);

api.bind('space', modifiers, function () { App.focusOrStart('Terminal'); });
