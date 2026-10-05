import fs from 'node:fs';

const p = 'services/sdkwork-comms-conversation-service/src/runtime/http.rs';
let raw = fs.readFileSync(p, 'utf8');

raw = raw.split(/(\r?\n)/).map((line) => {
  if (line.includes('.map_err(ApiError::from);')
    && (raw.includes('SignalTypingResult') && (line.includes('signal_typing_from_auth_context') || true))) {
    // narrowed below
  }
  return line;
});

// Replace the two typing handler map_errs precisely by context.
const lines = raw.split(/(\r?\n)/);
for (let i = 0; i < lines.length; i += 1) {
  if (lines[i].includes('.map_err(ApiError::from);')) {
    const prev = lines.slice(Math.max(0, i - 6), i).join('');
    if (prev.includes('signal_typing_from_auth_context') || prev.includes('list_typing_indicators_from_auth_context')) {
      lines[i] = lines[i].replace('.map_err(ApiError::from);', '.map_err(|error| ApiProblem::from(ApiError::from(error)));');
    }
  }
}

fs.writeFileSync(p, lines.join(''));
console.log('map_err converted');
