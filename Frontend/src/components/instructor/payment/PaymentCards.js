import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getAnyData } from '../../../api/instructorAPI';

function PaymentCards(props) {
    const [payment, setPayment] = useState([])
    const token = useSelector((state) => state.token);
    useEffect(() => {
        getAnyData(`get-payment?courseId=${props?.course}`, token).then((res) => {

            setPayment(res.data.orders)
        })
    }, [])
    return (
        <div className='w-full my-3 md:p-10 p-2'>{payment !== [] && <>
            <table className='w-full overflow-x-auto'>
                <thead className='text-start'>
                    <th className='text-start'>OrderId</th>
                    <th className='text-start'>Student</th>
                    <th className='text-start'>Order Date</th>
                    <th className='text-start'>Payment Received</th>
                </thead>
                <tbody className='text-start'>
                    {payment?.map((items) => {
                        return (<tr className='text-start' key={items._id}>
                            <td className='text-start'>{items.orderId}</td>
                            <td className='text-start'>{items.user.name}</td>
                            <td className='text-start'>{items.createdAt}</td>
                            <td className='text-start'>{items.amount}</td>
                        </tr>)

                    })}
                </tbody>
            </table>

        </>}</div>
    )
}

export default PaymentCards