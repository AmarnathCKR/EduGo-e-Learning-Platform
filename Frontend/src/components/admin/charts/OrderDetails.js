import React, { useEffect, useState } from 'react'
import { getAnyAdmin } from '../../../api/adminAPI'

function OrderDetails(props) {
    const [data, setData] = useState()
    useEffect(() => {
        props.setLoading(true)
        getAnyAdmin("get-all", props.token)
            .then((res) => {
                setData(res.data)
                props.setLoading(false)
            }).catch((err) => {
                console.log(err)
                props.setLoading(false)
            })
    })
    return (
        <div className='w-full overflow-x-auto my-6 bg-neutral-200 md:p-10 p-2'>
            <div className='flex md:flex-row gap-3 flex-col'>
                
                <span className='my-2'><strong>Number of Enrollment :</strong> {data?.orders?.length}</span>
            </div>
            <table className='w-full p-3'>
                <thead className='text-start border border-white p-5'>
                    <th className='text-start  p-2 m-2'>Enrollment Id</th>
                    <th className='text-start p-2 m-2 border-l border-white'>Student</th>
                    <th className='text-start p-2 m-2 border-l border-white'>Enrollment Date</th>
                    <th className='text-start p-2 m-2 border-l border-white'>Payment Received</th>
                </thead>
                <tbody className='text-start border border-white p-5'>
                    {data?.orders?.map((items) => {
                        return (<tr className='text-start p-2 m-2' key={items._id}>
                            <td className='text-start p-2 m-2 border-b border-white'>{items.orderId}</td>
                            <td className='text-start p-2 m-2 border-l border-white border-b'>{items.user.name}</td>
                            <td className='text-start p-2 m-2 border-l border-white border-b'>{new Date(items.createdAt).toLocaleDateString('en-GB')}</td>
                            <td className='text-start p-2 m-2 border-l border-white border-b'>{items.amount- (5/100)*items.amount}</td>
                        </tr>)

                    })}
                </tbody>
            </table>

        </div>
    )
}

export default OrderDetails