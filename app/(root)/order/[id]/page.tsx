import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import OrderDetailsTable from './order-details-table';

export const metadata = { title: 'جزییات سفارش' };

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
    const { id } = await props.params;
    const result = await getOrderById(id);

    if (!result.success || !result.order) {
        notFound();
    }

    // 💥 راه حل نهایی: ignore type error
    // @ts-ignore
    return <OrderDetailsTable order={result.order} />;
};

export default OrderDetailsPage;