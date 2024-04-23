var count, numberList, operands, res1, res2, res3, solutions, solution;
function add(num1, num2) {
    return (num1 + num2);
}
function subtract(num1, num2) {
    return (num1 - num2);
}
function multiply(num1, num2) {
    return (num1 * num2);
}
function divide(num1, num2) {
    return (num1 / num2);
}
function power(num1, num2) {
    return num1 ** num2;
}
function operandToString(operand) {
    if ((operand === 0)) {
        return "+";
    }
    if ((operand === 1)) {
        return "-";
    }
    if ((operand === 2)) {
        return "x";
    }
    if ((operand === 3)) {
        return "/";
    }
    if ((operand === 4)){
        return "^";
    }
}

function getSolutions(number){
    solutions = [];
    numberList = number.split("");
    count = 0;
    while ((count < numberList.length)) {
        numberList[count] = Number.parseInt(numberList[count]);
        count = (count + 1);
    }
    operands = [0, 0, 0];
    while ((operands[0] < 5)) {
        if ((operands[0] === 0)) {
            res1 = add(numberList[0], numberList[1]);
        }
        if ((operands[0] === 1)) {
            res1 = subtract(numberList[0], numberList[1]);
        }
        if ((operands[0] === 2)) {
            res1 = multiply(numberList[0], numberList[1]);
        }
        if (((operands[0] === 3) && (numberList[1] !== 0))) {
            res1 = divide(numberList[0], numberList[1]);
        }
        if ((operands[0] === 4)) {
            res1 = power(numberList[0], numberList[1]);
        }
        operands[1] = 0;
        while ((operands[1] < 5)) {
            if ((operands[1] === 0)) {
                res2 = add(res1, numberList[2]);
            }
            if ((operands[1] === 1)) {
                res2 = subtract(res1, numberList[2]);
            }
            if ((operands[1] === 2)) {
                res2 = multiply(res1, numberList[2]);
            }
            if (((operands[1] === 3) && (numberList[2] !== 0))) {
                res2 = divide(res1, numberList[2]);
            }
            if ((operands[1] === 4)) {
                res2 = power(res1, numberList[2]);
            }
            operands[2] = 0;
            while ((operands[2] < 5)) {
                if ((operands[2] === 0)) {
                    res3 = add(res2, numberList[3]);
                }
                if ((operands[2] === 1)) {
                    res3 = subtract(res2, numberList[3]);
                }
                if ((operands[2] === 2)) {
                    res3 = multiply(res2, numberList[3]);
                }
                if (((operands[2] === 3) && (numberList[3] !== 0))) {
                    res3 = divide(res2, numberList[3]);
                }
                if ((operands[2] === 4)) {
                    res3 = power(res2, numberList[3]);
                }
                if ((res3 === 10)) {
                    solution = "(".concat("(", numberList[0], operandToString(operands[0]), numberList[1], ")", operandToString(operands[1]), numberList[2], ")", operandToString(operands[2]), numberList[3]);
                    solutions.push(solution);
                }
                operands[2] = (operands[2] + 1);
            }
            operands[1] = (operands[1] + 1);
        }
        operands[0] = (operands[0] + 1);
    }
    operands = [0, 0, 0];
    while ((operands[0] < 5)) {
        if ((operands[0] === 0)) {
            res1 = add(numberList[0], numberList[1]);
        }
        if ((operands[0] === 1)) {
            res1 = subtract(numberList[0], numberList[1]);
        }
        if ((operands[0] === 2)) {
            res1 = multiply(numberList[0], numberList[1]);
        }
        if (((operands[0] === 3) && (numberList[1] !== 0))) {
            res1 = divide(numberList[0], numberList[1]);
        }
        if ((operands[0] === 4)) {
            res1 = power(numberList[0], numberList[1]);
        }
        operands[2] = 0;
        while ((operands[2] < 5)) {
            if ((operands[2] === 0)) {
                res3 = add(numberList[2], numberList[3]);
            }
            if ((operands[2] === 1)) {
                res3 = subtract(numberList[2], numberList[3]);
            }
            if ((operands[2] === 2)) {
                res3 = multiply(numberList[2], numberList[3]);
            }
            if (((operands[2] === 3) && (numberList[3] !== 0))) {
                res3 = divide(numberList[2], numberList[3]);
            }
            if ((operands[2] === 4)) {
                res3 = power(numberList[2], numberList[3]);
            }
            operands[1] = 0;
            while ((operands[1] < 5)) {
                if ((operands[1] === 0)) {
                    res2 = add(res1, res3);
                }
                if ((operands[1] === 1)) {
                    res2 = subtract(res1, res3);
                }
                if ((operands[1] === 2)) {
                    res2 = multiply(res1, res3);
                }
                if (((operands[1] === 3) && (res3 !== 0))) {
                    res2 = divide(res1, res3);
                }
                if ((operands[1] === 4)) {
                    res2 = power(res1, res3);
                }
                if ((res2 === 10)) {
                    solution = "(".concat(numberList[0], operandToString(operands[0]), numberList[1], ")", operandToString(operands[1]), "(", numberList[2], operandToString(operands[2]), numberList[3], ")");
                    solutions.push(solution);
                }
                operands[1] = (operands[1] + 1);
            }
            operands[2] = (operands[2] + 1);
        }
        operands[0] = (operands[0] + 1);
    }
    operands = [0, 0, 0];
    while ((operands[1] < 5)) {
        if ((operands[1] === 0)) {
            res1 = add(numberList[1], numberList[2]);
        }
        if ((operands[1] === 1)) {
            res1 = subtract(numberList[1], numberList[2]);
        }
        if ((operands[1] === 2)) {
            res1 = multiply(numberList[1], numberList[2]);
        }
        if (((operands[1] === 3) && (numberList[2] !== 0))) {
            res1 = divide(numberList[1], numberList[2]);
        }
        if ((operands[1] === 4)) {
            res1 = power(numberList[1], numberList[2]);
        }
        operands[0] = 0;
        while ((operands[0] < 5)) {
            if ((operands[0] === 0)) {
                res3 = add(numberList[0], res1);
            }
            if ((operands[0] === 1)) {
                res3 = subtract(numberList[0], res1);
            }
            if ((operands[0] === 2)) {
                res3 = multiply(numberList[0], res1);
            }
            if (((operands[0] === 3) && (res2 !== 0))) {
                res3 = divide(numberList[0], res1);
            }
            if ((operands[0] === 4)) {
                res3 = power(numberList[0], res1);
            }
            operands[2] = 0;
            while ((operands[2] < 5)) {
                if ((operands[2] === 0)) {
                    res2 = add(res3, numberList[3]);
                }
                if ((operands[2] === 1)) {
                    res2 = subtract(res3, numberList[3]);
                }
                if ((operands[2] === 2)) {
                    res2 = multiply(res3, numberList[3]);
                }
                if (((operands[2] === 3) && (res3 !== 0))) {
                    res2 = divide(res3, numberList[3]);
                }
                if ((operands[2] === 4)) {
                    res2 = power(res3, numberList[3]);
                }
                if ((res2 === 10)) {
                    solution = String(numberList[0]).concat(operandToString(operands[0]), "(", numberList[1], operandToString(operands[1]), numberList[2], ")", operandToString(operands[2]), numberList[3]);
                    solutions.push(solution);
                }
                operands[2] = (operands[2] + 1);
            }
            operands[0] = (operands[0] + 1);
        }
        operands[1] = (operands[1] + 1);
    }
    operands = [0, 0, 0];
    while ((operands[1] < 5)) {
        if ((operands[1] === 0)) {
            res1 = add(numberList[1], numberList[2]);
        }
        if ((operands[1] === 1)) {
            res1 = subtract(numberList[1], numberList[2]);
        }
        if ((operands[1] === 2)) {
            res1 = multiply(numberList[1], numberList[2]);
        }
        if (((operands[1] === 3) && (numberList[2] !== 0))) {
            res1 = divide(numberList[1], numberList[2]);
        }
        if ((operands[1] === 4)) {
            res1 = power(numberList[1], numberList[2]);
        }
        operands[2] = 0;
        while ((operands[2] < 5)) {
            if ((operands[2] === 0)) {
                res3 = add(res1, numberList[3]);
            }
            if ((operands[2] === 1)) {
                res3 = subtract(res1, numberList[3]);
            }
            if ((operands[2] === 2)) {
                res3 = multiply(res1, numberList[3]);
            }
            if (((operands[2] === 3) && (numberList[3] !== 0))) {
                res3 = divide(res1, numberList[3]);
            }
            if ((operands[2] === 4)) {
                res3 = power(res1, numberList[3]);
            }
            operands[0] = 0;
            while ((operands[0] < 5)) {
                if ((operands[0] === 0)) {
                    res2 = add(numberList[0], res3);
                }
                if ((operands[0] === 1)) {
                    res2 = subtract(numberList[0], res3);
                }
                if ((operands[0] === 2)) {
                    res2 = multiply(numberList[0], res3);
                }
                if (((operands[0] === 3) && (res3 !== 0))) {
                    res2 = divide(numberList[0], res3);
                }
                if ((operands[0] === 4)) {
                    res2 = power(numberList[0], res3);
                }
                if ((res2 === 10)) {
                    solution = String(numberList[0]).concat(operandToString(operands[0]), "(", numberList[1], operandToString(operands[1]), numberList[2], operandToString(operands[2]), numberList[3], ")");
                    solutions.push(solution);
                }
                operands[0] = (operands[0] + 1);
            }
            operands[2] = (operands[2] + 1);
        }
        operands[1] = (operands[1] + 1);
    }
    operands = [0, 0, 0];
    while ((operands[2] < 5)) {
        if ((operands[2] === 0)) {
            res1 = add(numberList[2], numberList[3]);
        }
        if ((operands[2] === 1)) {
            res1 = subtract(numberList[2], numberList[3]);
        }
        if ((operands[2] === 2)) {
            res1 = multiply(numberList[2], numberList[3]);
        }
        if (((operands[2] === 3) && (numberList[3] !== 0))) {
            res1 = divide(numberList[2], numberList[3]);
        }
        if ((operands[2] === 4)) {
            res1 = power(numberList[2], numberList[3]);
        }
        operands[1] = 0;
        while ((operands[1] < 5)) {
            if ((operands[1] === 0)) {
                res2 = add(numberList[1], res1);
            }
            if ((operands[1] === 1)) {
                res2 = subtract(numberList[1], res1);
            }
            if ((operands[1] === 2)) {
                res2 = multiply(numberList[1], res1);
            }
            if (((operands[1] === 3) && (res1 !== 0))) {
                res2 = divide(numberList[1], res1);
            }
            if ((operands[1] === 4)) {
                res2 = power(numberList[1], res1);
            }
            operands[0] = 0;
            while ((operands[0] < 5)) {
                if ((operands[0] === 0)) {
                    res3 = add(numberList[0], res2);
                }
                if ((operands[0] === 1)) {
                    res3 = subtract(numberList[0], res2);
                }
                if ((operands[0] === 2)) {
                    res3 = multiply(numberList[0], res2);
                }
                if (((operands[0] === 3) && (res3 !== 0))) {
                    res3 = divide(numberList[0], res2);
                }
                if ((operands[0] === 4)) {
                    res3 = power(numberList[0], res2);
                }
                if ((res3 === 10)) {
                    solution = String(numberList[0]).concat(operandToString(operands[0]), "(", numberList[1], operandToString(operands[1]), "(", numberList[2], operandToString(operands[2]), numberList[3], ")", ")");
                    solutions.push(solution);
                }
                operands[0] = (operands[0] + 1);
            }
            operands[1] = (operands[1] + 1);
        }
        operands[2] = (operands[2] + 1);
    }
    return solutions;
}

export default getSolutions;