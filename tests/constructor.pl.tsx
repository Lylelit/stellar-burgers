import { expect, test, type Page } from '@playwright/test';

const bun = { name: 'Тестовая булка A', price: 100 };
const filling = { name: 'Тестовая начинка' };
const userName = 'Тестовый пользователь';
const orderNumber = 12345;
const accessToken = 'mock-access-token';
const refreshToken = 'mock-refresh-token';

const openConstructor = async (page: Page): Promise<void> => {
  await page.goto('/');
  const bunList = page
    .getByRole('heading', { name: 'Булки' })
    .locator('xpath=following-sibling::ul[1]');
  await expect(bunList.locator('li')).toHaveCount(2);
};

const openIngredientModal = async (page: Page): Promise<void> => {
  const bunCard = page
    .getByRole('heading', { name: 'Булки' })
    .locator('xpath=following-sibling::ul[1]')
    .locator('li')
    .filter({ hasText: bun.name });

  await bunCard.getByRole('link', { name: bun.name }).click();
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort',
    });
  });

  test('Добавление булки', async ({ page }) => {
    await openConstructor(page);
    const bunCard = page
      .getByRole('heading', { name: 'Булки' })
      .locator('xpath=following-sibling::ul[1]')
      .locator('li')
      .filter({ hasText: bun.name });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-1')).toContainText(
      `${bun.name} (верх)`
    );
    await expect(page.getByTestId('constructor-bun-2')).toContainText(
      `${bun.name} (низ)`
    );
    await expect(page.getByTestId('order-summ')).toContainText(
      String(bun.price * 2)
    );
  });

  test('Открытие модалки ингредиента', async ({ page }) => {
    await openConstructor(page);
    const modal = page.locator('#modals');

    await openIngredientModal(page);

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByRole('heading', { name: bun.name })).toBeVisible();
  });

  test('Закрытие модалки ингредиента', async ({ page }) => {
    await openConstructor(page);
    const modal = page.locator('#modals');

    await openIngredientModal(page);
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toHaveCount(0);
  });

  test('Создание бургера', async ({ page, context }) => {
    await context.addCookies([
      { name: 'accessToken', value: accessToken, url: 'http://localhost:4000' },
    ]);
    await page.addInitScript((token) => {
      localStorage.setItem('refreshToken', token);
    }, refreshToken);
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      notFound: 'abort',
    });
    await page.routeFromHAR('tests/hars/feed.har', {
      url: '**/api/orders/all',
      notFound: 'abort',
    });
    await page.routeFromHAR('tests/hars/orders.har', {
      url: '**/api/orders',
      notFound: 'abort',
    });

    await openConstructor(page);
    await expect(page.getByRole('link', { name: userName })).toBeVisible();

    const bunCard = page
      .getByRole('heading', { name: 'Булки' })
      .locator('xpath=following-sibling::ul[1]')
      .locator('li')
      .filter({ hasText: bun.name });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-bun-1')).toContainText(bun.name);

    const fillingCard = page
      .getByRole('heading', { name: 'Начинки' })
      .locator('xpath=following-sibling::ul[1]')
      .locator('li')
      .filter({ hasText: filling.name });
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      filling.name
    );

    const orderRequestPromise = page.waitForRequest(
      (request) =>
        request.url().endsWith('/api/orders') && request.method() === 'POST'
    );
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    const orderRequest = await orderRequestPromise;
    expect(orderRequest.headers().authorization).toBe(accessToken);
    expect(orderRequest.postDataJSON()).toEqual({
      ingredients: ['test-bun-a', 'test-main-a', 'test-bun-a'],
    });

    const modal = page.locator('#modals');
    await expect(modal.getByTestId('order-number')).toHaveText(
      String(orderNumber)
    );
    await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );
    await expect(page.getByTestId('order-summ').locator('p').first()).toHaveText('0');

    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal.getByTestId('order-number')).toHaveCount(0);
    await expect(modal.getByRole('button', { name: 'Закрыть' })).toHaveCount(0);
  });
});
