export const counter = {
  death: 0,
  headBump: 0,
  slips: 0,
  jumps: 0,
  fallHeight: 0,
}



export function random(min, max, rounder) {
  if(!rounder) {
    // 10 = 0.1
    // 100 = 0.01
    rounder = 100;
  }
  const delta = max - min;
  return Math.round(rounder * (max - (Math.random() * delta))) / rounder;
}

