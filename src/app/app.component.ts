import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'calculator-app';
  calValue: number = 0;
  funcT: any = 'CASIO';
  operation: string = '0';
  onClickValue(val: string, type: any) {
    if (type == 'number') {
      if (this.operation == '0' || this.operation == 'Error!') {
        this.operation = val;
      } else {
        this.operation = this.operation + val;
      }
    }
  }

  buttonClickResolve() {
    try {
      const expresion = this.operation;
      const rpn = this.infixToRPN(expresion);
      const resultado = this.evaluarExpresionRPN(rpn);
      this.operation = resultado.toString();
    } catch {
      /* istanbul ignore next */
      this.operation = 'Error!';
    }
  }
  clearScreen() {
    this.operation = '0';
  }
  infixToRPN(expresion: string): (number | string)[] {
    function obtenerPrecedencia(operador: string): number {
      switch (operador) {
        case '+':
        case '-':
          return 1;
        case '*':
        case '/':
          return 2;
        default:
          return 0;
      }
    }

    const tokens = expresion.match(/\d+|\+|\-|\*|\//g);
    const output: (number | string)[] = [];
    const operadores: string[] = [];

    tokens?.forEach((token) => {
      if (/\d+/.test(token)) {
        output.push(parseFloat(token));
      } else if (
        token === '+' ||
        token === '-' ||
        token === '*' ||
        token === '/'
      ) {
        while (
          operadores.length > 0 &&
          obtenerPrecedencia(operadores[operadores.length - 1]) >=
            obtenerPrecedencia(token)
        ) {
          output.push(operadores.pop()!);
        }
        operadores.push(token);
      }
    });
    while (operadores.length > 0) {
      output.push(operadores.pop()!);
    }
    return output;
  }

  evaluarExpresionRPN(expresionRPN: (number | string)[]): number {
    const operandos: number[] = [];

    expresionRPN.forEach((token) => {
      if (typeof token === 'number') {
        operandos.push(token);
      } else {
        const segundoOperando = operandos.pop()!;
        const primerOperando = operandos.pop()!;

        switch (token) {
          case '+':
            operandos.push(primerOperando + segundoOperando);
            break;
          case '-':
            operandos.push(primerOperando - segundoOperando);
            break;
          case '*':
            operandos.push(primerOperando * segundoOperando);
            break;
          case '/':
            operandos.push(primerOperando / segundoOperando);
            break;
          default:
            throw new Error('Operador no válido: ' + token);
        }
      }
    });

    return operandos.pop()!;
  }
}
