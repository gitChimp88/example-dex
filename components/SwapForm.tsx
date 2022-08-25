import { Row, Col, Form, Select, Input, Button } from 'antd';
const { Option } = Select;
function SwapForm() {
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
              <Select defaultValue="Ethereum" style={{ width: 120 }}>
                <Option value="Ethereum">Ethereum</Option>
                <Option value="Bsc">Bsc</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
                <Option value="Polygon">Polygon</Option>
              </Select>
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                borderTopLeftRadius: '0px !important',
                borderBottomLeftRadius: '0px !important',
              }}
            >
              <Select defaultValue="Ethereum" style={{ width: 120 }}>
                <Option value="Ethereum">Eth</Option>
                <Option value="Matic">Matic</Option>
              </Select>
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
                <Select defaultValue="Ethereum" style={{ width: 120 }}>
                  <Option value="Ethereum">Ethereum</Option>
                  <Option value="Bsc">Bsc</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Polygon">Polygon</Option>
                </Select>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Select defaultValue="Ethereum" style={{ width: 120 }}>
                  <Option value="Ethereum">Eth</Option>
                  <Option value="Matic">Matic</Option>
                </Select>
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
                />
              </div>
            </Col>
          </Row>
        </>
      </Form>
    </>
  );
}

export default SwapForm;