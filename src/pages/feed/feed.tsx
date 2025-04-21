import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import {
  selectFeed,
  selectLoadingFeed,
  connectFeedWs,
  disconnectFeedWs
} from '../../services/reducers/feedSlice';
import { useSelector, useDispatch } from '../../services/store';
import { selectNewOrderIds } from '../../services/reducers/orderSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const isLoadingFeed = useSelector(selectLoadingFeed);
  const newOrderIds = useSelector(selectNewOrderIds);

  const FEED_WS_URL = 'wss://norma.nomoreparties.space/orders/all';

  // Подключение WebSocket для общей ленты заказов
  useEffect(() => {
    dispatch(connectFeedWs(FEED_WS_URL));
    return () => {
      dispatch(disconnectFeedWs());
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(disconnectFeedWs());
    dispatch(connectFeedWs(FEED_WS_URL));
  };

  if (isLoadingFeed || !feed || feed.orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feed.orders}
      handleGetFeeds={handleGetFeeds}
      newOrderIds={newOrderIds}
    />
  );
};
