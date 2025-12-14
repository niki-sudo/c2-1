/**
 * Класс Calculator для выполнения математических операций
 */
export class Calculator {
    constructor(displayElement = null) {
        this.displayElement = displayElement;
        this.currentInput = '0';
        this.shouldResetDisplay = false;
    }

    /**
     * Обновляет отображение калькулятора
     */
    updateDisplay() {
        if (this.displayElement) {
            // Заменяем * на × для отображения, но оставляем * в currentInput для вычислений
            const displayText = this.currentInput.replace(/\*/g, '×');
            this.displayElement.textContent = displayText;
        }
    }

    /**
     * Получает текущее значение
     * @returns {string} Текущее значение калькулятора
     */
    getCurrentInput() {
        return this.currentInput;
    }

    /**
     * Добавляет число к текущему вводу
     * @param {string} number - Цифра для добавления
     */
    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        
        // Если текущее значение - это результат вычисления (только число)
        // или начинается с "0" (но не "0.")
        if (this.currentInput === '0') {
            this.currentInput = number;
        } else {
            // Проверяем, заканчивается ли строка оператором
            const lastChar = this.currentInput[this.currentInput.length - 1];
            if (['+', '-', '*', '/', '×'].includes(lastChar)) {
                // После оператора начинаем новое число
                this.currentInput += number;
            } else {
                // Продолжаем текущее число
                this.currentInput += number;
            }
        }
        this.updateDisplay();
    }

    /**
     * Добавляет десятичную точку
     */
    appendDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0';
            this.shouldResetDisplay = false;
        }
        
        // Находим последнее число в выражении (после последнего оператора)
        const lastOperatorIndex = Math.max(
            this.currentInput.lastIndexOf('+'),
            this.currentInput.lastIndexOf('-'),
            this.currentInput.lastIndexOf('*'),
            this.currentInput.lastIndexOf('/'),
            this.currentInput.lastIndexOf('×')
        );
        
        // Получаем последнее число (часть после последнего оператора или всё выражение)
        const lastNumber = lastOperatorIndex >= 0 
            ? this.currentInput.substring(lastOperatorIndex + 1)
            : this.currentInput;
        
        // Проверяем, есть ли точка только в последнем числе
        if (!lastNumber.includes('.')) {
            this.currentInput += '.';
            this.updateDisplay();
        }
    }

    /**
     * Добавляет оператор к текущему вводу
     * @param {string} operator - Оператор (+, -, *, /)
     */
    appendOperator(operator) {
        if (this.shouldResetDisplay) {
            this.shouldResetDisplay = false;
        }
        
        const lastChar = this.currentInput[this.currentInput.length - 1];
        if (['+', '-', '*', '/'].includes(lastChar)) {
            this.currentInput = this.currentInput.slice(0, -1) + operator;
        } else {
            this.currentInput += operator;
        }
        this.updateDisplay();
    }

    /**
     * Выполняет вычисление текущего выражения
     * @returns {string} Результат вычисления или 'Ошибка'
     */
    calculate() {
        try {
            // Заменяем × на * для вычисления
            let expression = this.currentInput.replace(/×/g, '*');
            
            // Проверяем на деление на ноль
            if (expression.includes('/0') && !expression.includes('/0.')) {
                this.currentInput = 'Ошибка';
                this.updateDisplay();
                this.shouldResetDisplay = true;
                return 'Ошибка';
            }
            
            const result = Function('"use strict"; return (' + expression + ')')();
            
            if (isNaN(result) || !isFinite(result)) {
                this.currentInput = 'Ошибка';
            } else {
                // Форматируем результат: максимум 5 знаков после десятичной точки
                if (Number.isInteger(result)) {
                    // Целые числа отображаем без точки
                    this.currentInput = result.toString();
                } else {
                    // Для десятичных чисел используем toFixed(5) и убираем лишние нули в конце
                    const fixedResult = result.toFixed(5);
                    // Убираем лишние нули после точки
                    this.currentInput = parseFloat(fixedResult).toString();
                }
            }
            
            this.updateDisplay();
            this.shouldResetDisplay = true;
            return this.currentInput;
        } catch (error) {
            this.currentInput = 'Ошибка';
            this.updateDisplay();
            this.shouldResetDisplay = true;
            return 'Ошибка';
        }
    }

    /**
     * Очищает дисплей калькулятора
     */
    clearDisplay() {
        this.currentInput = '0';
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    /**
     * Удаляет последний символ из текущего ввода
     */
    deleteLast() {
        if (this.shouldResetDisplay) {
            this.clearDisplay();
            return;
        }
        
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
}

