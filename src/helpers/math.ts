export const degreeToRadian = (degree: number): number => degree * Math.PI / 180;

export const isPowerOf2 = (value: number): boolean => (value & (value - 1)) == 0;