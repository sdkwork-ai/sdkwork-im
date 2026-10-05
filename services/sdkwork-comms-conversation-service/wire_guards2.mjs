import fs from 'node:fs';

const p = 'services/sdkwork-comms-conversation-service/src/runtime/http.rs';
let raw = fs.readFileSync(p, 'utf8');

raw = raw.split(/(\r?\n)/).map((line) => {
  if (line.includes('return finish_api_json(&ctx, Err(SdkWorkApiProblem::from(error)));')
    || line.includes('return finish_api_json(&ctx, Err::<SignalTypingResult, _>(error));')
    || line.includes('return finish_api_json(&ctx, Err::<TypingIndicatorList, _>(error));')) {
    return line.replace(/finish_api_json\(&ctx, Err[^)]*\)\);/u, 'finish_api_json(&ctx, Err(ApiProblem::from(error)));');
  }
  return line;
});

fs.writeFileSync(p, raw);
console.log('guard error conversion fixed');
