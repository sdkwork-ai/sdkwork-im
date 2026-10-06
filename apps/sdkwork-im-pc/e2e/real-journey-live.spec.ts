import { expect, test } from '@playwright/test';

// REAL full user journey against the live stack (gateway + web server +
// PostgreSQL). Requires SDKWORK_LIVE_E2E=1 so the mocked suite never runs it:
// the spec registers a fresh account through the credential-entry UI, lands in
// the authenticated shell, and sends a real message through the real chat
// pipeline (no route mocks anywhere).
const STAMP = Date.now().toString(36);
const ACCOUNT = `ui-journey-${STAMP}`;
const EMAIL = `ui-journey-${STAMP}@sdkwork.test`;
const PASSWORD = 'UiJourney-001';

test.skip(!process.env.SDKWORK_LIVE_E2E, 'live-stack journey: set SDKWORK_LIVE_E2E=1 with the gateway + web server running');

test('real register → login → chat send over the live stack', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await page.getByPlaceholder('Choose a username').fill(ACCOUNT);
  await page.getByPlaceholder('you@example.com').fill(EMAIL);
  const passwords = page.locator('input[type="password"]:visible');
  await passwords.nth(0).fill(PASSWORD);
  await passwords.nth(1).fill(PASSWORD);
  // "Register with email" selects the channel tab; "Sign up" submits.
  await page.getByRole('button', { name: 'Register with email' }).click();
  await page.getByRole('button', { name: 'Sign up' }).click();

  // after a successful registration the authenticated shell mounts on the
  // workbench; land on the chat tab deterministically.
  const chatNav = page.getByRole('button', { name: '聊天' });
  await chatNav.waitFor({ state: 'visible', timeout: 60_000 });
  await chatNav.click();

  // Pull the app-persisted session and create a group conversation through the
  // real gateway API, so the UI journey has a conversation to open. The UI
  // register → open → send steps stay fully real.
  const sessionRaw = await page.evaluate(
    (key) => window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key),
    'sdkwork-im-pc:session:v1',
  );
  expect(sessionRaw).toBeTruthy();
  const session = JSON.parse(sessionRaw as string);
  const created = await page.request.post('http://127.0.0.1:18089/im/v3/api/chat/conversations', {
    headers: {
      Authorization: `Bearer ${session.authToken}`,
      'Access-Token': session.accessToken,
      'Content-Type': 'application/json',
    },
    data: {
      groupName: 'Real Browser Journey',
      clientRequestKey: `realui-${STAMP}`,
      conversationType: 'group',
      policyVersion: 'group.policy.v1',
    },
  });
  expect(created.status()).toBe(201);
  const conversationId = (await created.json()).data.item.conversationId;

  await page.reload();
  const chatTab = page.getByRole('button', { name: '聊天' });
  if (await chatTab.count()) await chatTab.first().click();
  const conversationRow = page.getByText('Real Browser Journey').first();
  await conversationRow.waitFor({ state: 'visible', timeout: 30_000 });
  await conversationRow.click();

  const composer = page.locator('.ProseMirror').last();
  await composer.waitFor({ state: 'visible', timeout: 30_000 });
  await composer.click();
  await composer.type('Real browser journey message');
  await composer.press('Enter');

  await expect(page.getByText('Real browser journey message').last()).toBeVisible({
    timeout: 20_000,
  });
});
