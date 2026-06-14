import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import { ShippingAddress } from '@/types';
import OrderDetailsTable from './order-details-table';

export const metadata = { title: 'جزییات سفارش' };

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const result = await getOrderById(id);
  if (!result.success || !result.order) notFound();

  return (
    <OrderDetailsTable
      order={{
        ...result.order,
        shippingAddress: result.order.shippingAddress as ShippingAddress,
      }}
    />
  );
};

export default OrderDetailsPage;