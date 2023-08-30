import { RuleType } from '@midwayjs/validate';

export const stringRequireRule = () => RuleType.string().required();

export const stringRule = () => RuleType.string();

export const booleanRule = () => RuleType.boolean();

export const booleanRequiredRule = () => RuleType.boolean().required();

export const anyRule = () => RuleType.any();
