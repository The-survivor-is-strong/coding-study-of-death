const BEANS_PER_SHOT = 7;
const MILK_AMOUNTS = {
  small: 150,
  medium: 250,
  large: 350,
};
const BASE_PRICES = {
  americano: 3.5,
  latte: 4.5,
  cappuccino: 4.7,
};
const HAPPY_HOUR_DISCOUNT = 0.85;

// 초기 상태
const initialState = {
  dailySales: 0,
  totalCoffeeMade: 0,
  remainingBeans: 1000,
  remainingMilk: 2000,
};

// 주문 처리 메인 함수
function makeOrder(state, order, now = new Date()) {
  const { isHappyHour, isPumpkinSeason } = getTimeInfo(now);
  const shotCount = order.options.extraShot ? 2 : 1;

  // 재료 확인
  if (!checkInventory(state, order, shotCount)) {
    return { error: "재료 부족", state };
  }

  const price = calculatePrice(order, { isHappyHour, isPumpkinSeason });
  const updatedState = updateStats(state, order, price, shotCount);
  const receipt = createReceipt(order, price, now);

  printReceipt(receipt);

  return {
    result: {
      drink: `${order.size} ${order.coffeeType}`,
      price,
      timestamp: now.toISOString(),
    },
    state: updatedState,
  };
}

// 시간 정보 계산
function getTimeInfo(now) {
  const hour = now.getHours();
  const month = now.getMonth() + 1;

  return {
    isHappyHour: hour >= 15 && hour < 17,
    isPumpkinSeason: month >= 9 && month <= 12,
  };
}

// 재고 확인
function checkInventory(state, order, shotCount) {
  const requiredBeans = shotCount * BEANS_PER_SHOT;
  const milkRequired = getMilkAmount(order.coffeeType, order.size);

  return (
    state.remainingBeans >= requiredBeans && state.remainingMilk >= milkRequired
  );
}

// 가격 계산
function calculatePrice(order, { isHappyHour, isPumpkinSeason }) {
  // 기본 가격
  let price = BASE_PRICES[order.coffeeType] || 0;

  // 사이즈 업그레이드
  if (order.size === "medium") price += 0.75;
  if (order.size === "large") price += 1.5;

  // 옵션 추가
  if (order.options.extraShot) price += 0.8;
  if (order.options.syrup) price += 0.5;
  if (order.options.whippedCream) price += 1.0;
  if (isPumpkinSeason && order.options.pumpkinSpice) price += 0.9;

  // 해피아워 할인
  if (isHappyHour) price *= HAPPY_HOUR_DISCOUNT;

  return parseFloat(price.toFixed(2));
}

// 재고 차감 및 상태 업데이트
function updateStats(state, order, price, shotCount) {
  const beansUsed = shotCount * BEANS_PER_SHOT;
  const milkUsed = getMilkAmount(order.coffeeType, order.size);

  return {
    ...state,
    totalCoffeeMade: state.totalCoffeeMade + 1,
    dailySales: parseFloat((state.dailySales + price).toFixed(2)),
    remainingBeans: state.remainingBeans - beansUsed,
    remainingMilk: state.remainingMilk - milkUsed,
  };
}

// 우유 사용량 계산
function getMilkAmount(coffeeType, size) {
  if (coffeeType === "americano") return 0;
  return MILK_AMOUNTS[size] || MILK_AMOUNTS.small;
}

// 영수증 생성
function createReceipt(order, price, now) {
  // 옵션 목록을 사람이 읽기 쉬운 형태로 변환
  const options = [];
  if (order.options.extraShot) options.push("샷 추가");
  if (order.options.syrup) options.push(`${order.options.syrup} 시럽`);
  if (order.options.whippedCream) options.push("휘핑크림");
  if (order.options.pumpkinSpice) options.push("펌킨 스파이스");

  const optionsText = options.length > 0 ? options.join(", ") : "없음";

  return `
    --- 영수증 ---
    주문: ${order.size} ${order.coffeeType}
    옵션: ${optionsText}
    가격: $${price}
    시간: ${now.toLocaleTimeString()}
    포인트: ${Math.floor(price)}점 적립
  `;
}

// 출력
function printReceipt(receipt) {
  console.log(receipt);
}

// 테스트 실행
function runFunctionalExample() {
  let state = initialState;
  const orders = [
    {
      coffeeType: "latte",
      size: "medium",
      options: {
        extraShot: false,
        syrup: null,
        whippedCream: false,
        pumpkinSpice: false,
      },
    },
    {
      coffeeType: "americano",
      size: "large",
      options: {
        extraShot: true,
        syrup: "caramel",
        whippedCream: false,
        pumpkinSpice: false,
      },
    },
    {
      coffeeType: "cappuccino",
      size: "large",
      options: {
        extraShot: true,
        syrup: "vanilla",
        whippedCream: true,
        pumpkinSpice: true,
      },
    },
  ];

  orders.forEach((order, index) => {
    console.log(`\n===== 주문 ${index + 1} =====`);
    const result = makeOrder(state, order);

    if (result.error) {
      console.error("실패:", result.error);
    } else {
      console.log("주문 완료:", result.result);
    }

    state = result.state;
  });

  console.log("\n최종 상태:", state);
}

runFunctionalExample();
