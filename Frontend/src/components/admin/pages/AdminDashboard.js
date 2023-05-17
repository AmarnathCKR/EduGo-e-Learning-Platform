import React from 'react'
import Layout from '../layouts/Layout'
import { UserLineChart } from '../charts/UserLineChart';

function AdminDashboard() {
  const style = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3)), url("https://res.cloudinary.com/dqrpxoouq/image/upload/v1683623573/axe1hjkpnybiqoo5fkhb.jpg")`,
    backgroundPosition: "70% 0%",
    backgroundSize: "cover"
  };
  return (
    <>
      <Layout title="Admin Dashboard">
        <div className='ml-0 md:mt-0 mt-16 md:ml-[250px] h-screen p-3' style={style}>
          Admin Dashboard
          <div className='grid md:grid-cols-6 w-full grid-cols-1'>
            <div className='bg-white p-4 md:col-span-4 col-span-1 rounded'>

              <UserLineChart />
            </div>

          </div>
        </div>
      </Layout>
    </>
  )
}

export default AdminDashboard