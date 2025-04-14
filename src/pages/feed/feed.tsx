import { FC, useEffect, useState } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import {
  selectFeed,
  selectLoadingFeed,
  selectWsConnected,
  connectFeedWs
} from '../../services/reducers/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const isLoadingFeed = useSelector(selectLoadingFeed);
  const wsConnected = useSelector(selectWsConnected);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = 'wss://norma.nomoreparties.space/orders/all';
    if (!ws) {
      const websocket = new WebSocket(wsUrl);
      setWs(websocket);
      dispatch(connectFeedWs(wsUrl));
    }

    return () => {
      if (ws) {
        ws.close();
        setWs(null);
      }
    };
  }, [dispatch, ws]);

  const handleGetFeeds = () => {
    if (wsConnected && ws) {
      ws.close();
      setWs(null);
    }
  };

  if (isLoadingFeed || !feed || feed.orders.length === 0) {
    return <Preloader />;
  }

  return <FeedUI orders={feed.orders} handleGetFeeds={handleGetFeeds} />;
};
