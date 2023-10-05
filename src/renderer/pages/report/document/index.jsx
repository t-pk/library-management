import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Form, Button } from 'antd';
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import cloneDeep from 'lodash.clonedeep';
import { Borrow, Return, Remind, Penalty, Document } from '../../../constants';
import { formatDateTime } from 'renderer/utils/helper';

ChartJS.register(CategoryScale, LinearScale,PointElement, BarElement, LineElement, Title, Tooltip, Legend);

const formItemLayout = {
  labelCol: { xs: { span: 95 }, sm: { span: 95 } },
  wrapperCol: { xs: { span: 95 }, sm: { span: 95 } },
};

const widthStyle = { minWidth: '95%' };

const options = {
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

const DocumentReportPage = (props) => {
  const [borrows, setBorrrows] = useState({ labels: [], datasets: [] });
  const [borrowOpts, setBorrowOpts] = useState({ labels: [], datasets: [] });
  const [returnOpts, setReturnOpts] = useState({ labels: [], datasets: [] });
  const [remindOpts, setRemindOpts] = useState({ labels: [], datasets: [] });
  const [penaltyOpts, setPenaltyOpts] = useState({ labels: [], datasets: [] });

  const [returns, setReturns] = useState({ labels: [], datasets: [] });
  const [reminds, setReminds] = useState({ labels: [], datasets: [] });
  const [penalties, setPenalties] = useState({ labels: [], datasets: [] });

  const labels = [];

  useEffect(() => {
    getDataReport();
  }, []);

  const getDataReport = async () => {
    const iData = {
      labels,
      datasets: [
        {
          label: 'Mượn',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Mượn',
          data: [],
          borderColor: 'white',
          backgroundColor: 'rgb(75, 192, 192)',
        },
        {
          label: 'Trung Bình',
          type: 'line',
          backgroundColor: 'blue',
          borderColor: 'red',
          fill: true,
          data: [1,2,3,4,5,6,7,8,9],
          cubicInterpolationMode: 'monotone', // Use 'monotone' for smooth lines

        }
      ],
    };
    const borrow = await props.invoke({ key: Document.report });
    const borrowReports = cloneDeep(iData);
    borrowReports.labels = borrow.data.labels;
    borrowReports.datasets[0].data = borrow.data.borrowValues;
    borrowReports.datasets[0].label = 'Tổng Tài Liệu Mượn';
    borrowReports.datasets[1].data = borrow.data.returnValues;
    borrowReports.datasets[1].label = 'Tổng Tài Liệu Trả';
 
 
    borrowReports.datasets[2].data = borrow.data.avgValues;


    const iBorrowOpts = cloneDeep(options);
    iBorrowOpts.plugins.title.text = 'Thống Kê Tài Liệu';
    setBorrowOpts(iBorrowOpts);
    setBorrrows(borrowReports);

    // const returns = await props.invoke({ key: Return.report });
    // const returnReport = cloneDeep(iData);
    // returnReport.labels = returns.data.labels;
    // returnReport.datasets[0].data = returns.data.values;
    // returnReport.datasets[0].label = 'Số Phiếu Trả';
    // returnReport.datasets[0].borderColor = '#35EA95';
    // returnReport.datasets[0].backgroundColor = '#77FEBE';
    // const iReturnOpts = cloneDeep(options);
    // iReturnOpts.plugins.title.text = 'Thống Kê Phiếu Trả';
    // setReturnOpts(iReturnOpts);
    // setReturns(returnReport);

    // const reminds = await props.invoke({ key: Remind.report });
    // const remindReport = cloneDeep(iData);
    // remindReport.labels = reminds.data.labels;
    // remindReport.datasets[0].data = reminds.data.values;
    // remindReport.datasets[0].label = 'Số Phiếu Nhắc Nhở';
    // remindReport.datasets[0].borderColor = '#FCD433';
    // remindReport.datasets[0].backgroundColor = '#FFE88D';
    // const iRemindOpts = cloneDeep(options);
    // iRemindOpts.plugins.title.text = 'Thống Kê Phiếu Nhắc Nhở';
    // setRemindOpts(iRemindOpts);
    // setReminds(remindReport);

    // const penalty = await props.invoke({ key: Penalty.report });
    // const penaltyReport = cloneDeep(iData);
    // penaltyReport.labels = penalty.data.labels;
    // penaltyReport.datasets[0].data = penalty.data.values;
    // penaltyReport.datasets[0].label = 'Số Phiếu Phạt';
    // const iPenaltyOpts = cloneDeep(options);
    // iPenaltyOpts.plugins.title.text = 'Thống Kê Phiếu Phạt';
    // setPenaltyOpts(iPenaltyOpts);
    // setPenalties(penaltyReport);
  };

  const exportReportToImage = (e) => {
    let input = window.document.getElementsByClassName('export-image')[0];
    html2canvas(input).then((canvas) => {
      const img = canvas.toDataURL('image/jpeg');
      const downloadLink = document.createElement('a');
      downloadLink.href = img;
      downloadLink.download = `report-phieu-${formatDateTime(new Date())}.png`;
      downloadLink.click();
    });
  };

  return (
    <div>
      <Form
        className="export-image"
        {...formItemLayout}
        layout="vertical"
        name="dynamic_rule"
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
      >
        <Form.Item style={widthStyle}>
          <Bar options={borrowOpts} data={borrows} />
        </Form.Item>
        {/* <Form.Item style={widthStyle}>
          <Line options={returnOpts} data={returns} />
        </Form.Item>
        <Form.Item style={widthStyle}>
          <Line options={remindOpts} data={reminds} />
        </Form.Item>
        <Form.Item style={widthStyle}>
          <Line options={penaltyOpts} data={penalties} />
        </Form.Item> */}
      </Form>
      <div>
        <Button type="primary" onClick={exportReportToImage}>
          Export To PDF
        </Button>
      </div>
    </div>
  );
};

export default DocumentReportPage;
