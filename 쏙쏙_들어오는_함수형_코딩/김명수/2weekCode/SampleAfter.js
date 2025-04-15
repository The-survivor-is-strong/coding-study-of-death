// 함수형 코딩 원칙에 따라 재구성된 카페 음료 제조 시스템
// 클로저를 사용하여 상태를 캡슐화하고 모든 전역 의존성 제거

// 카페 시스템 생성 함수 - 완전한 의존성 주입 패턴
function createCoffeeShop(initialInventory = { beans: 1000, milk: 2000 }) {
  // 초기 상태 생성 - 클로저를 통해 보호됨
  const state = {
    dailySales: 0,
    totalCoffeeMade: 0,
    inventory: { ...initialInventory }, // 불변성을 위해 복사
  }

  // 1. 순수 함수로 가격 계산
  function calculateBasePrice(coffeeType) {
    const prices = {
      americano: 3.5,
      latte: 4.5,
      cappuccino: 4.7,
    }
    return prices[coffeeType] || null
  }

  function applySizePrice(basePrice, size) {
    const sizeAdditions = {
      small: 0,
      medium: 0.75,
      large: 1.5,
    }
    return basePrice + (sizeAdditions[size] || 0)
  }

  function calculateOptionsPrice(options) {
    let optionsPrice = 0

    if (options.extraShot) {
      optionsPrice += 0.8
    }

    if (options.syrup) {
      optionsPrice += 0.5
    }

    if (options.whippedCream) {
      optionsPrice += 1.0
    }

    if (options.pumpkinSpice) {
      optionsPrice += 0.9
    }

    return optionsPrice
  }

  function applyHappyHourDiscount(price, time) {
    const hour = time.getHours()
    const isHappyHour = hour >= 15 && hour < 17
    return isHappyHour ? price * 0.85 : price
  }

  function isPumpkinSpiceAvailable(date) {
    const month = date.getMonth() + 1
    return month >= 9 && month <= 12
  }

  // 2. 재료 사용 계산 함수 (순수 함수)
  function calculateBeansNeeded(shotCount) {
    return shotCount * 7
  }

  function calculateMilkNeeded(coffeeType, size) {
    if (coffeeType === "americano") return 0

    const milkAmounts = {
      small: 150,
      medium: 250,
      large: 350,
    }

    return milkAmounts[size] || 0
  }

  // 3. 재고 확인 함수 (순수 함수)
  function hasEnoughIngredients(inventory, beansNeeded, milkNeeded) {
    return inventory.beans >= beansNeeded && inventory.milk >= milkNeeded
  }

  // 4. 상태 업데이트 함수 - 새로운 상태를 반환 (불변성 유지)
  function updateInventory(inventory, beansUsed, milkUsed) {
    return {
      beans: inventory.beans - beansUsed,
      milk: inventory.milk - milkUsed,
    }
  }

  function updateSalesStats(currentState, price) {
    return {
      ...currentState,
      dailySales: currentState.dailySales + price,
      totalCoffeeMade: currentState.totalCoffeeMade + 1,
    }
  }

  // 5. 영수증 생성 (순수 함수)
  function generateReceipt(coffeeType, size, options, price, timestamp) {
    return `
        주문: ${size} ${coffeeType}
        옵션: ${JSON.stringify(options)}
        가격: $${price.toFixed(2)}
        주문시간: ${timestamp.toLocaleTimeString()}
      `
  }

  // 6. 로깅 함수 (부수 효과를 명시적으로 분리) - 원본 출력과 동일하게 맞춤
  function logOrderDetails(orderDetails) {
    console.log(
      `새 주문: ${orderDetails.size} ${orderDetails.coffeeType}, 옵션: ${JSON.stringify(orderDetails.options)}`
    )
  }

  function logInventoryCheck() {
    console.log("재료 확인 중...")
  }

  function logPreparation(coffeeType, size, shotCount) {
    console.log("음료 제조 시작...")
    console.log("에스프레소 준비 중...")
    console.log(`에스프레소 ${shotCount}샷 추출 중...`)

    if (coffeeType !== "americano") {
      console.log("우유 데우는 중...")
    }

    console.log(`${size} 사이즈 컵 준비 중...`)
    console.log(`${size} ${coffeeType} 제조 완료!`)
  }

  function logIngredientUsage(beansUsed, milkUsed, inventory) {
    console.log(`원두 ${beansUsed}g 사용 중... 남은 양: ${inventory.beans}g`)

    if (milkUsed > 0) {
      console.log(`우유 ${milkUsed}ml 사용 중... 남은 양: ${inventory.milk}ml`)
    }
  }

  function logOptionsAdded(options, isPumpkinSpiceAvailable) {
    if (options.extraShot) {
      console.log("추가 샷 추가됨")
    }

    if (options.syrup) {
      console.log(`${options.syrup} 시럽 추가 중...`)
      console.log("시럽 15ml 사용 중...")
    }

    if (options.whippedCream) {
      console.log("휘핑크림 올리는 중...")
      console.log("휘핑크림 20g 사용 중...")
    }

    if (isPumpkinSpiceAvailable && options.pumpkinSpice) {
      console.log("가을 시즌 메뉴: 바닐라 시럽 추가 (+$0.9)")
      console.log("바닐라 시럽 10ml 사용 중...")
    }
  }

  function logSalesUpdate(coffeeType, price, dailySales) {
    console.log(`매출 통계 업데이트: ${coffeeType}, $${price.toFixed(2)}`)
    console.log(`오늘의 총 매출: $${dailySales.toFixed(2)}`)
  }

  function logHappyHourDiscount() {
    console.log("해피 아워 15% 할인 적용됨!")
  }

  function logPointsEarned(points) {
    console.log(`고객 포인트 ${points}점 적립 중...`)
  }

  // 7. 커피 제조 함수 - 순수 계산과 부수 효과 조합
  function _makeCoffee(currentState, coffeeType, size, options) {
    // 현재 시간 확인
    const now = new Date()

    // 주문 정보 로깅 (부수 효과)
    logOrderDetails({ coffeeType, size, options })

    // 재고 체크 로그 (부수 효과)
    logInventoryCheck()

    // 샷 수 계산 (순수 계산)
    const shotCount = options.extraShot ? 2 : 1

    // 필요한 재료 계산 (순수 계산)
    const beansNeeded = calculateBeansNeeded(shotCount)
    const milkNeeded = calculateMilkNeeded(coffeeType, size)

    // 재료 충분한지 확인 (순수 계산)
    if (!hasEnoughIngredients(currentState.inventory, beansNeeded, milkNeeded)) {
      console.error("재료가 부족합니다!")
      return { currentState, result: null }
    }

    // 가격 계산 (순수 계산)
    const basePrice = calculateBasePrice(coffeeType)
    if (basePrice === null) {
      console.error("알 수 없는 커피 종류입니다.")
      return { currentState, result: null }
    }

    const priceWithSize = applySizePrice(basePrice, size)
    const priceWithOptions = priceWithSize + calculateOptionsPrice(options)
    const finalPrice = applyHappyHourDiscount(priceWithOptions, now)

    // 가을 시즌 메뉴 체크 (순수 계산)
    const isPumpkinAvailable = isPumpkinSpiceAvailable(now)

    // 에스프레소 준비 로그 (부수 효과)
    logPreparation(coffeeType, size, shotCount)

    // 재료 사용 후 새 상태 계산 (순수 계산)
    const newInventory = updateInventory(currentState.inventory, beansNeeded, milkNeeded)

    // 재료 사용 로그 (부수 효과)
    logIngredientUsage(beansNeeded, milkNeeded, newInventory)

    // 옵션 추가 로그 (부수 효과)
    logOptionsAdded(options, isPumpkinAvailable)

    // 해피 아워 할인 로그 (부수 효과)
    if (finalPrice < priceWithOptions) {
      logHappyHourDiscount()
    }

    // 매출 통계 업데이트 (순수 계산)
    const newState = {
      ...updateSalesStats(currentState, finalPrice),
      inventory: newInventory,
    }

    // 매출 업데이트 로그 (부수 효과)
    logSalesUpdate(coffeeType, finalPrice, newState.dailySales)

    // 영수증 생성 (순수 계산)
    const receipt = generateReceipt(coffeeType, size, options, finalPrice, now)

    // 영수증 출력 로그 (부수 효과)
    console.log("영수증 출력 중...")
    console.log(receipt)

    // 포인트 적립 로그 (부수 효과)
    const pointsEarned = Math.floor(finalPrice)
    logPointsEarned(pointsEarned)

    // 결과 객체 생성 (순수 계산)
    const result = {
      drink: `${size} ${coffeeType}`,
      price: finalPrice.toFixed(2),
      timestamp: now.toISOString(),
    }

    // 상태와 결과 반환
    return { newState, result }
  }

  // 8. 공개 API - 캡슐화를 통해 상태를 보호하고 필요한 함수만 노출
  return {
    // 커피 제조 함수 - 내부 상태를 업데이트하고 결과만 반환
    makeCoffee: (coffeeType, size, options) => {
      const { newState, result } = _makeCoffee(state, coffeeType, size, options)

      // 내부 상태 업데이트 (클로저 내에서만 접근 가능)
      if (result) {
        Object.assign(state, newState)
      }

      return result
    },

    // 현재 상태 정보 제공 (읽기 전용 복사본)
    getStatus: () => ({
      dailySales: state.dailySales,
      totalCoffeeMade: state.totalCoffeeMade,
      inventory: { ...state.inventory },
    }),
  }
}

// 사용 예시 - 전역 변수 없이 카페 인스턴스 생성
const cafeShop = createCoffeeShop()

// 커피 주문
const coffee = cafeShop.makeCoffee("latte", "large", {
  extraShot: true,
  syrup: "vanilla",
  whippedCream: false,
  pumpkinSpice: true,
})

console.log("주문 결과:", coffee)
