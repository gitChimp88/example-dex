import { useRef, useState } from 'react';
import { RefSelectProps } from 'antd/lib/select';
import { Row, Col, Form, Select, Input, Button, Tooltip } from 'antd';
import ChainSelect from './ChainSelect';
import { Chain, ChainKey, TokenWithAmounts, TokenAmount } from './types';
import TokenSelect from './TokenSelect';
import BigNumber from 'bignumber.js';

const { Option } = Select;

interface SwapFormProps {
  depositChain?: ChainKey;
  setDepositChain: Function;
  availableChains: Array<Chain>;
  setWithdrawChain: Function;
  withdrawChain?: ChainKey;
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> };
  balances: { [ChainKey: string]: Array<TokenAmount> } | undefined;
  depositToken?: string;
  setDepositToken: Function;
  setWithdrawToken: Function;
  withdrawToken?: string;
  depositAmount: BigNumber;
  setDepositAmount: Function;
  withdrawAmount: BigNumber;
  setWithdrawAmount: Function;
  estimatedWithdrawAmount: string;
  estimatedMinWithdrawAmount?: string;
}

function SwapForm({
  availableChains,
  depositChain,
  setDepositChain,
  setWithdrawChain,
  withdrawChain,
  tokens,
  balances,
  depositToken,
  setDepositToken,
  setWithdrawToken,
  withdrawToken,
  depositAmount,
  withdrawAmount,
  setWithdrawAmount,
  setDepositAmount,
  estimatedWithdrawAmount,
  estimatedMinWithdrawAmount,
}: SwapFormProps) {
  const depositSelectRef = useRef<RefSelectProps>();
  const withdrawSelectRef = useRef<RefSelectProps>();
  const [depositAmountString, setDepositAmountString] = useState<string>('');

  const onChangeDepositChain = (chainKey: ChainKey) => {
    //TODO: add logic to deal with changing tokens automatically on chain change.
    setDepositChain(chainKey);
  };

  const onChangeWithdrawChain = (chainKey: ChainKey) => {
    //TODO: add logic to deal with changing tokens automatically on chain change.
    setWithdrawChain(chainKey);
  };

  const onChangeDepositToken = (tokenAddress: string) => {
    // unselect
    depositSelectRef?.current?.blur();

    if (!depositChain) return;
    // connect
    if (tokenAddress === 'connect') {
      // Then connect wallet
      return;
    }
    // set token
    setDepositToken(tokenAddress);
  };

  const onChangeWithdrawToken = (tokenId: string) => {
    // unselect
    withdrawSelectRef?.current?.blur();

    // connect
    if (tokenId === 'connect') {
      // Then connect wallet
      return;
    }

    // set token
    setWithdrawToken(tokenId);
  };

  const onChangeDepositAmount = (amount: string) => {
    setDepositAmountString(amount);
    setDepositAmount(new BigNumber(amount));
    setWithdrawAmount(new BigNumber(Infinity));
  };

  const onChangeWithdrawAmount = (amount: BigNumber) => {
    setDepositAmount(new BigNumber(Infinity));
    setWithdrawAmount(amount);
  };

  const formatAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    return new BigNumber(e.currentTarget.value);
  };

  return (
    <>
      <Form>
        <Row style={{ marginBottom: 8 }}>
          <Col span={10}>
            <div>From:</div>
          </Col>
        </Row>

        <Row style={{ marginBottom: 8 }} gutter={[0, 0]}>
          <Col span={12}>
            <div>
              <ChainSelect
                availableChains={availableChains}
                selectedChain={depositChain}
                onChangeSelectedChain={onChangeDepositChain}
              />
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                borderTopLeftRadius: '0px !important',
                borderBottomLeftRadius: '0px !important',
              }}
            >
              <TokenSelect
                tokens={tokens}
                balances={balances}
                selectedChain={depositChain}
                selectedToken={depositToken}
                onChangeSelectedToken={onChangeDepositToken}
                selectReference={depositSelectRef}
                grayed={true}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>
              <Input
                style={{ height: 50 }}
                type="number"
                defaultValue={0.0}
                min={0}
                value={depositAmountString}
                onChange={(event) =>
                  onChangeDepositAmount(event.currentTarget.value)
                }
              />
              <Button type="text">MAX</Button>
            </div>
          </Col>
        </Row>

        <>
          <Row style={{ marginBottom: 8 }}>
            <Col span={10}>
              <div>To:</div>
            </Col>
          </Row>
          <Row gutter={[0, 0]} style={{ marginBottom: 8 }}>
            <Col span={12}>
              <div>
                <ChainSelect
                  availableChains={availableChains}
                  selectedChain={withdrawChain}
                  onChangeSelectedChain={onChangeWithdrawChain}
                />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <TokenSelect
                  tokens={tokens}
                  balances={balances}
                  selectedChain={withdrawChain}
                  selectedToken={withdrawToken}
                  onChangeSelectedToken={onChangeWithdrawToken}
                  selectReference={withdrawSelectRef}
                  grayed={false}
                />
              </div>
            </Col>
          </Row>

          <Row style={{ marginBottom: 8 }}>
            <Col span={24}>
              <div>
                <Input
                  style={{ height: 50 }}
                  type="text"
                  defaultValue={0.0}
                  min={0}
                  placeholder="..."
                  bordered={false}
                  disabled
                  value={estimatedWithdrawAmount}
                  onChange={(event) =>
                    onChangeWithdrawAmount(formatAmountInput(event))
                  }
                />
                {!!estimatedMinWithdrawAmount && (
                  <Tooltip
                    color={'gray'}
                    title={`The final amount might change due to slippage but will not fall below ${estimatedMinWithdrawAmount}`}
                  >
                    <span style={{ cursor: 'pointer' }} className="amountBadge">
                      ?
                    </span>
                  </Tooltip>
                )}
              </div>
            </Col>
          </Row>
        </>
      </Form>
    </>
  );
}

export default SwapForm;
