import { TokenWithAmounts } from './index';
export interface TokenAmountList {
  [ChainKey: string]: Array<TokenWithAmounts>;
}
