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

/**
 * 커피 제조 함수 - 모든 로직이 혼합된 상태
 */
function makeCoffee(coffeeType, size, options) {
  // 현재 시간 확인
  const now = new Date();
  const isHappyHour = now.getHours() >= 15 && now.getHours() < 17;

  // 오늘 만든 커피 수량 증가
  CafeState.totalCoffeeMade++;

  // 주문 로깅
  console.log(
    `새 주문: ${size} ${coffeeType}, 옵션: ${JSON.stringify(options)}`
  );

  // 재료 확인
  console.log("재료 확인 중...");
  const milkLevel = CafeState.inventory.milk;
  const espressoBeansLevel = CafeState.inventory.beans;
  if (milkLevel < 100 || espressoBeansLevel < 20) {
    console.error("재료가 부족합니다!");
    return null;
  }

  // 기본 가격 설정
  let basePrice = 0;
  if (coffeeType === "americano") {
    basePrice = 3.5;
  } else if (coffeeType === "latte") {
    basePrice = 4.5;
  } else if (coffeeType === "cappuccino") {
    basePrice = 4.7;
  } else {
    console.error("알 수 없는 커피 종류입니다.");
    return null;
  }

  // 사이즈에 따른 가격 조정
  if (size === "large") {
    basePrice += 1.5;
  } else if (size === "medium") {
    basePrice += 0.75;
  }

  // 초기 총 가격
  let totalPrice = basePrice;

  // 음료 제조 시작
  console.log("음료 제조 시작...");
  console.log("에스프레소 준비 중...");

  // 샷 수 계산 및 추가
  let shotCount = 1;
  if (options.extraShot) {
    shotCount += 1;
    totalPrice += 0.8;
    console.log("추가 샷 추가됨");
  }

  // 실제 에스프레소 추출
  console.log(`에스프레소 ${shotCount}샷 추출 중...`);
  const usedBeans = shotCount * 7;
  CafeState.inventory = updateInventory(CafeState, usedBeans, null);
  console.log(
    `원두 ${usedBeans}g 사용 중... 남은 양: ${CafeState.inventory.beans}g`
  );

  // 우유 추가
  if (coffeeType !== "americano") {
    console.log("우유 데우는 중...");
    const milkAmount = size === "small" ? 150 : size === "medium" ? 250 : 350;
    CafeState.inventory = updateInventory(CafeState, null, milkAmount);
    console.log(
      `우유 ${milkAmount}ml 사용 중... 남은 양: ${CafeState.inventory.milk}ml`
    );
  }

  // 시럽 추가
  if (options.syrup) {
    totalPrice += 0.5;
    console.log(`${options.syrup} 시럽 추가 중...`);
    console.log("시럽 15ml 사용 중...");
  }

  // 휘핑크림 추가
  if (options.whippedCream) {
    totalPrice += 1.0;
    console.log("휘핑크림 올리는 중...");
    console.log("휘핑크림 20g 사용 중...");
  }

  // 해피 아워 할인 적용
  if (isHappyHour) {
    totalPrice = totalPrice * 0.85; // 15% 할인
    console.log("해피 아워 15% 할인 적용됨!");
  }

  // 계절 한정 메뉴 확인
  const currentMonth = now.getMonth() + 1;
  if (currentMonth >= 9 && currentMonth <= 12 && options.pumpkinSpice) {
    totalPrice += 0.9;
    console.log("가을 시즌 메뉴: 바닐라 시럽 추가 (+$0.9)");
    console.log("바닐라 시럽 10ml 사용 중...");
  }

  // 컵 준비
  console.log(`${size} 사이즈 컵 준비 중...`);

  // 음료 완성
  console.log(`${size} ${coffeeType} 제조 완료!`);

  // 매출 통계 업데이트
  CafeState.dailySales += totalPrice;
  console.log(`매출 통계 업데이트: ${coffeeType}, $${totalPrice.toFixed(2)}`);
  console.log(`오늘의 총 매출: $${CafeState.dailySales.toFixed(2)}`);

  // 영수증 정보 생성
  const receiptText = `
   주문: ${size} ${coffeeType}
   옵션: ${JSON.stringify(options)}
   가격: $${totalPrice.toFixed(2)}
   주문시간: ${now.toLocaleTimeString()}
 `;

  // 영수증 출력
  console.log("영수증 출력 중...");
  console.log(receiptText);

  // 고객 마일리지 포인트 적립
  const pointsEarned = Math.floor(totalPrice);
  console.log(`고객 포인트 ${pointsEarned}점 적립 중...`);

  // 주문 결과 반환
  return {
    drink: `${size} ${coffeeType}`,
    price: totalPrice.toFixed(2),
    timestamp: now.toISOString(),
  };
}

/**
 * 테스트를 위한 함수 호출
 */
function runExample() {
  // 예시 1: 기본 라떼
  console.log("\n===== 예시 1: 기본 라떼 =====");
  const coffee1 = makeCoffee("latte", "medium", {
    extraShot: false,
    syrup: null,
    whippedCream: false,
    pumpkinSpice: false,
  });
  console.log("주문 결과:", coffee1);

  // 예시 2: 커스텀 아메리카노
  console.log("\n===== 예시 2: 커스텀 아메리카노 =====");
  const coffee2 = makeCoffee("americano", "large", {
    extraShot: true,
    syrup: "caramel",
    whippedCream: false,
    pumpkinSpice: false,
  });
  console.log("주문 결과:", coffee2);

  // 예시 3: 특별 카푸치노
  console.log("\n===== 예시 3: 특별 카푸치노 =====");
  const coffee3 = makeCoffee("cappuccino", "large", {
    extraShot: true,
    syrup: "vanilla",
    whippedCream: true,
    pumpkinSpice: true,
  });
  console.log("주문 결과:", coffee3);
}

// 예시 실행
runExample();
