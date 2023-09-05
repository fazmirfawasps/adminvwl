import { useEffect, useRef, useState } from "react";
import { chart as chartJs } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Chart } from "react-google-charts";
import { getDashboardData } from "../../services/dashboardServices";

const date = new Date();
const currYear = date.getFullYear();

const Home = () => {
  const [barChartData, setBarChartData] = useState(null);
  const MoneyFlow = useRef({ income: 0, expense: 0 });

  useEffect(() => {
    (async () => {
      const monthMap = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
      };
      const chartData = await getDashboardData();
      const transformedData = {};

      chartData.forEach((entry) => {
        const {
          totalAmount,
          _id: { month, year, expenseCategory },
        } = entry;

        if (year === currYear) {
          if (!transformedData[month]) {
            transformedData[month] = {
              month: monthMap[month],
              sales: 0,
              purchases: 0,
            };
          }
          if (expenseCategory === "Sales") {
            transformedData[month].sales += totalAmount;
            MoneyFlow.current.income = MoneyFlow.current.income + totalAmount;
          } else if (expenseCategory === "Purchases") {
            transformedData[month].purchases += totalAmount;
            MoneyFlow.current.expense = MoneyFlow.current.expense + totalAmount;
          }
        }
      });

      const result = Object.values(transformedData).map((entry) => {
        return [entry.month, entry.sales, entry.purchases];
      });

      result.unshift([currYear.toString(), "Income", "Expense"]);

      setBarChartData(result);
    })();
  }, []);

  const options = {
    chart: {
      title: "Income and Expense",
    },
    chartArea: {
      backgroundColor: {
        fill: "#FF0000",
        fillOpacity: 0.1,
      },
    },
    backgroundColor: {
      fill: "#FF0000",
      fillOpacity: 0.8,
    },
    colors: ["#25D27F", "#8153E2"],
    hAxis: {
      textPosition: "none",
      ticks: [],
    },
    legend: {
      position: "none",
    },
  };

  return (
    <>
      <div className="tw-w-[80vw] tw-mt-16 tw-bg-[#EEE7FF] ">
        <div className="tw-rounded-t-[30px] tw-min-h-[90vh] tw-bg-white tw-p-14">
          <div className="tw-flex tw-gap-14">
            <div className="tw-w-3/6 tw-flex tw-flex-col tw-gap-10">
              <div className="tw-flex tw-flex-col tw-justify-between tw-h-48 tw-p-8 tw-bg-[#FCFBFF] tw-rounded-3xl tw-shadow">
                <h3 className="tw-text-start">Total Receivables</h3>
                <div className="tw-w-full tw-h-2.5 tw-bg-[#FD7900]">
                  <div className="tw-w-[65%] tw-h-full tw-bg-[#25D27F]"></div>
                </div>
                <div className="tw-flex tw-gap-36">
                  <div>
                    <h5 className="tw-text-start tw-text-sm tw-text-[#25D27F]">
                      Current
                    </h5>
                    <h4 className="tw-text-start tw-text-[#545357] tw-font-semibold">
                      ₹40,000
                    </h4>
                  </div>
                  <div>
                    <h5 className="tw-text-start tw-text-sm tw-text-[#FD7900]">
                      Overdue
                    </h5>
                    <h4 className="tw-text-start tw-text-[#545357] tw-font-semibold">
                      ₹80,000
                    </h4>
                  </div>
                </div>
              </div>
              <div className="tw-flex tw-flex-col tw-justify-between tw-h-48 tw-p-8 tw-bg-[#FCFBFF] tw-rounded-3xl tw-shadow">
                <h3 className="tw-text-start">Total Payables</h3>
                <div className="tw-w-full tw-h-2.5 tw-bg-[#FD7900]">
                  <div className="tw-w-[80%] tw-h-full tw-bg-[#25D27F]"></div>
                </div>
                <div className="tw-flex tw-gap-36">
                  <div>
                    <h5 className="tw-text-start tw-text-sm tw-text-[#25D27F]">
                      Current
                    </h5>
                    <h4 className="tw-text-start tw-text-[#545357] tw-font-semibold">
                      ₹40,000
                    </h4>
                  </div>
                  <div>
                    <h5 className="tw-text-start tw-text-sm tw-text-[#FD7900]">
                      Overdue
                    </h5>
                    <h4 className="tw-text-start tw-text-[#545357] tw-font-semibold">
                      ₹80,000
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-w-3/6 tw-p-8 tw-bg-[#FCFBFF] tw-rounded-3xl tw-shadow">
              {barChartData && (
                <Chart
                  chartType="Bar"
                  height="300px"
                  data={barChartData}
                  options={options}
                />
              )}
              <div className="tw-flex tw-justify-between tw-mt-2">
                <div className="tw-p-2">
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <span className="tw-w-9 tw-h-2.5 tw-bg-[#25D27F]"></span>
                    <h6 className="tw-text-xs">Income</h6>
                  </div>
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <span className="tw-w-9 tw-h-2.5 tw-bg-[#8153E2]"></span>
                    <h6 className="tw-text-xs">Expense</h6>
                  </div>
                </div>
                <div>
                  <h5 className="tw-text-start tw-text-sm tw-text-[#828087]">
                    Total Income
                  </h5>
                  <h4 className="tw-text-start tw-text-[#545357] tw-font-semibold">
                    ₹{MoneyFlow.current.income}
                  </h4>
                </div>
                <div>
                  <h5 className="tw-text-start tw-text-sm tw-text-[#828087]">
                    Total Expense
                  </h5>
                  <h4 className="tw-text-start tw-text-[#545357] tw-font-semibold">
                    ₹{MoneyFlow.current.expense}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
