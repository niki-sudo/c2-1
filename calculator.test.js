import { describe, it, expect, beforeEach } from 'vitest';
import { Calculator } from './calculator.js';

describe('Calculator', () => {
    let calculator;
    let mockDisplayElement;

    beforeEach(() => {
        // Создаем мок элемента дисплея
        mockDisplayElement = {
            textContent: ''
        };
        calculator = new Calculator(mockDisplayElement);
    });

    describe('Конструктор', () => {
        it('должен инициализировать калькулятор с начальным значением "0"', () => {
            expect(calculator.getCurrentInput()).toBe('0');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен работать без элемента дисплея', () => {
            const calc = new Calculator();
            expect(calc.getCurrentInput()).toBe('0');
        });
    });

    describe('appendNumber', () => {
        it('должен заменить "0" на введенное число', () => {
            calculator.appendNumber('5');
            expect(calculator.getCurrentInput()).toBe('5');
        });

        it('должен добавить число к существующему значению', () => {
            calculator.appendNumber('1');
            calculator.appendNumber('2');
            calculator.appendNumber('3');
            expect(calculator.getCurrentInput()).toBe('123');
        });

        it('должен сбросить значение после вычисления при вводе нового числа', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.appendNumber('2');
            expect(calculator.getCurrentInput()).toBe('2');
        });

        it('должен обновить дисплей при добавлении числа', () => {
            calculator.appendNumber('7');
            expect(mockDisplayElement.textContent).toBe('7');
        });

        it('должен обрабатывать множественные нули', () => {
            calculator.appendNumber('0');
            calculator.appendNumber('0');
            calculator.appendNumber('5');
            expect(calculator.getCurrentInput()).toBe('5');
        });
    });

    describe('appendDecimal', () => {
        it('должен добавить десятичную точку к числу', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('5.');
        });

        it('должен добавить точку к нулю', () => {
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('0.');
        });

        it('не должен добавлять вторую точку, если она уже есть', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            calculator.appendNumber('5');
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('5.5');
        });

        it('должен сбросить значение после вычисления при добавлении точки', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('0.');
        });

        it('должен обновить дисплей при добавлении точки', () => {
            calculator.appendNumber('3');
            calculator.appendDecimal();
            expect(mockDisplayElement.textContent).toBe('3.');
        });

        it('должен позволить добавить точку к второму числу в выражении', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.appendDecimal();
            calculator.appendNumber('2');
            expect(calculator.getCurrentInput()).toBe('5.5+3.2');
        });

        it('должен позволить добавить точку после оператора', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendDecimal();
            calculator.appendNumber('5');
            expect(calculator.getCurrentInput()).toBe('5+.5');
        });

        it('не должен добавлять вторую точку в том же числе', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            calculator.appendNumber('5');
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('5.5');
        });

        it('должен обрабатывать точку в начале числа после оператора', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('5+.');
        });
    });

    describe('appendOperator', () => {
        it('должен добавить оператор к числу', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            expect(calculator.getCurrentInput()).toBe('5+');
        });

        it('должен заменить последний оператор новым', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendOperator('-');
            expect(calculator.getCurrentInput()).toBe('5-');
        });

        it('должен обрабатывать все операторы (+, -, *, /)', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            expect(calculator.getCurrentInput()).toBe('5+');
            
            calculator.appendOperator('-');
            expect(calculator.getCurrentInput()).toBe('5-');
            
            calculator.appendOperator('*');
            expect(calculator.getCurrentInput()).toBe('5*');
            
            calculator.appendOperator('/');
            expect(calculator.getCurrentInput()).toBe('5/');
        });

        it('должен сбросить флаг shouldResetDisplay при добавлении оператора', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.appendOperator('+');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен обновить дисплей при добавлении оператора', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            expect(mockDisplayElement.textContent).toBe('5+');
        });
    });

    describe('calculate', () => {
        describe('Положительные сценарии', () => {
            it('должен выполнить простое сложение', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('8');
                expect(calculator.getCurrentInput()).toBe('8');
            });

            it('должен выполнить вычитание', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('-');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('7');
            });

            it('должен выполнить умножение', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('4');
                const result = calculator.calculate();
                expect(result).toBe('20');
            });

            it('должен выполнить деление', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('5');
            });

            it('должен обрабатывать десятичные числа', () => {
                calculator.appendNumber('5');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('2');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(result).toBe('8');
            });

            it('должен обрабатывать сложные выражения', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('+');
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('20');
            });

            it('должен обрабатывать отрицательные результаты', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('-');
                calculator.appendNumber('10');
                const result = calculator.calculate();
                expect(result).toBe('-5');
            });

            it('должен обрабатывать деление с десятичным результатом', () => {
                calculator.appendNumber('1');
                calculator.appendOperator('/');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(parseFloat(result)).toBeCloseTo(0.3333333333333333, 10);
            });

            it('должен правильно вычислять выражения с несколькими десятичными числами', () => {
                calculator.appendNumber('5');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('2');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(result).toBe('8');
            });

            it('должен правильно вычислять умножение десятичных чисел', () => {
                calculator.appendNumber('2');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('4');
                const result = calculator.calculate();
                expect(result).toBe('10');
            });

            it('должен правильно вычислять деление десятичных чисел', () => {
                calculator.appendNumber('10');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                calculator.appendOperator('/');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('5.25');
            });

            it('должен убирать лишние нули в результате', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(result).toBe('10');
            });

            it('должен установить shouldResetDisplay в true после вычисления', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                calculator.calculate();
                expect(calculator.shouldResetDisplay).toBe(true);
            });
        });

        describe('Отрицательные сценарии', () => {
            it('должен вернуть "Ошибка" при делении на ноль', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
                expect(calculator.getCurrentInput()).toBe('Ошибка');
            });

            it('должен вернуть "Ошибка" при делении на ноль в сложном выражении', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('не должен считать деление на 0.0 как ошибку', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(parseFloat(result)).toBeCloseTo(20, 5);
            });

            it('должен вернуть "Ошибка" при невалидном выражении', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendOperator('+');
                calculator.appendOperator('+');
                // Попытка вычислить невалидное выражение
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен обрабатывать пустое выражение', () => {
                calculator.appendOperator('+');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен обрабатывать только оператор без чисел', () => {
                calculator.appendOperator('+');
                calculator.appendOperator('-');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен установить shouldResetDisplay в true даже при ошибке', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                calculator.calculate();
                expect(calculator.shouldResetDisplay).toBe(true);
            });
        });
    });

    describe('clearDisplay', () => {
        it('должен сбросить значение на "0"', () => {
            calculator.appendNumber('123');
            calculator.clearDisplay();
            expect(calculator.getCurrentInput()).toBe('0');
        });

        it('должен сбросить флаг shouldResetDisplay', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.clearDisplay();
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен обновить дисплей при очистке', () => {
            calculator.appendNumber('123');
            calculator.clearDisplay();
            expect(mockDisplayElement.textContent).toBe('0');
        });

        it('должен работать после вычисления', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.clearDisplay();
            expect(calculator.getCurrentInput()).toBe('0');
            expect(calculator.shouldResetDisplay).toBe(false);
        });
    });

    describe('deleteLast', () => {
        it('должен удалить последний символ', () => {
            calculator.appendNumber('123');
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('12');
        });

        it('должен установить "0" если остался один символ', () => {
            calculator.appendNumber('5');
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('0');
        });

        it('должен очистить дисплей если shouldResetDisplay = true', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('0');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен удалить оператор', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('5');
        });

        it('должен удалить десятичную точку', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('5');
        });

        it('должен обновить дисплей при удалении', () => {
            calculator.appendNumber('123');
            calculator.deleteLast();
            expect(mockDisplayElement.textContent).toBe('12');
        });

        it('должен обрабатывать удаление из начального "0"', () => {
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('0');
        });
    });

    describe('updateDisplay', () => {
        it('должен обновить textContent элемента дисплея', () => {
            calculator.currentInput = '123';
            calculator.updateDisplay();
            expect(mockDisplayElement.textContent).toBe('123');
        });

        it('должен работать без элемента дисплея', () => {
            const calc = new Calculator();
            calc.currentInput = '456';
            expect(() => calc.updateDisplay()).not.toThrow();
        });
    });

    describe('Интеграционные тесты', () => {
        it('должен выполнить полную последовательность операций', () => {
            calculator.appendNumber('1');
            calculator.appendNumber('0');
            calculator.appendOperator('+');
            calculator.appendNumber('5');
            calculator.appendOperator('*');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('20');
            
            calculator.clearDisplay();
            expect(calculator.getCurrentInput()).toBe('0');
        });

        it('должен обрабатывать цепочку вычислений', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendNumber('3');
            calculator.calculate();
            
            calculator.appendOperator('*');
            calculator.appendNumber('2');
            const result = calculator.calculate();
            expect(result).toBe('16');
        });

        it('должен обрабатывать редактирование выражения', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendOperator('-');
            calculator.appendNumber('3');
            calculator.deleteLast();
            calculator.appendNumber('7');
            const result = calculator.calculate();
            expect(result).toBe('-2');
        });
    });
});

