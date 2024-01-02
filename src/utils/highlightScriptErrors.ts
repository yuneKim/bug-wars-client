type Token = {
  value: string;
  position: number;
};

const actions = ['noop', 'mov', 'rotr', 'rotl', 'att', 'eat'];
const controls = ['ifEnemy', 'ifAlly', 'ifFood', 'ifEmpty', 'ifWall', 'goto'];

export function highlightScriptErrors(content: string) {
  const lines = content.split('\n');
  const labels = lines.filter((line) => line.startsWith(':')).map((line) => line.slice(1));
  return lines.map((line) => highlightErrorsInLine(line, labels)).join('\n');
}

function highlightErrorsInLine(line: string, labels: string[]) {
  const tokens = extractTokens(line);

  if (tokens.length === 0) return line;

  if (actions.includes(tokens[0].value) && tokens.length > 1) {
    line = insertActionError(line, tokens);
  } else if (controls.includes(tokens[0].value)) {
    line = insertControlError(line, tokens, labels);
  } else if (tokens[0].value.includes(':') && tokens.length > 1) {
    line = insertLabelError(line, tokens);
  } else {
    line = insertOtherErrors(line, tokens, labels);
  }

  return line;
}

function insertActionError(line: string, tokens: Token[]) {
  return insertError(
    line,
    { value: line, position: 0 },
    tokens,
    `Expected end of line after action. Found &quot;${line.slice(tokens[1].position)}&quot;.`,
  );
}

function insertControlError(line: string, tokens: Token[], labels: string[]) {
  if (tokens.length === 1) {
    line = insertError(
      line,
      tokens[0],
      tokens,
      `Expected a label name after control. Found end of line.`,
    );
  } else if (tokens.length === 2) {
    if (!validLabelName(tokens[1].value)) {
      line = insertError(
        line,
        tokens[1],
        tokens,
        'A label name must only contain uppercase letters, numbers, and underscores.',
      );
    } else if (!labels.includes(tokens[1].value)) {
      line = insertError(
        line,
        tokens[1],
        tokens,
        `This label does not exist. Did you forget to define it?`,
      );
    }
  } else {
    line = insertError(
      line,
      { value: line, position: 0 },
      tokens,
      `Expected end of line after control and label. Found &quot;${line.slice(
        tokens[2].position,
      )}&quot;.`,
    );
  }

  return line;
}

function insertLabelError(line: string, tokens: Token[]) {
  return insertError(
    line,
    { value: line, position: 0 },
    tokens,
    `Expected end of line after label. Found &quot;${line.slice(tokens[1].position)}&quot;.`,
  );
}

function insertOtherErrors(line: string, tokens: Token[], labels: string[]) {
  for (const token of tokens) {
    if (token.value.startsWith(':')) {
      if (token.position !== 0) {
        line = insertError(
          line,
          token,
          tokens,
          'A label definition must occur at the beginning of a line.',
        );
      } else {
        labels.push(token.value.slice(1));

        if (!validLabelName(token.value)) {
          line = insertError(
            line,
            token,
            tokens,
            'A label name must only contain uppercase letters, numbers, and underscores.',
          );
        }
      }
    } else if (!actions.includes(token.value) && !controls.includes(token.value)) {
      line = insertError(
        line,
        token,
        tokens,
        `This is not a valid action or control.\nValid actions are: ${actions.join(
          ', ',
        )}.\nValid controls are: ${controls.join(', ')}.`,
      );
    }
  }

  return line;
}

function insertError(line: string, token: Token, tokens: Token[], message: string) {
  const strToInsert =
    `<span class="script-editor-underline-error" title="${message}">` + token.value + '</span>';

  for (let i = tokens.indexOf(token) + 1; i < tokens.length || i === -1; i++) {
    tokens[i].position += strToInsert.length - token.value.length;
  }

  return (
    line.slice(0, token.position) + strToInsert + line.slice(token.position + token.value.length)
  );
}

function validLabelName(label: string) {
  return label.slice(1).match(/^[A-Z0-9_]+$/) != null;
}

function extractTokens(line: string) {
  line = removeComment(line);
  const tokens = line.match(/\S+/g);
  // create an array with objects like {value: "mov", position: 0}
  if (tokens == null) return [];
  let prevPosition = -1;
  return tokens.map((value) => {
    const position = line.indexOf(value, prevPosition + 1);
    prevPosition = position;
    return { value, position };
  });
}

function removeComment(line: string) {
  const commentIndex = line.indexOf('//');
  if (commentIndex === -1) return line;
  return line.slice(0, commentIndex);
}
