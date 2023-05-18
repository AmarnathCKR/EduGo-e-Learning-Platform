import React, { useRef, useEffect, useState } from 'react';

import { faker } from '@faker-js/faker';
import { getAnyAdmin } from '../../../api/adminAPI';
import { useSelector } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
//   import faker from 'faker';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



function UserLineChart() {
    const [userData, setUser] = useState({
        student: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        instructor: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
    const [year, setYear] = useState(new Date().getFullYear())
    const [loading, setLoading] = useState(false)


    let data = {
        labels,
        datasets: [
          {
            label: 'Students',
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Instructors',
            data: [0,0,0,0,0,0,0,0,0,0,0,0],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
      
    

    if(userData.student){
         data = {
            labels,
            datasets: [
              {
                label: 'Students',
                data: userData.student,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: 'Instructors',
                data: userData.instructor,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
          };
          
    }

    const token = useSelector((state) => state.adminToken);


    useEffect(() => {
        setLoading(true)
        getAnyAdmin(`get-analytic?year=${year}`, token).then((res) => {
            setLoading(false)
            
            setUser((state) => ({ ...state, student: res.data.student[0].counts, instructor: res.data.instructor[0].counts }))
            
        }).catch((err) => {
           
            setLoading(false)
        })
    }, [year])


    
   

    return (
        <>{loading &&
            <div className="z-[999]  p-64 loader-local ">
                <CircleSpinner size={40} color="#000000"  />
            </div>}
            <p className='text-center text-xl font-semibold my-2'>User Statistics</p>
            <div className='grid md:grid-cols-2 text-sm grid-cols-1 '>
                <div><p>Students registered on {year} : {userData?.student?.reduce(function (x, y) {
                    return x + y;
                }, 0)}</p>
                    <p>Instructors registered on {year} : {userData?.instructor?.reduce(function (x, y) {
                        return x + y;
                    }, 0)}</p></div>

                <div className='flex justify-end items-center'>
                    <p>Choose a year :</p>
                    <select className='bg-slate-100 ml-2 rounded p-2' onChange={(e) => setYear(e.target.value)}>
                        <option value={new Date().getFullYear()} >{new Date().getFullYear()}</option>
                        <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>

                        <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>

                        <option value={new Date().getFullYear() - 3}>{new Date().getFullYear() - 3}</option>

                    </select>
                </div>
            </div>


            <div className="w-full h-full"><Line options={options} data={data} /></div>

        </>);
}


export default UserLineChart;