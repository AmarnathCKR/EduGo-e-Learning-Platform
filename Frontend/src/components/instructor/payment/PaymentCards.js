import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getAnyData } from '../../../api/instructorAPI';

function PaymentCards(props) {
    const [payment, setPayment] = useState([])
    const token = useSelector((state) => state.token);
    useEffect(() => {
        getAnyData(`get-payment?courseId=${props?.course?._id}`, token).then((res) => {

            setPayment(res.data.orders)
        })
    }, [])
    return (
        <div className='w-full overflow-x-auto my-6 bg-neutral-200 md:p-10 p-2'>
            <div className='flex md:flex-row gap-3 flex-col'>
                <p className='my-2'><strong>Course Name :</strong> {props?.course?.name}</p>
                <span className='my-2'><strong>Number of Enrollment :</strong> {payment?.length}</span>
            </div>
            
            
            {payment !== [] ? <>
        
            <table className='w-full p-3'>
                <thead className='text-start border border-white p-5'>
                    <th className='text-start  p-2 m-2'>Enrollment Id</th>
                    <th className='text-start p-2 m-2 border-l border-white'>Student</th>
                    <th className='text-start p-2 m-2 border-l border-white'>Enrollment Date</th>
                    <th className='text-start p-2 m-2 border-l border-white'>Payment Received</th>
                </thead>
                <tbody className='text-start border border-white p-5'>
                    {payment?.map((items) => {
                        return (<tr className='text-start p-2 m-2' key={items._id}>
                            <td className='text-start p-2 m-2 border-b border-white'>{items.orderId}</td>
                            <td className='text-start p-2 m-2 border-l border-white border-b'>{items.user.name}</td>
                            <td className='text-start p-2 m-2 border-l border-white border-b'>{new Date(items.createdAt).toLocaleDateString('en-GB')}</td>
                            <td className='text-start p-2 m-2 border-l border-white border-b'>{items.amount}</td>
                        </tr>)

                    })}
                </tbody>
            </table>

        </> : <p className='mx-3 my-3 text-center text-xl font-bold'>No Enrollements found</p>}</div>
    )
}

export default PaymentCards