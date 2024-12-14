import React, { useState } from "react";
import Mainlayout from "../Layouts/Mainlayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextsAuthsecurity/AuthContext";
import {
  UilUniversity,
  UilUsersAlt,
  UilBookAlt,
} from "@iconscout/react-unicons";
import styles from "./Dashboard.module.css";
import ReactApexChart from "react-apexcharts";

export default function Dashboard() {
  const [chartData] = useState({
    series: [
      { name: "Students", data: [120, 150, 180, 220, 300] },
      { name: "Schools", data: [15, 20, 25, 30, 40] },
    ],
    options: {
      chart: {
        type: "bar",
        // height: 150,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "55%", endingShape: "rounded" },
      },
      xaxis: {
        categories: ["Season1", "Season2", "Season3", "Season4", "Season5"],
      },
      colors: ["#1230AE", "#6E7DAB"],
      fill: { opacity: 1, gradient: { shade: "dark", type: "vertical" } },
      dataLabels: { enabled: false },
    },
  });
  const [donutData] = useState([
    {
      title: "Stock OMR",
      series: [60, 40],
      labels: ["Available", "Used"],
    },
    {
      title: "Stock Book",
      series: [70, 30],
      labels: ["Available", "Used"],
    },
    {
      title: "Stock Prizes",
      series: [50, 50],
      labels: ["Available", "Used"],
    },
  ]);
  const metrics = [
    {
      title: "Total Schools Registered",
      value: 500,
      icon: <UilUniversity size="40" color="#1230AE" />,
    },
    {
      title: "Total Students Registered",
      value: 20000,
      icon: <UilUsersAlt size="40" color="#6E7DAB" />,
    },
    {
      title: "Active Students in Exams",
      value: 15000,
      icon: <UilBookAlt size="40" color="#1230AE" />,
    },
    {
      title: "Inventories",
      value: 450,
      icon: <UilUniversity size="40" color="#6E7DAB" />,
    },
  ];

  return (
    <Mainlayout>
      <div className="my-3">
        <h3 className="m-0">Welcome To Gowbell</h3>
        <p className="mb-4 p-0">
          Empowering exam management with seamless solutions.
        </p>
      </div>
      <div className="row">
        {/* {/ Bar Chart /} */}
        <div className="col-lg-7 col-sm-12 mb-4">
          <div className={`${styles.chartdiv} p-3 `}>
            <h5 className={`${styles.header}`}>
              Registrations Per Exam Season
            </h5>
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={300}
            />
          </div>
        </div>

        <div className="col-lg-5 col-sm-12">
          <div className="row">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`${styles.metricCard} col-md-6 mx-2 mb-2`}
              >
                <div className="text-center p-3">
                  <div className="mb-2">{metric.icon}</div>
                  <h6>{metric.title}</h6>
                  <p>{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    
    </Mainlayout>
  );
}