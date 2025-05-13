# 쏙쏙 들어오는 함수형 코딩 6장: 변경 가능한 데이터 구조를 가진 언어에서 불변성 유지하기

### 핵심 개념 요약

함수형 프로그래밍에서 **불변성(Immutability)**은 근본적인 원칙. 6장에서는 JavaScript와 같은 변경 가능한(mutable) 데이터 구조를 기본으로 하는 언어에서 어떻게 불변성을 효과적으로 구현할 수 있는지 다룹니다.

- **원본 데이터 변경 금지**: 항상 새로운 복사본을 생성하여 반환
- **얕은 복사와 깊은 복사 구분**: 상황에 맞게 적절한 복사 방법 선택
- **구조적 공유**: 변경되지 않은 부분은 메모리 공유하여 효율성 높이기
- **카피-온-라이트 패턴**: 변경이 필요할 때만 복사본 생성
- **참조 동일성 활용**: 객체 참조 비교를 통해 변경 여부 빠르게 감지

불변성은 함수형 프로그래밍의 핵심 원칙으로, <br>
코드의 예측 가능성과 테스트 용이성을 높일 뿐만 아니라 버그 발생 가능성을 줄여줍니다.<br>
복잡한 애플리케이션에서는 불변성을 유지하는 데 약간의 추가 노력이 필요하지만, 그 이점이 비용을 크게 상회

### 불변성의 의미와 중요성

- 불변성이란 한번 생성된 데이터가 변경되지 않는 특성
- 함수형 프로그래밍에서 불변성을 유지하는 이유
  - **예측 가능성**: 불변 데이터는 예상치 못한 변경이 일어나지 않아 코드 흐름을 추적하기 쉽습니다.
  - **참조 투명성**: 같은 입력에 항상 같은 출력을 보장합니다.
  - **동시성 안전**: 공유 데이터가 변경되지 않아 멀티스레드 환경에서 안전합니다.
  - **디버깅 용이성**: 데이터가 언제, 어디서 변경되었는지 추적하기 쉽습니다.

### 1. 방어적 복사 (Defensive Copy)

- 데이터를 받거나 전달할 때 복사본을 만들어 원본 데이터가 변경되지 않도록 보호하는 기법

```javascript
// 방어적 복사 예시
function safelyStoreUserData(userData) {
  // 입력 데이터의 복사본 생성
  const userDataCopy = JSON.parse(JSON.stringify(userData));

  // 복사본을 변경해도 원본에 영향 없음
  userDataCopy.data = "변경";
}
```

### 2. 카피-온-라이트 (Copy-on-Write)

- 데이터를 변경해야 할 때만 복사본을 만들고, 그 복사본을 수정하는 패턴

```javascript
// 카피-온-라이트 패턴 예시
function addToShoppingCart(cart, item) {
  // 원본 카트의 복사본 생성
  const newCart = cart.slice();

  // 복사본에 새 아이템 추가
  newCart.push(item);

  // 변경된 복사본 반환
  return newCart;
}
// 사용 예
const myCart = ["apple", "banana"];
const updatedCart = addToShoppingCart(myCart, "orange");

console.log(myCart); // ['apple', 'banana'] - 원본 유지
console.log(updatedCart); // ['apple', 'banana', 'orange'] - 새 배열
```

### 3. 객체와 배열의 얕은 복사 (Shallow Copy)

- JavaScript에서 객체와 배열의 얕은 복사를 통한 불변성

```javascript
// 객체의 얕은 복사
const original = { x: 1, y: 2 };
const copy1 = Object.assign({}, original);
const copy2 = { ...original }; // 스프레드 연산자

// 배열의 얕은 복사
const originalArray = [1, 2, 3];
const copyArray1 = originalArray.slice();
const copyArray2 = [...originalArray]; // 스프레드 연산자
const copyArray3 = Array.from(originalArray);
```

### 4. 중첩 데이터 구조 다루기

- 중첩된 객체나 배열에서는 얕은 복사만으로는 불변성을 완전히 보장할 수 없다.
- 깊은 복사(Deep Copy)가 필요

```javascript
// 깊은 복사 구현 (재귀적 방법)
function deepCopy(obj) {
  // 기본 타입이나 null이면 그대로 반환
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 배열인 경우
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item));
  }

  // 객체인 경우
  const copy = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy;
}

// 간단한 깊은 복사 (JSON 활용, 제한적)
const deepCopyViaJSON = (obj) => JSON.parse(JSON.stringify(obj));

// structuredClone()이라는 내장 함수가 2022년에 도입

// structuredClone을 사용한 깊은 복사
const original = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    country: "USA",
  },
  hobbies: ["reading", "swimming", { type: "sports", name: "basketball" }],
};

// 깊은 복사 수행
const copied = structuredClone(original);

// 중첩 객체 변경해도 원본에 영향 없음
copied.address.city = "Boston";
copied.hobbies[2].name = "football";

console.log(original.address.city); // "New York" (변경되지 않음)
console.log(original.hobbies[2].name); // "basketball" (변경되지 않음)
```

