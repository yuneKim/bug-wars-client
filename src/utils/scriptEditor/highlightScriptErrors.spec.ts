import { describe, expect, it } from 'vitest';
import { highlightScriptErrors } from './highlightScriptErrors';

describe('highlightScriptErrors', () => {
  it('should highlight label errors', () => {
    let input = ':BEG!\n';
    let output =
      '<span class="script-editor-underline-error" title="A label name must only contain uppercase letters, numbers, and underscores.">:BEG!</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);

    input = ' :BEG!\n';
    output =
      ' <span class="script-editor-underline-error" title="A label definition must occur at the beginning of a line.">:BEG!</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);

    input = ':BEGIN test\n';
    output =
      '<span class="script-editor-underline-error" title="Expected end of line after label. Found &quot;test&quot;.">:BEGIN test</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);
  });

  it('should highlight action errors', () => {
    const input = 'att test\n';
    const output =
      '<span class="script-editor-underline-error" title="Expected end of line after action. Found &quot;test&quot;.">att test</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);
  });

  it('should highlight control errors', () => {
    let input = 'ifEnemy\n';
    let output =
      '<span class="script-editor-underline-error" title="Expected a label name after control. Found end of line.">ifEnemy</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);

    input = 'ifEnemy test\n';
    output =
      'ifEnemy <span class="script-editor-underline-error" title="A label name must only contain uppercase letters, numbers, and underscores.">test</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);

    input = 'ifEnemy TEST\n';
    output =
      'ifEnemy <span class="script-editor-underline-error" title="This label does not exist. Did you forget to define it?">TEST</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);

    input = 'ifEnemy TEST test\n';
    output =
      '<span class="script-editor-underline-error" title="Expected end of line after control and label. Found &quot;test&quot;.">ifEnemy TEST test</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);
  });

  it('should not highlight control with target declared later in script', () => {
    const input = 'ifEnemy TEST\n:TEST\n';
    const output = 'ifEnemy TEST\n:TEST\n';
    expect(highlightScriptErrors(input)).toBe(output);
  });

  it('should highlight invalid actions or controls', () => {
    const input = 'attack\n';
    const output =
      '<span class="script-editor-underline-error" title="This is not a valid action or control.\nValid actions are: noop, mov, rotr, rotl, att, eat.\nValid controls are: ifEnemy, ifAlly, ifFood, ifEmpty, ifWall, goto.">attack</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);
  });

  it('should ignore comments', () => {
    const input = 'att # :BEGIN test comment\n';
    const output = 'att # :BEGIN test comment\n';
    expect(highlightScriptErrors(input)).toBe(output);
  });

  it('should handle common substrings', () => {
    const input = 'this s\n';
    const output =
      '<span class="script-editor-underline-error" title="This is not a valid action or control.\nValid actions are: noop, mov, rotr, rotl, att, eat.\nValid controls are: ifEnemy, ifAlly, ifFood, ifEmpty, ifWall, goto.">this</span> <span class="script-editor-underline-error" title="This is not a valid action or control.\nValid actions are: noop, mov, rotr, rotl, att, eat.\nValid controls are: ifEnemy, ifAlly, ifFood, ifEmpty, ifWall, goto.">s</span>\n';
    expect(highlightScriptErrors(input)).toBe(output);
  });
});
