import { FC, memo } from 'react';
import styles from './feed.module.css';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';
import clsx from 'clsx';

interface ExtendedFeedUIProps extends FeedUIProps {
  newOrderIds: string[];
}

export const FeedUI: FC<ExtendedFeedUIProps> = memo(
  ({ orders, handleGetFeeds, newOrderIds, isRefreshing = false }) => (
    <main className={styles.containerMain}>
      <div className={clsx(styles.titleBox, 'mt-10 mb-5')}>
        <h1 className={clsx(styles.title, 'text text_type_main-large')}>
          Лента заказов
        </h1>
        <RefreshButton
          text={isRefreshing ? 'Обновляется' : 'Обновить'}
          onClick={isRefreshing ? () => {} : handleGetFeeds}
          extraClass='ml-30'
        />
      </div>
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          <OrdersList orders={orders} newOrderIds={newOrderIds} />
        </div>
        <div className={styles.columnInfo}>
          <FeedInfo />
        </div>
      </div>
    </main>
  )
);
