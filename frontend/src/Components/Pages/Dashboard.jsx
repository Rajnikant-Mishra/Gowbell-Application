import React, { useState, useRef } from "react";
import Chart from "react-apexcharts";
import Mainlayout from "../Layouts/Mainlayout";
import styles from "./Dashboard.module.css";
import cardimg1 from "../../../public/Path 195.svg";
import cardimg2 from "../../../public/Path 196.svg";
import cardimg3 from "../../../public/Path 197.svg";
import cardimg4 from "../../../public/Path 198.svg";
import { UilCalender, UilUser, UilAngleDown } from "@iconscout/react-unicons";

const Dashboard = () => {
  const scrollWrapperRef = useRef(null);
  const listRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const notificationRefs = useRef([]);

  const [activeFilter, setActiveFilter] = useState("year");
  const chartData = {
    all: [
      {
        name: "2020",
        data: [100, 200, 150, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
      },
      {
        name: "2021",
        data: [200, 300, 250, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
      },
      {
        name: "2022",
        data: [300, 400, 350, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
      },
      {
        name: "2023",
        data: [400, 500, 450, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400],
      },
    ],
    year: [
      {
        name: "2024",
        data: [250, 300, 200, 400, 300, 350, 480, 550, 450, 400, 300, 200],
      },
    ],
    week: [{ name: "Week", data: [50, 70, 90, 110, 130, 150, 170] }],
    today: [{ name: "Today", data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }],
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const chartOptions = {
    chart: { id: "student-participation", toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: "end",
        columnWidth: "25%",
      },
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    xaxis: {
      categories:
        activeFilter === "today"
          ? [
              "6 AM",
              "8 AM",
              "10 AM",
              "12 PM",
              "2 PM",
              "4 PM",
              "6 PM",
              "8 PM",
              "10 PM",
              "12 AM",
            ]
          : activeFilter === "week"
          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          : [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        gradientToColors: ["#508FF4"],
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: "#83C9FC", opacity: 1 },
          { offset: 70, color: "#508FF4", opacity: 1 },
        ],
      },
    },
    grid: { borderColor: "#F1F1F1" },
    yaxis: {
      labels: {
        formatter: function (val) {
          return "$ " + val;
        },
      },
    },
    colors:
      activeFilter === "all"
        ? ["#FF5733", "#33B5E5", "#FFBD33", "#7D33FF"] // Respective year colors
        : ["#508FF4"],
  };

  const chartSeries = [
    {
      name: "Participation",
      data: [200, 450, 300, 500, 400, 250, 480, 550, 450, 400, 50, 230],
    },
  ];

  const notifications = [
    {
      title: "Result uploaded for Science Quiz",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "New school added: The Sunsign High",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Exam Created: Math Olympiad",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Result uploaded for Science Quiz",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "New school added: The Sunsign High",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Exam Created: Math Olympiad",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Admin",
    },
    {
      title: "Certificates Generated for History",
      date: "10-09-2024",
      author: "By Asarita",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextNotification = () => {
    const nextIndex = (currentIndex + 1) % notifications.length;
    setCurrentIndex(nextIndex); // Update the current index to the next notification

    // Scroll to the next notification
    if (notificationRefs.current[nextIndex]) {
      notificationRefs.current[nextIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest", // Align the notification to the nearest position
      });
    }
  };

  return (
    <Mainlayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.cardsContainer}>
          <div className={`${styles.card} ${styles.totalExams}`}>
            <h3>Total Exams</h3>
            <hr />
            <div className="d-flex gap-3">
              <img src={cardimg1} alt="cardimg1" />
              <h1 className="my-auto">403,813</h1>
            </div>
          </div>
          <div className={`${styles.card} ${styles.totalStudents}`}>
            <h3>Total Students</h3>
            <hr />
            <div className="d-flex ">
              <img src={cardimg2} alt="cardimg2" />
              <h1 className="my-auto">4,846</h1>
            </div>
          </div>
          <div className={`${styles.card} ${styles.averageScores}`}>
            <h3>Average Scores</h3>
            <hr />
            <div className="d-flex gap-3">
              <img src={cardimg3} alt="cardimg3" />
              <h1 className="my-auto">84%</h1>
            </div>
          </div>
          <div className={`${styles.card} ${styles.activeUsers}`}>
            <h3>Active Users Today</h3>
            <hr />
            <div className="d-flex gap-3">
              <img src={cardimg4} alt="cardimg4" />
              <h1 className="my-auto">48.464131</h1>
            </div>
          </div>
        </div>

        <div className={styles.midSection}>
          <div className={styles.chartContainer}>
            <h3>Student Participation</h3>
            <div className={styles.filterButtons}>
              <button
                className={activeFilter === "year" ? styles.active : ""}
                onClick={() => handleFilterChange("year")}
              >
                This year
              </button>
              <button
                className={activeFilter === "week" ? styles.active : ""}
                onClick={() => handleFilterChange("week")}
              >
                This week
              </button>
              <button
                className={activeFilter === "today" ? styles.active : ""}
                onClick={() => handleFilterChange("today")}
              >
                Today
              </button>
              <button
                className={activeFilter === "all" ? styles.active : ""}
                onClick={() => handleFilterChange("all")}
              >
                All time
              </button>
            </div>
            <Chart
              options={chartOptions}
              series={chartData[activeFilter]}
              type="bar"
              height="180"
            />
          </div>

          <div className={styles.midSectionSecondDiv}>
            <div className={styles.prizeContainer}>
              <h3>Prize Distribution</h3>
              <div
                className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
              >
                <p className="my-auto">Gold</p>
                <span>30%</span>
              </div>
              <div className={styles.prizeItem}>
                <div className={styles.progress}>
                  <div
                    style={{ width: "30%", backgroundColor: "#F8C900" }}
                  ></div>
                </div>
              </div>

              <div
                className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
              >
                <p className="my-auto">Silver</p>
                <span>45%</span>
              </div>
              <div className={styles.prizeItem}>
                <div className={styles.progress}>
                  <div
                    style={{ width: "45%", backgroundColor: "#C4C4C4" }}
                  ></div>
                </div>
              </div>
              <div
                className={`${styles.prizeItem} d-flex justify-content-between mb-0`}
              >
                <p className="my-auto">Bronze</p>
                <span>25%</span>
              </div>
              <div className={styles.prizeItem}>
                <div className={styles.progress}>
                  <div
                    style={{ width: "25%", backgroundColor: "#8676DE" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className={styles.activityLog}>
              <h3>Recent Activity Log</h3>
              <div className={styles.scrollWrapper} ref={scrollWrapperRef}>
                <ul className={styles.customlist}>
                  {notifications.map((item, index) => (
                    <li
                      className="d-flex flex-column"
                      key={index}
                      ref={(el) => (notificationRefs.current[index] = el)}
                    >
                      <span>{item.title}</span>
                      <div className="d-flex gap-3">
                        <span className="d-flex">
                          <UilCalender
                            className={`${styles.calender} my-auto`}
                          />
                          <p className="my-auto">{item.date}</p>
                        </span>
                        <span className="d-flex">
                          <UilUser className={`${styles.calender} my-auto`} />
                          <p className="my-auto">{item.author}</p>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.notificationButtonDiv}>
                <button
                  onClick={handleNextNotification}
                  className={styles.scrollButton}
                >
                  <UilAngleDown />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
};

export default Dashboard;