import React, { useRef, useEffect, useState } from 'react';
import { ChartData, ChartArea } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { getAnyAdmin } from '../../../api/adminAPI';
import { useSelector } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const colors = [
    'red',
    'orange',
    'yellow',
    'lime',
    'green',
    'teal',
    'blue',
    'purple',
];



function createGradient(ctx, area) {
    const colorStart = faker.color.rgb();

    const colorMid = faker.color.rgb(colors.filter(color => color !== colorStart))


    const colorEnd = faker.color.rgb(
        colors.filter(color => color !== colorStart && color !== colorMid)
    );

    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(0.5, colorMid);
    gradient.addColorStop(1, colorEnd);

    return gradient;
}

export function UserLineChart() {
    const [userData, setUser] = useState({
        student: [],
        instructor: []
    })
    const [year, setYear] = useState(new Date().getFullYear())
    const [loading, setLoading] = useState(false)


    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    const token = useSelector((state) => state.adminToken);


    useEffect(() => {
        setLoading(true)
        getAnyAdmin(`get-analytic?year=${year}`, token).then((res) => {
            console.log(res.data.student[0].counts)
            setUser((state) => ({ ...state, student: res.data.student[0].counts, instructor: res.data.instructor[0].counts }))
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }, [year])
    const data = {
        labels,
        datasets: [
            {
                label: 'Student',

                data: userData?.student,
            },
            {
                label: 'Instructor',
                data: userData?.instructor,
            },
        ],
    };

    useEffect(() => {
        const chart = chartRef.current;

        if (!chart) {
            return;
        }

        const chartData = {
            ...data,
            datasets: data.datasets.map(dataset => ({
                ...dataset,
                borderColor: createGradient(chart.ctx, chart.chartArea),
            })),
        };

        setChartData(chartData);
    }, [userData]);

    return (
        <>{loading &&
            <div className="z-[999]  p-64 loader-local ">
              <CircleSpinner size={40} color="#000000" loading={loading} />
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
                    <select className='bg-slate-100 ml-2 rounded p-2' onChange={(e)=>setYear(e.target.value)}>
                        <option value={new Date().getFullYear()} >{new Date().getFullYear()}</option>
                        <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>

                        <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>

                        <option value={new Date().getFullYear() - 3}>{new Date().getFullYear() - 3}</option>

                    </select>
                </div>
            </div>


            <Chart ref={chartRef} type='line' data={chartData} />

        </>);
}
