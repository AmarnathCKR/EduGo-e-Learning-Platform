import React, { useEffect, useState } from 'react'
import Layout from '../layouts/Layout'
import { UserLineChart } from '../charts/UserLineChart';
import { BsPersonBadge } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { getAnyAdmin } from '../../../api/adminAPI';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { FiCloudDrizzle } from 'react-icons/fi';
import { BiBook } from 'react-icons/bi';
import OrderDetails from '../charts/OrderDetails';
import { CircleSpinner } from 'react-spinners-kit';

function AdminDashboard() {
  const [userDetails, setUser] = useState();
  const [loading, setLoading] =useState(false)

  
  const token = useSelector((state) => state.adminToken);

  useEffect(() => {
    setLoading(true)
    getAnyAdmin("get-users", token).then((res) => {
      setUser(res.data)
      setLoading(false)
    }).catch((err) => {
      console.log(err)
      setLoading(false)
    })
  }, [])
  return (
    <>
      <Layout title="Admin Dashboard">
      {loading &&
            <div className="z-[999]  p-64 loader-local ">
              <CircleSpinner size={40} color="#000000" loading={loading} />
            </div>}
        <div className='ml-0 md:mt-0 mt-16 md:ml-[250px] h-full p-3 bg-neutral-900' >

          <div className='grid md:grid-cols-6 w-full gap-3 grid-cols-1'>
            <div className='bg-white p-4 md:col-span-4 col-span-1 rounded'>

              <UserLineChart />

            </div>
            <div className='h-full bg-white rounded text-lg font-semibold flex flex-col md:col-span-2 col-span-1 p-2'>
              <div className='flex items-center my-5 p-5 '>
                <div className='pr-10'>
                  <BsPersonBadge size="50px" />
                </div>
                <div className='flex justify-between'>
                <p>Total Users :</p>
                 <p>{userDetails?.total}</p>
                </div>
              </div>
              <div className='flex items-center my-5 p-5 '>
                <div className='pr-10'>
                  <FaChalkboardTeacher size="50px" />
                </div>
                <div className='flex justify-between'>
                  <p>Total Instructors :</p>
                  <p>{userDetails?.instructor}</p>
                </div>
              </div>
              <div className='flex items-center my-5 p-5 '>
                <div className='pr-10'>
                  <FaUserGraduate size="50px" />
                </div>
                <div className='flex justify-between'>
                  <p>Total Students :</p>
                  <p>{userDetails?.student}</p>
                </div>
              </div>
              <div className='flex items-center my-5 p-5 '>
                <div className='pr-10'>
                  <BiBook size="50px" />
                </div>
                <div className='flex justify-between'>
                  <p>Total Courses :</p>
                  <p>{userDetails?.course}</p>
                </div>
              </div>
            </div>

          </div>
          <div className='flex flex-col text-sm items-center bg-white rounded my-5'>
            <p className='text-center font-bold my-4 text-lg'>Profit from Course enrollments</p>
            <div className='flex flex-col items-center w-full'>
              <OrderDetails token={token} setLoading={setLoading} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default AdminDashboard