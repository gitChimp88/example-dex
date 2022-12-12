import { Route as RouteType } from '@lifi/sdk';
import { Col, Row, Typography, Spin } from 'antd';
import { animate, stagger } from 'motion';
import { useEffect, useRef } from 'react';
import RouteCard from './RouteCard';

const fadeInAnimation = (
  element: React.MutableRefObject<HTMLDivElement | null>
) => {
  setTimeout(() => {
    const nodes = element.current?.childNodes;
    if (nodes) {
      animate(
        nodes as NodeListOf<Element>,
        {
          y: ['50px', '0px'],
          opacity: [0, 1],
        },
        {
          delay: stagger(0.2),
          duration: 0.5,
          easing: 'ease-in-out',
        }
      );
    }
  }, 0);
};

interface RouteCarouselProps {
  highlightedIndex: number;
  routes: RouteType[];
  routesLoading: boolean;
  noRoutesAvailable: boolean;
  setHighlightedIndex: Function;
}

export const RouteList = ({
  highlightedIndex,
  routes,
  routesLoading,
  noRoutesAvailable,
  setHighlightedIndex,
}: RouteCarouselProps) => {
  // Elements used for animations
  const routeCards = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (routes.length) {
      fadeInAnimation(routeCards);
    }
  }, [routes]);

  return (
    <>
      {routes.length > 0 && (
        <Col span={24} style={{ padding: 0 }}>
          <div ref={routeCards}>
            {routes.map((route, index) => {
              return (
                <RouteCard
                  key={index}
                  route={route}
                  selected={highlightedIndex === index}
                  onSelect={() => setHighlightedIndex(index)}
                />
              );
            })}
          </div>
        </Col>
      )}
      {routesLoading && !routes.length && (
        <Row
          justify={'center'}
          align="middle"
          style={{ height: 200, width: 400 }}
        >
          <Spin></Spin>
        </Row>
      )}
      {!routesLoading && noRoutesAvailable && (
        <Col span={24} className="no-routes-found">
          <h3 style={{ textAlign: 'left' }}>No Route Found</h3>
          <Typography.Text type="secondary" style={{ textAlign: 'left' }}>
            We couldn't find suitable routes for your desired transfer. We do
            have some suggestions why that could be: <br />
          </Typography.Text>
          <Typography.Paragraph style={{ color: 'grey', marginTop: 24 }}>
            A route for this transaction does not exist yet possibly due to
            liquidity issues or because the amount of tokens you are sending is
            below the bridge minimum amount. Please try again later or change
            the tokens you intend to swap. If the problem persists, come to our
            Discord and leave a message in the support channel.
          </Typography.Paragraph>
        </Col>
      )}
    </>
  );
};
