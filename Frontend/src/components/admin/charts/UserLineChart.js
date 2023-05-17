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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September','October', 'November','December'];
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

export const data = {
    labels,
    datasets: [
        {
            label: 'Student',

            data: [100, 300, 200, 400,500, 150,220,1000,700,350,780,200 ],
        },
        {
            label: 'Instructor',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        },
    ],
};

function createGradient(ctx, area) {
    const colorStart = faker.color.human();

    const colorMid = faker.color.human(colors.filter(color => color !== colorStart))


    const colorEnd = faker.color.human(
        colors.filter(color => color !== colorStart && color !== colorMid)
    );

    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(0.5, colorMid);
    gradient.addColorStop(1, colorEnd);

    return gradient;
}

export function UserLineChart() {


    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        datasets: [],
    });

  const token = useSelector((state) => state.adminToken);


    useEffect(()=>{
        getAnyAdmin("get-analytic?year=2023",token).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

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
    }, []);

    return <Chart ref={chartRef} type='line' data={chartData} />;
}
