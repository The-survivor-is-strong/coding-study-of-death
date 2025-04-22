/**
 * 카페 음료 제조 시스템 실습 과제
 * ----------------------------
 *
 * 목표: "쏙쏙 들어오는 함수형 코딩" 3~5장의 원칙을 적용해 리팩토링하는 실습
 *
 * 기본 동작:
 * - 다양한 종류의 커피(아메리카노, 라떼, 카푸치노)를 제조
 * - 사이즈(small, medium, large)별 가격 차등 적용
 * - 추가 옵션(샷, 시럽, 휘핑크림 등) 처리
 * - 해피아워(15:00-17:00) 할인 적용
 * - 계절 한정 메뉴(가을 시즌) 제공
 * - 재고(원두, 우유) 관리
 * - 매출 통계 기록
 * - 영수증 생성 및 출력
 *
 * 실습 과제:
 * 1. 이 코드를 함수형 프로그래밍 원칙에 따라 리팩토링하세요.
 * 2. 함수를 더 작고 단일 책임을 가진 형태로 분리하세요.
 * 3. 순수 함수와 부수 효과가 있는 함수를 구분하세요.
 * 4. 전역 변수 의존성을 줄이세요.
 * 5. 테스트하기 쉬운 구조로 개선하세요.
 */

// 전역 상태를 객체로 관리
const CafeState = {
  dailySales: 0,
  totalCoffeeMade: 0,
  inventory: {
    beans: 1000,
    milk: 2000,
  },
};

// 상태 업데이트를 위한 순수 함수
function updateInventory(state, usedBeans, usedMilk) {
  return {
    ...state,
    inventory: {
      beans: state.inventory.beans - (usedBeans || 0),
      milk: state.inventory.milk - (usedMilk || 0),
    },
  };
}

// 순수 함수로 가격 계산 로직 분리
function calculateBasePrice(coffeeType) {
  const prices = {
    americano: 3.5,
    latte: 4.5,
    cappuccino: 4.7,
  };
  return prices[coffeeType] || null;
}

function calculateSizePrice(basePrice, size) {
  const sizeMultipliers = {
    small: 0,
    medium: 0.75,
    large: 1.5,
  };
  return basePrice + (sizeMultipliers[size] || 0);
}

function calculateOptionsPrice(price, options) {
  let totalPrice = price;
  if (options.extraShot) totalPrice += 0.8;
  if (options.syrup) totalPrice += 0.5;
  if (options.whippedCream) totalPrice += 1.0;
  if (options.pumpkinSpice) totalPrice += 0.9;
  return totalPrice;
}

// 재고 확인을 위한 순수 함수
function hasEnoughIngredients(inventory, requiredBeans, requiredMilk) {
  return inventory.beans >= requiredBeans && inventory.milk >= requiredMilk;
}

// 로깅을 위한 함수들
const CafeLogger = {
  orderStart: (coffeeType, size, options) => {
    console.log(
      `새 주문: ${size} ${coffeeType}, 옵션: ${JSON.stringify(options)}`
    );
  },

  preparationSteps: {
    checkIngredients: () => console.log("재료 확인 중..."),
    startDrink: () => console.log("음료 제조 시작..."),
    prepareEspresso: (shotCount, usedBeans, remainingBeans) => {
      console.log("에스프레소 준비 중...");
      console.log(`에스프레소 ${shotCount}샷 추출 중...`);
      console.log(`원두 ${usedBeans}g 사용 중... 남은 양: ${remainingBeans}g`);
    },
    prepareMilk: (milkAmount, remainingMilk) => {
      console.log("우유 데우는 중...");
      console.log(
        `우유 ${milkAmount}ml 사용 중... 남은 양: ${remainingMilk}ml`
      );
    },
    addSyrup: (syrupType) => {
      console.log(`${syrupType} 시럽 추가 중...`);
      console.log("시럽 15ml 사용 중...");
    },
    addWhippedCream: () => {
      console.log("휘핑크림 올리는 중...");
      console.log("휘핑크림 20g 사용 중...");
    },
    applyHappyHour: () => console.log("해피 아워 15% 할인 적용됨!"),
    addSeasonalOption: () => {
      console.log("가을 시즌 메뉴: 바닐라 시럽 추가 (+$0.9)");
      console.log("바닐라 시럽 10ml 사용 중...");
    },
    prepareCup: (size) => console.log(`${size} 사이즈 컵 준비 중...`),
    complete: (size, coffeeType) =>
      console.log(`${size} ${coffeeType} 제조 완료!`),
  },

  salesUpdate: (coffeeType, price, dailySales) => {
    console.log(`매출 통계 업데이트: ${coffeeType}, $${price.toFixed(2)}`);
    console.log(`오늘의 총 매출: $${dailySales.toFixed(2)}`);
  },

  printReceipt: (size, coffeeType, options, totalPrice, timestamp) => {
    const receiptText = `
      주문: ${size} ${coffeeType}
      옵션: ${JSON.stringify(options)}
      가격: $${totalPrice.toFixed(2)}
      주문시간: ${new Date(timestamp).toLocaleTimeString()}
    `;
    console.log("영수증 출력 중...");
    console.log(receiptText);
  },

  pointsEarned: (points) => console.log(`고객 포인트 ${points}점 적립 중...`),
};