### 5. 중첩 구조 효율적으로 업데이트하기

```javascript
- 중첩된 구조를 업데이트할 때 카피-온-라이트 패턴을 사용하여 변경된 부분만 복사
// 중첩 객체의 특정 속성 업데이트
function updateUser(user, address) {
  return {
    ...user,
    // address 객체만 새로 복사
    address: {
      ...user.address,
      ...address,
    },
  };
}

// 사용 예
const user = {
  name: "John",
  address: {
    city: "New York",
    zipCode: "10001",
  },
};

const updatedUser = updateUser(user, { city: "Boston" });
// user.address.city는 그대로 'New York'
// updatedUser.address.city는 'Boston'
```

### 6. 배열 불변 조작

```javascript
const addItem = (array, item) => [...array, item];

// 배열 시작에 요소 추가
const addItemToFront = (array, item) => [item, ...array];

// 특정 위치에 요소 추가
const insertItem = (array, item, index) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index),
];

// 요소 제거
const removeItem = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

// 특정 조건으로 요소 제거
const removeByCondition = (array, condition) =>
  array.filter((item) => !condition(item));

// 요소 업데이트
const updateItem = (array, index, newValue) =>
  array.map((item, i) => (i === index ? newValue : item));

// 조건에 맞는 요소 업데이트
const updateByCondition = (array, condition, update) =>
  array.map((item) => (condition(item) ? update(item) : item));
```

# 쏙쏙 들어오는 함수형 코딩 7장: 신뢰할 수 없는 코드를 쓰면서 불변성 지키기

### 핵심 개념 요약

함수형 프로그래밍에서는 신뢰할 수 없는 코드(외부 라이브러리, API, 레거시 코드 등)와 상호작용할 때도 불변성을 유지하는 것이 중요 7장에서는 이러한 상황에서 방어적 프로그래밍 기법을 통해 불변성을 보호하는 방법을 다룹니다.

- **신뢰 경계 식별**: 신뢰할 수 없는 코드와의 모든 상호작용 지점을 식별합니다.
- **방어적 복사**: 신뢰 경계에서 데이터가 들어오고 나갈 때 복사합니다.
- **데이터 검증**: 모든 외부 입력에 대해 철저한 유효성 검사를 수행합니다.
- **불변 데이터 구조**: 내부 로직에서 불변 데이터 구조를 활용합니다.
- **명시적 오류 처리**: 예외 대신 명시적인 오류 값을 반환합니다.
- **부수 효과 격리**: 모든 부수 효과를 분리하고 명시적으로 관리합니다.

방어적 프로그래밍과 불변성 원칙을 함께 적용하면 예측 가능하고 안정적인 시스템을 구축<br>
특히 여러 개발자가 함께 작업하거나, 외부 코드에 의존하는 복잡한 애플리케이션에서 큰 가치를 발휘

### 방어적 프로그래밍이란?

방어적 프로그래밍은 예상치 못한 입력이나 상황에도 안정적으로 동작하도록 코드를 작성하는 방법

- 데이터 불변성 보호
- 부수 효과 격리
- 예외 상황 처리

#### 방어적 복사의 두 가지 시점

- 데이터가 들어올 때 (입력 시): 외부에서 받은 데이터를 내부로 가져올 때 복사
- 데이터가 나갈 때 (출력 시): 내부 데이터를 외부로 전달할 때 복사

```javascript
// 방어적 복사 예시
function processUserData(userData) {
  // 입력 시 방어적 복사
  const userDataCopy = deepCopy(userData);

  // 내부에서 안전하게 데이터 처리
  const processedData = calculateUserMetrics(userDataCopy);

  // 출력 시 방어적 복사
  return deepCopy(processedData);
}
```

#### 깊은 복사 vs 얕은 복사

- 신뢰할 수 없는 코드와의 경계에서는 대부분 깊은 복사(Deep Copy)가 필요

```javascript
// 깊은 복사 구현
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item));
  }

  const copy = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy;
}

// JSON을 활용한 간단한 깊은 복사 (제한적)
function jsonDeepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
```

### 불변성과 방어적 프로그래밍의 통합 원칙

1. 신뢰 경계 명확히 정의하기

시스템의 신뢰 경계를 문서화하고 모든 개발자가 인식하도록 합니다.
경계를 넘나드는 모든 데이터에 방어적 복사 적용하기

2. 계층화된 아키텍처 설계하기

순수한 코어 비즈니스 로직을 격리하고 보호합니다.
어댑터 계층에서 모든 방어적 복사와 유효성 검사를 처리합니다.

3. 오류를 값으로 처리하기

예외 대신 구조화된 결과 객체를 반환합니다.
Maybe, Either 패턴을 활용하여 오류 케이스를 명시적으로 처리합니다.

4. 테스트 용이성 유지하기

외부 의존성을 모의 객체(mock)로 대체할 수 있는 설계를 유지합니다.
테스트에서 신뢰 경계를 확인하고 방어적 복사가 제대로 작동하는지 검증합니다.
