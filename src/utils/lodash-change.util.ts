import { snakeCase, camelCase } from 'lodash';

// 객체의 모든 키를 스네이크케이스로 변환
export const toSnakeCaseKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCaseKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[snakeCase(key)] = toSnakeCaseKeys(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

// 객체의 모든 키를 카멜케이스로 변환
export const toCamelCaseKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCaseKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[camelCase(key)] = toCamelCaseKeys(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};
