// 전역 변수들
let dailySales = 0 // 일일 매출액
let totalCoffeeMade = 0 // 오늘 만든 커피 수량
let remainingBeans = 1000 // 남은 원두량(g)
let remainingMilk = 2000 // 남은 우유량(ml)

// 카페 음료 제조 시스템 - 모든 로직이 하나의 함수에 혼합되어 있음
function makeCoffee(coffeeType, size, options) {
  // 현재 시간 확인 (액션)
  const now = new Date()
  const isHappyHour = now.getHours() >= 15 && now.getHours() < 17

  // 오늘 만든 커피 수량 증가 (전역 변수 수정 - 액션)
  totalCoffeeMade++

  // 콘솔에 주문 로깅 (액션)
  console.log(`새 주문: ${size} ${coffeeType}, 옵션: ${JSON.stringify(options)}`)

  // 재료 확인 (액션) - 전역 변수 사용
  console.log("재료 확인 중...")
  const milkLevel = remainingMilk // 전역 변수 읽기 (액션)
  const espressoBeansLevel = remainingBeans // 전역 변수 읽기 (액션)

  if (milkLevel < 100 || espressoBeansLevel < 20) {
    console.error("재료가 부족합니다!")
    return null
  }

  // 기본 가격 설정 (계산)
  let basePrice = 0
  if (coffeeType === "americano") {
    basePrice = 3.5
  } else if (coffeeType === "latte") {
    basePrice = 4.5
  } else if (coffeeType === "cappuccino") {
    basePrice = 4.7
  } else {
    console.error("알 수 없는 커피 종류입니다.")
    return null
  }

  // 사이즈에 따른 가격 조정 (계산)
  if (size === "large") {
    basePrice += 1.5
  } else if (size === "medium") {
    basePrice += 0.75
  }

  // 추가 옵션 가격 계산 (계산)
  let totalPrice = basePrice

  // 에스프레소 추출 (액션)
  console.log("음료 제조 시작...")
  console.log("에스프레소 준비 중...")

  let shotCount = 1
  if (options.extraShot) {
    shotCount += 1
    totalPrice += 0.8
    console.log("추가 샷 추가됨")
  }

  // 실제 에스프레소 추출 (액션) - 전역 변수 수정
  console.log(`에스프레소 ${shotCount}샷 추출 중...`)
  const usedBeans = shotCount * 7
  remainingBeans -= usedBeans // 전역 변수 수정 (액션)
  console.log(`원두 ${usedBeans}g 사용 중... 남은 양: ${remainingBeans}g`)

  // 우유 데우기 (액션) - 전역 변수 수정
  if (coffeeType !== "americano") {
    console.log("우유 데우는 중...")
    const milkAmount = size === "small" ? 150 : size === "medium" ? 250 : 350
    remainingMilk -= milkAmount // 전역 변수 수정 (액션)
    console.log(`우유 ${milkAmount}ml 사용 중... 남은 양: ${remainingMilk}ml`)
  }

  // 시럽 추가 (액션 + 계산)
  if (options.syrup) {
    totalPrice += 0.5
    console.log(`${options.syrup} 시럽 추가 중...`)
    console.log("시럽 15ml 사용 중...") // 액션
  }

  // 휘핑크림 추가 (액션 + 계산)
  if (options.whippedCream) {
    totalPrice += 1.0
    console.log("휘핑크림 올리는 중...")
    console.log("휘핑크림 20g 사용 중...") // 액션
  }

  // 해피 아워 할인 적용 (계산 + 액션 혼합)
  if (isHappyHour) {
    totalPrice = totalPrice * 0.85 // 15% 할인
    console.log("해피 아워 15% 할인 적용됨!")
  }

  // 계절 한정 메뉴 확인 (액션 + 계산)
  const currentMonth = now.getMonth() + 1
  if (currentMonth >= 9 && currentMonth <= 12 && options.pumpkinSpice) {
    totalPrice += 0.9
    console.log("가을 시즌 메뉴: 바닐라 시럽 추가 (+$0.9)")
    console.log("바닐라 시럽 10ml 사용 중...") // 액션
  }

  // 컵 선택 (액션)
  console.log(`${size} 사이즈 컵 준비 중...`)

  // 음료 완성 (액션)
  console.log(`${size} ${coffeeType} 제조 완료!`)

  // 매출 통계 업데이트 (액션) - 전역 변수 수정
  dailySales += totalPrice // 전역 변수 수정 (액션)
  console.log(`매출 통계 업데이트: ${coffeeType}, $${totalPrice.toFixed(2)}`)
  console.log(`오늘의 총 매출: $${dailySales.toFixed(2)}`)

  // 영수증 정보 생성 (계산)
  const receiptText = `
    주문: ${size} ${coffeeType}
    옵션: ${JSON.stringify(options)}
    가격: $${totalPrice.toFixed(2)}
    주문시간: ${now.toLocaleTimeString()}
  `

  // 영수증 출력 (액션)
  console.log("영수증 출력 중...")
  console.log(receiptText)

  // 고객 마일리지 포인트 적립 (액션)
  const pointsEarned = Math.floor(totalPrice)
  console.log(`고객 포인트 ${pointsEarned}점 적립 중...`)

  return {
    drink: `${size} ${coffeeType}`,
    price: totalPrice.toFixed(2),
    timestamp: now.toISOString(),
  }
}

// 사용 예시
const coffee = makeCoffee("latte", "large", {
  extraShot: true,
  syrup: "vanilla",
  whippedCream: false,
  pumpkinSpice: true,
})

console.log("주문 결과:", coffee)
