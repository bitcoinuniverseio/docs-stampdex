import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const chatRequire = createRequire(require.resolve('@scalar/agent-chat'));
const sdkRequire = createRequire(chatRequire.resolve('ai'));
const utils = sdkRequire('@ai-sdk/provider-utils');
const schema = utils.jsonSchema({}, { validate: value => ({ success: true, value }) });
const handlers = [
  ['JSON success', utils.createJsonResponseHandler(schema)],
  ['JSON error', utils.createJsonErrorResponseHandler({ errorSchema: schema, errorToMessage: value => value.message })],
  ['status error', utils.createStatusCodeErrorResponseHandler()],
];
for (const [name, handler] of handlers) {
  test(`${name} rejects oversized declared bodies before reading`, async () => {
    let reads = 0;
    const body = new ReadableStream({ pull(controller) { reads++; controller.enqueue(new TextEncoder().encode('{}')); controller.close(); } }, { highWaterMark: 0 });
    const response = new Response(body, { headers: { 'Content-Length': String(utils.DEFAULT_MAX_DOWNLOAD_SIZE + 1) } });
    await assert.rejects(handler({ response, url: 'https://fixture.invalid', requestBodyValues: {} }), /exceeded maximum size/);
    assert.equal(reads, 0);
  });
}
test('JSON handler preserves a valid response', async () => {
  const result = await handlers[0][1]({ response: new Response('{"ok":true}'), url: 'https://fixture.invalid', requestBodyValues: {} });
  assert.deepEqual(result.value, { ok: true });
});
test('chunked bodies without a size header still respect the size limit', async () => {
  const response = new Response(new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(17)); controller.close(); } }));
  await assert.rejects(utils.readResponseWithSizeLimit({ response, url: 'https://fixture.invalid', maxBytes: 16 }), /exceeded maximum size/);
});
