import { Content } from 'antd/lib/layout/layout';
import { Row, Col, Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import SwapForm from './SwapForm';

function Swap() {
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
            <Col sm={23} lg={23} xl={10}>
              <div>
                <Row>
                  <Title level={4}>Please Specify Your Transaction</Title>
                </Row>
                <SwapForm />
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
