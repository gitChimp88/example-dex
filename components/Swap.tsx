import { useState, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import { Row, Col, Button } from 'antd';
import { useChainsTokensTools } from './providers/chainsTokensToolsProvider'
import Title from 'antd/lib/typography/Title';
import SwapForm from './SwapForm';
import {
  ChainKey,
  Chain,
} from './types'

function Swap() {
  const chainsTokensTools = useChainsTokensTools()
  const [fromChainKey, setFromChainKey] = useState<ChainKey | undefined>()
  const [availableChains, setAvailableChains] = useState<Chain[]>(chainsTokensTools.chains)

  // get chains
  useEffect(() => {
    console.log("chains from lifi - ", chainsTokensTools.chains)
    setAvailableChains(chainsTokensTools.chains)

    // load()
  }, [chainsTokensTools.chains])

  return (
    <>
      <Content
        style={{
          minHeight: 'calc(100vh - 64px)',
          marginTop: '64px',
        }}
      >
        <div>
          <Row
            gutter={[16, 96]}
            style={{ paddingTop: 48 }}
            justify="space-around"
          >
            <Col sm={23} lg={23}>
              <div>
                <Row>
                  <Title level={4}>Please Specify Your Transaction</Title>
                </Row>
                <SwapForm 
                  depositChain={fromChainKey}
                  setDepositChain={setFromChainKey}
                  availableChains={availableChains}
                />
                <Row style={{ marginTop: 24 }} justify={'center'}>
                  <Button style={{ width: '100%', height: '60px' }}>
                    Swap
                  </Button>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </>
  );
}

export default Swap;
