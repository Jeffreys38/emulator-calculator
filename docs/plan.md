# Plan for the project

**Due**: 23:59 8/9/2024

| Time           | Todos                                                                | Description                                                                                   |
|----------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| 6/9/2024       | CommonCalculator                                                     | Preventive for bad case.                                                                      |
| 7/9/2024       | 1. AdvancedCalculator <br/>2.Design other template <br/>3.Route Base | Implement some advanced expressions.                                                          |
| 9:00 8/9/2024  | Implement fraction, sqrt, d/dx, change currency, etc.               | Implement basic operator for other templates.                                                 |
| 19:00 8/9/2024 | Commit & Push code                                                   | Submit your essay: [Elearning](https://elearning.tdmu.edu.vn/mod/assign/view.php?id=846251)   |

## Solve
Mỗi biểu thức đặc biệt phức tạp như:
1. Fraction
2. Derivative
3. Square

**Step 1:** Cần phải xây dựng cấu trúc dữ liệu, trước hết cần tạo 1 Interface buộc các biểu thức phải tuân theo:

**IExpressionMethods.ts**
```typescript
interface IExpression<T> {
    isValid(): boolean;
    insertExp(cursorIndex: number, exp: string): string;
    isPointingTo(cursorIndex: number): T | null;
}
```

**Expression.ts**
```typescript
type Expression = {
    index: number,
    positionInLength: number
}
```

**ExpressionBox.ts**
```typescript
type ExpressionBox = {
    latexString: string,
    nextCursor: Expression,
    prevCursor: Expression,
}
```

**Fraction.ts**
```typescript
class Fraction implements IExpression<Fraction> {
    private _numerator: ExpressionBox;
    private _denominator: ExpressionBox;
    
    isValid(): boolean {
        
    };
    
    insertExp(cursorIndex: number, exp: string): string {
        
    };
    
    isPointingTo(cursorIndex: number): T | null {
        
    };
}
```

**Step 2:** Cần 1 mảng lưu trữ vị trí có thể di chuyển của con trỏ, chẳng hạn như:
```typescript
let cursorIndex = [1, 72, 134, 2033, 3499];
```

Mỗi lần thêm 1 phần tử nào đó, sẽ kiểm tra xem vị trí con trỏ đang đặt ở vị trí nào sau đó insert thêm



**Step :** Cần tổng hợp 1 mảng object về chuỗi latex duy nhất (không bao gồm derivative)
### References
https://github.com/webyonet/react-native-mathjax-html-to-svg
https://mathjs.org/docs/reference/functions/derivative.html
https://www.overleaf.com/learn/latex/Mathematical_expressions
