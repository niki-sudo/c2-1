import { test, expect } from '@playwright/test';

test.describe('Калькулятор - E2E тесты', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator.html');
  });

  test('должен отображать начальное значение 0', async ({ page }) => {
    const display = page.locator('#display');
    await expect(display).toHaveText('0');
  });

  test.describe('Ввод чисел', () => {
    test('должен вводить одно число', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await expect(display).toHaveText('5');
    });

    test('должен вводить несколько цифр', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');
      await expect(display).toHaveText('123');
    });

    test('должен заменять 0 на введенное число', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("7")');
      await expect(display).toHaveText('7');
    });

    test('должен вводить ноль', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("0")');
      await expect(display).toHaveText('0');
    });
  });

  test.describe('Десятичные числа', () => {
    test('должен добавлять десятичную точку', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text(".")');
      await expect(display).toHaveText('5.');
    });

    test('должен вводить десятичное число', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("5")');
      await expect(display).toHaveText('5.5');
    });

    test('не должен добавлять вторую точку в том же числе', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("3")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("5")');
      await page.click('button:has-text(".")');
      await expect(display).toHaveText('3.5');
    });

    test('должен позволить ввести десятичное число после оператора', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("2")');
      await expect(display).toHaveText('5+3.2');
    });
  });

  test.describe('Операции', () => {
    test('должен добавлять оператор сложения', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await expect(display).toHaveText('5+');
    });

    test('должен добавлять оператор вычитания', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("8")');
      await page.click('button:has-text("-")');
      await expect(display).toHaveText('8-');
    });

    test('должен добавлять оператор умножения', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("4")');
      await page.click('button:has-text("×")');
      await expect(display).toHaveText('4×');
    });

    test('должен добавлять оператор деления', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("9")');
      await page.click('button:has-text("/")');
      await expect(display).toHaveText('9/');
    });

    test('должен заменять последний оператор новым', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("-")');
      await expect(display).toHaveText('5-');
    });
  });

  test.describe('Вычисления', () => {
    test('должен выполнять простое сложение', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('8');
    });

    test('должен выполнять вычитание', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("-")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('7');
    });

    test('должен выполнять умножение', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("×")');
      await page.click('button:has-text("4")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('20');
    });

    test('должен выполнять деление', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("/")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('5');
    });

    test('должен вычислять выражения с десятичными числами', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('8');
    });

    test('должен вычислять сложные выражения', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("×")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('20');
    });

    test('должен обрабатывать отрицательные результаты', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("-")');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('-5');
    });
  });

  test.describe('Отрицательные сценарии', () => {
    test('должен показывать ошибку при делении на ноль', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("/")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('Ошибка');
    });

    test('не должен считать деление на 0.5 как ошибку', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("/")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text(".")');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("=")');
      await expect(display).not.toHaveText('Ошибка');
      await expect(display).toHaveText('20');
    });
  });

  test.describe('Управление', () => {
    test('должен очищать дисплей при нажатии C', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("C")');
      await expect(display).toHaveText('0');
    });

    test('должен удалять последний символ при нажатии ⌫', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("⌫")');
      await expect(display).toHaveText('12');
    });

    test('должен удалять оператор при нажатии ⌫', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("⌫")');
      await expect(display).toHaveText('5');
    });

    test('должен устанавливать 0 при удалении последней цифры', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("⌫")');
      await expect(display).toHaveText('0');
    });
  });

  test.describe('Клавиатурный ввод', () => {
    test('должен вводить числа с клавиатуры', async ({ page }) => {
      const display = page.locator('#display');
      await page.keyboard.press('5');
      await page.keyboard.press('3');
      await expect(display).toHaveText('53');
    });

    test('должен вводить операторы с клавиатуры', async ({ page }) => {
      const display = page.locator('#display');
      await page.keyboard.press('5');
      await page.keyboard.press('+');
      await page.keyboard.press('3');
      await expect(display).toHaveText('5+3');
    });

    test('должен вычислять при нажатии Enter', async ({ page }) => {
      const display = page.locator('#display');
      await page.keyboard.press('5');
      await page.keyboard.press('+');
      await page.keyboard.press('3');
      await page.keyboard.press('Enter');
      await expect(display).toHaveText('8');
    });

    test('должен вычислять при нажатии =', async ({ page }) => {
      const display = page.locator('#display');
      await page.keyboard.press('1');
      await page.keyboard.press('0');
      await page.keyboard.press('-');
      await page.keyboard.press('3');
      await page.keyboard.press('=');
      await expect(display).toHaveText('7');
    });

    test('должен очищать при нажатии Escape', async ({ page }) => {
      const display = page.locator('#display');
      await page.keyboard.press('1');
      await page.keyboard.press('2');
      await page.keyboard.press('3');
      await page.keyboard.press('Escape');
      await expect(display).toHaveText('0');
    });

    test('должен очищать при нажатии C', async ({ page }) => {
      const display = page.locator('#display');
      await page.keyboard.press('5');
      await page.keyboard.press('6');
      await page.keyboard.press('c');
      await expect(display).toHaveText('0');
    });

    test('должен удалять последний символ при нажатии Backspace', async ({ page }) => {
      const display = page.locator('#display');
      await page.keyboard.press('1');
      await page.keyboard.press('2');
      await page.keyboard.press('3');
      await page.keyboard.press('Backspace');
      await expect(display).toHaveText('12');
    });

    test('должен вводить десятичную точку с клавиатуры', async ({ page }) => {
      const display = page.locator('#display');
      await page.keyboard.press('5');
      await page.keyboard.press('.');
      await page.keyboard.press('5');
      await expect(display).toHaveText('5.5');
    });
  });

  test.describe('Интеграционные сценарии', () => {
    test('должен выполнять последовательность операций', async ({ page }) => {
      const display = page.locator('#display');
      // 5 + 3 = 8
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('8');
      
      // Продолжаем: 8 * 2 = 16
      await page.click('button:has-text("×")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('16');
    });

    test('должен правильно обрабатывать редактирование выражения', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("-")'); // Заменяем + на -
      await page.click('button:has-text("3")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('2');
    });

    test('должен сбрасывать ввод после вычисления', async ({ page }) => {
      const display = page.locator('#display');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("=")');
      await expect(display).toHaveText('8');
      
      // После вычисления ввод нового числа должен начать новое выражение
      await page.click('button:has-text("2")');
      await expect(display).toHaveText('2');
    });
  });
});