// 재료 계산을 위한 순수 함수들
function calculateShotCount(options) {
  return options.extraShot ? 2 : 1;
}

function calculateRequiredBeans(shotCount) {
  return shotCount * 7;
}

function calculateRequiredMilk(coffeeType, size) {
  if (coffeeType === "americano") return 0;

  const milkAmounts = {
    small: 150,
    medium: 250,
    large: 350,
  };
  return milkAmounts[size] || 0;
}

// 할인 및 시즌 메뉴 관련 순수 함수들
function isHappyHourTime(hour) {
  return hour >= 15 && hour < 17;
}

function isAutumnSeason(month) {
  return month >= 9 && month <= 12;
}

function applyHappyHourDiscount(price, hour) {
  return isHappyHourTime(hour) ? price * 0.85 : price;
}

/**
 * 커피 제조 함수 - 모든 로직이 혼합된 상태
 */
function makeCoffee(state, coffeeType, size, options) {
  CafeLogger.orderStart(coffeeType, size, options);
  CafeLogger.preparationSteps.checkIngredients();

  // 재료 계산 로직 개선
  const shotCount = calculateShotCount(options);
  const requiredBeans = calculateRequiredBeans(shotCount);
  const requiredMilk = calculateRequiredMilk(coffeeType, size);

  // 재고 확인
  if (!hasEnoughIngredients(state.inventory, requiredBeans, requiredMilk)) {
    console.error("재료가 부족합니다!");
    return { error: "재료 부족", state };
  }

  // 음료 제조 과정 로깅
  CafeLogger.preparationSteps.startDrink();
  CafeLogger.preparationSteps.prepareEspresso(
    shotCount,
    requiredBeans,
    state.inventory.beans - requiredBeans
  );

  if (coffeeType !== "americano") {
    CafeLogger.preparationSteps.prepareMilk(
      requiredMilk,
      state.inventory.milk - requiredMilk
    );
  }

  // 가격 계산 로직 개선
  let price = calculateBasePrice(coffeeType);
  price = calculateSizePrice(price, size);
  price = calculateOptionsPrice(price, options);

  const now = new Date();
  price = applyHappyHourDiscount(price, now.getHours());

  if (isAutumnSeason(now.getMonth() + 1) && options.pumpkinSpice) {
    CafeLogger.preparationSteps.addSeasonalOption();
  }

  // 완성 단계
  CafeLogger.preparationSteps.prepareCup(size);
  CafeLogger.preparationSteps.complete(size, coffeeType);

  // 새로운 상태 생성
  const newState = {
    ...updateInventory(state, requiredBeans, requiredMilk),
    dailySales: state.dailySales + price,
    totalCoffeeMade: state.totalCoffeeMade + 1,
  };

  // 매출 및 영수증 처리
  CafeLogger.salesUpdate(coffeeType, price, newState.dailySales);
  CafeLogger.printReceipt(size, coffeeType, options, price, now);
  CafeLogger.pointsEarned(Math.floor(price));

  return {
    state: newState,
    result: {
      drink: `${size} ${coffeeType}`,
      price: price.toFixed(2),
      timestamp: now.toISOString(),
    },
  };
}

/**
 * 테스트를 위한 함수 호출
 */
function runExample() {
  // 예시 1: 기본 라떼
  console.log("\n===== 예시 1: 기본 라떼 =====");
  const coffee1 = makeCoffee(CafeState, "latte", "medium", {
    extraShot: false,
    syrup: null,
    whippedCream: false,
    pumpkinSpice: false,
  });
  console.log("주문 결과:", coffee1.result);

  // 예시 2: 커스텀 아메리카노
  console.log("\n===== 예시 2: 커스텀 아메리카노 =====");
  const coffee2 = makeCoffee(CafeState, "americano", "large", {
    extraShot: true,
    syrup: "caramel",
    whippedCream: false,
    pumpkinSpice: false,
  });
  console.log("주문 결과:", coffee2.result);

  // 예시 3: 특별 카푸치노
  console.log("\n===== 예시 3: 특별 카푸치노 =====");
  const coffee3 = makeCoffee(CafeState, "cappuccino", "large", {
    extraShot: true,
    syrup: "vanilla",
    whippedCream: true,
    pumpkinSpice: true,
  });
  console.log("주문 결과:", coffee3.result);
}

// 예시 실행
runExample();
