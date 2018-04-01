const CONTROL = 17;

function keyDownFunc(e) {
    switch (e.keyCode) {
        case CONTROL:
            if(matrix !== undefined) matrix.pressControl = true;
            break;
        default: break;
    }
}

function keyOnFunc(e) {
    switch (e.keyCode) {
        case CONTROL:
            if(matrix !== undefined) matrix.pressControl = false;
            break;
        default: break;
    }
}
