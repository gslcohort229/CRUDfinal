function isWithinTimeWindowSeconds(timestamp1, timestamp2, windowSeconds) {
    return Math.abs(timestamp1 - timestamp2) <= windowSeconds * 1000;
  }
  
  function test_isWithinTimeWindowSeconds() {
    const timestamp1 = Date.now();
    const timestamp2 = timestamp1 + 1000; // 1 second later
  
    console.log(isWithinTimeWindowSeconds(timestamp1, timestamp2, 1)); // should log: true
console.log(isWithinTimeWindowSeconds(timestamp1, timestamp2, 0.5)); // should log: false
}
test_isWithinTimeWindowSeconds();
