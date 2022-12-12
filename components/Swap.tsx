import { useState, useEffect, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Content } from 'antd/lib/layout/layout';
import { Row, Col, Button } from 'antd';
import LiFi from './providers/LiFi';
import { useChainsTokensTools } from './providers/chainsTokensToolsProvider';
import Title from 'antd/lib/typography/Title';
import SwapForm from './SwapForm';
import {
  ChainKey,
  Chain,
  TokenAmount,
  Route as RouteType,
  RoutesRequest,
  RoutesResponse,
} from './types';
import { TokenAmountList } from './types/internal.types';
import { RouteList } from './RouteList/RouteList';
import BigNumber from 'bignumber.js';
import { v4 as uuid } from 'uuid';
import { formatTokenAmount, formatTokenAmountOnly } from './services/utils';

let currentRouteCallId: string;

function Swap() {
  // Wallet
  const web3 = useWeb3React<Web3Provider>();
  const chainsTokensTools = useChainsTokensTools();
  const [availableChains, setAvailableChains] = useState<Chain[]>(
    chainsTokensTools.chains
  );
  const [tokens, setTokens] = useState<TokenAmountList>(
    chainsTokensTools.tokens
  );
  const [balances, setBalances] = useState<{
    [ChainKey: string]: Array<TokenAmount>;
  }>();

  // from
  const [depositAmount, setDepositAmount] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [fromChainKey, setFromChainKey] = useState<ChainKey | undefined>();
  const [fromTokenAddress, setFromTokenAddress] = useState<
    string | undefined
  >();
  const [routeCallResult, setRouteCallResult] = useState<{
    result: RoutesResponse;
    id: string;
  }>();

  // to
  const [toChainKey, setToChainKey] = useState<ChainKey | undefined>();
  const [toTokenAddress, setToTokenAddress] = useState<string | undefined>();
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(
    new BigNumber(Infinity)
  );

  // Routes
  const [routes, setRoutes] = useState<Array<RouteType>>([]);
  const [routesLoading, setRoutesLoading] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false);

  // get chains
  useEffect(() => {
    console.log('chains from lifi - ', chainsTokensTools.chains);
    setAvailableChains(chainsTokensTools.chains);
  }, [chainsTokensTools.chains]);

  useEffect(() => {
    setTokens(chainsTokensTools.tokens);
  }, [chainsTokensTools.tokens]);

  const updateBalances = useCallback(async () => {
    if (web3.account) {
      // one call per chain to show balances as soon as the request comes back
      Object.entries(tokens).forEach(([chainKey, tokenList]) => {
        LiFi.getTokenBalances(web3.account!, tokenList).then(
          (portfolio: any) => {
            setBalances((balances) => {
              if (!balances) balances = {};
              return {
                ...balances,
                [chainKey]: portfolio,
              };
            });
          }
        );
      });
    }
  }, [web3.account, tokens]);

  useEffect(() => {
    if (web3.account) {
      updateBalances();
    }
  }, [web3.account, updateBalances]);

  const findToken = useCallback(
    (chainKey: ChainKey, tokenId: string) => {
      const token = tokens[chainKey].find((token) => token.address === tokenId);
      if (!token) {
        throw new Error('Token not found');
      }
      return token;
    },
    [tokens]
  );

  // set route call results
  useEffect(() => {
    if (routeCallResult) {
      const { result, id } = routeCallResult;
      if (id === currentRouteCallId) {
        setRoutes(result.routes);
        setHighlightedIndex(result.routes.length === 0 ? -1 : 0);
        setNoRoutesAvailable(result.routes.length === 0);
        setRoutesLoading(false);
        // transactionInfoRef.current?.scrollIntoView({ behavior: 'smooth' })
        // setActiveTransactionInfoTabKey('1')
      }
    }
  }, [routeCallResult, currentRouteCallId]);

  useEffect(() => {
    const getTransferRoutes = async () => {
      setRoutes([]);
      setHighlightedIndex(-1);
      setNoRoutesAvailable(false);

      if (
        depositAmount.gt(0) &&
        fromChainKey &&
        fromTokenAddress &&
        toChainKey &&
        toTokenAddress
      ) {
        console.log('Getting routes for user!!');
        setRoutesLoading(true);
        const fromToken = findToken(fromChainKey, fromTokenAddress);
        const toToken = findToken(toChainKey, toTokenAddress);
        const request: RoutesRequest = {
          fromChainId: fromToken.chainId,
          fromAmount: new BigNumber(depositAmount)
            .shiftedBy(fromToken.decimals)
            .toFixed(0),
          fromTokenAddress,
          toChainId: toToken.chainId,
          toTokenAddress,
          fromAddress: web3.account || undefined,
          toAddress: web3.account || undefined,
          // options: {
          //   order: optionOrder,
          //   slippage: optionSlippage / 100,
          //   bridges: {
          //     allow: optionEnabledBridges,
          //   },
          //   exchanges: {
          //     allow: optionEnabledExchanges,
          //   },
          // },
        };

        const id = uuid();
        try {
          currentRouteCallId = id;
          const result = await LiFi.getRoutes(request);
          console.log('result from getRoutes - ', result);
          setRouteCallResult({ result, id });
        } catch {
          if (id === currentRouteCallId || !currentRouteCallId) {
            setNoRoutesAvailable(true);
            setRoutesLoading(false);
          }
        }
      }
    };

    getTransferRoutes();
  }, [
    depositAmount,
    fromChainKey,
    fromTokenAddress,
    toChainKey,
    toTokenAddress,
    // optionOrder,
    // optionSlippage,
    // optionEnabledBridges,
    // optionEnabledExchanges,
    findToken,
  ]);

  const getSelectedWithdraw = () => {
    if (highlightedIndex === -1) {
      return {
        estimate: '0.0',
      };
    } else {
      const selectedRoute = routes[highlightedIndex];
      const lastStep = selectedRoute.steps[selectedRoute.steps.length - 1];
      return {
        estimate: formatTokenAmountOnly(
          lastStep.action.toToken,
          lastStep.estimate?.toAmount
        ),
        min: formatTokenAmount(
          lastStep.action.toToken,
          lastStep.estimate?.toAmountMin
        ),
      };
    }
  };

  return (
    <>
      <Content
        style={{
          minHeight: 'calc(100vh - 64px)',
          marginTop: '64px',
        }}
      >
        <div>
          <Row gutter={[16, 96]} style={{ paddingTop: 48 }}>
            <Col sm={24} lg={14}>
              <div>
                <Row>
                  <Title level={4}>Please Specify Your Transaction</Title>
                </Row>
                <SwapForm
                  depositChain={fromChainKey}
                  setDepositChain={setFromChainKey}
                  availableChains={availableChains}
                  withdrawChain={toChainKey}
                  setWithdrawChain={setToChainKey}
                  tokens={tokens}
                  balances={balances}
                  setDepositToken={setFromTokenAddress}
                  depositToken={fromTokenAddress}
                  setWithdrawToken={setToTokenAddress}
                  withdrawToken={toTokenAddress}
                  setDepositAmount={setDepositAmount}
                  depositAmount={depositAmount}
                  withdrawAmount={withdrawAmount}
                  setWithdrawAmount={setWithdrawAmount}
                  estimatedWithdrawAmount={getSelectedWithdraw().estimate}
                  estimatedMinWithdrawAmount={getSelectedWithdraw().min}
                />
                <Row style={{ marginTop: 24 }} justify={'center'}>
                  <Button style={{ width: '100%', height: '60px' }}>
                    Swap
                  </Button>
                </Row>
              </div>
            </Col>
            <Col sm={24} lg={10}>
              {routesLoading || noRoutesAvailable || routes.length ? (
                <RouteList
                  highlightedIndex={highlightedIndex}
                  routes={routes}
                  routesLoading={routesLoading}
                  noRoutesAvailable={noRoutesAvailable}
                  setHighlightedIndex={setHighlightedIndex}
                />
              ) : (
                <Row style={{ paddingTop: 48 }}>
                  <Title level={4} disabled>
                    To get available routes, input your desired tokens to swap.
                  </Title>
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </Content>
    </>
  );
}

export default Swap;
