// editor.js

const blessed = require('blessed');
const fs = require('fs');
const { exec } = require('child_process');

const screen = blessed.screen({ smartCSR: true });
screen.title = 'bubblePrintValue.js';

const editor = blessed.textarea({
  parent: screen,
  input: true,
  keys: true,
  mouse: true,
  vi: true,
  scrollbar: {
    bg: 'yellow'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      type: 'line',
      fg: 'cyan'
    }
  }
});

const lineNumbers = blessed.box({
  parent: screen,
  width: 4,
  top: 0,
  left: 0,
  content: '',
  tags: true,
  style: {
    fg: 'green',
    bg: 'black'
  }
});

// Function to update line numbers
function updateLineNumbers(content) {
  const lines = content.split('\n').length;
  lineNumbers.setContent(Array.from({length: lines}, (_, i) => i + 1).join('\n'));
  lineNumbers.style.height = lines > screen.height ? `${screen.height - 1}` : `${lines}`;
  lineNumbers.setHeight(lines);
  lineNumbers.setContent(Array.from({length: lines}, (_, i) => i + 1).join('\n'));
}

// Load a test markdown file
fs.readFile('test.md', 'utf8', (err, data) => {
  if (err) throw err;
  editor.setValue(data);
  updateLineNumbers(data);
});

// Handle editor input
editor.on('change', function() {
  const content = editor.getValue();
  updateLineNumbers(content);
});

// Render the screen
screen.append(lineNumbers);
screen.append(editor);
editor.focus();

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();
