function isValidHexValue(hexValue) {
    return /^#[0-9A-F]{6}$/i.test(hexValue);
}

module.exports = {
    onInput(input) {
        input.colors = input.colors || ['red', 'green', 'blue'];
    },
    onColorSelected(backgroundColor) {
        this.emit('colorSelected', backgroundColor);
    },
    onHexInput() {
        var hexInput = this.getEl('hexInput').value;

        if (!hexInput.startsWith('#')) {
            hexInput = '#' + hexInput;
        }

        if (!isValidHexValue(hexInput)) {
            hexInput = this.input.colors[0];
        }

        this.emit('colorSelected', hexInput);
    }
};
