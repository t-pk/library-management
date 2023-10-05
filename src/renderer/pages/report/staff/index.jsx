import { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Form, Button } from 'antd';
import { Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import cloneDeep from 'lodash.clonedeep';
import { Borrow, Return, Remind, Penalty } from '../../../constants';
import { formatDateTime } from 'renderer/utils/helper';

const formItemLayout = {
  labelCol: { xs: { span: 49 }, sm: { span: 49 } },
  wrapperCol: { xs: { span: 49 }, sm: { span: 49 } },
};

const widthStyle = { minWidth: '49%' };

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

const StaffReportPage = (props) => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  const canvasRef = useRef();
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
      ],
    };
    const borrow = await props.invoke({ key: Borrow.report });
    const borrowReports = cloneDeep(iData);
    borrowReports.labels = borrow.data.labels;
    borrowReports.datasets[0].data = borrow.data.values;
    borrowReports.datasets[0].label = 'Số Phiếu Mượn';
    borrowReports.datasets[0].borderColor = '#4CD4FF';
    borrowReports.datasets[0].backgroundColor = '#A8EAFF';
    const iBorrowOpts = cloneDeep(options);
    iBorrowOpts.plugins.title.text = 'Thống Kê Phiếu Mượn';
    setBorrowOpts(iBorrowOpts);
    setBorrrows(borrowReports);

    const returns = await props.invoke({ key: Return.report });
    const returnReport = cloneDeep(iData);
    returnReport.labels = returns.data.labels;
    returnReport.datasets[0].data = returns.data.values;
    returnReport.datasets[0].label = 'Số Phiếu Trả';
    returnReport.datasets[0].borderColor = '#35EA95';
    returnReport.datasets[0].backgroundColor = '#77FEBE';
    const iReturnOpts = cloneDeep(options);
    iReturnOpts.plugins.title.text = 'Thống Kê Phiếu Trả';
    setReturnOpts(iReturnOpts);
    setReturns(returnReport);

    const reminds = await props.invoke({ key: Remind.report });
    const remindReport = cloneDeep(iData);
    remindReport.labels = reminds.data.labels;
    remindReport.datasets[0].data = reminds.data.values;
    remindReport.datasets[0].label = 'Số Phiếu Nhắc Nhở';
    remindReport.datasets[0].borderColor = '#FCD433';
    remindReport.datasets[0].backgroundColor = '#FFE88D';
    const iRemindOpts = cloneDeep(options);
    iRemindOpts.plugins.title.text = 'Thống Kê Phiếu Nhắc Nhở';
    setRemindOpts(iRemindOpts);
    setReminds(remindReport);

    const penalty = await props.invoke({ key: Penalty.report });
    const penaltyReport = cloneDeep(iData);
    penaltyReport.labels = penalty.data.labels;
    penaltyReport.datasets[0].data = penalty.data.values;
    penaltyReport.datasets[0].label = 'Số Phiếu Phạt';
    const iPenaltyOpts = cloneDeep(options);
    iPenaltyOpts.plugins.title.text = 'Thống Kê Phiếu Phạt';
    setPenaltyOpts(iPenaltyOpts);
    setPenalties(penaltyReport);
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
        ref={canvasRef}
        className="export-image"
        {...formItemLayout}
        layout="vertical"
        name="dynamic_rule"
        style={{ display: 'flex', flexWrap: 'wrap' }}
        scrollToFirstError
      >
        <Form.Item style={widthStyle}>
          <Line options={borrowOpts} data={borrows} />
        </Form.Item>
        <Form.Item style={widthStyle}>
          <Line options={returnOpts} data={returns} />
        </Form.Item>
        <Form.Item style={widthStyle}>
          <Line options={remindOpts} data={reminds} />
        </Form.Item>
        <Form.Item style={widthStyle}>
          <Line options={penaltyOpts} data={penalties} />
        </Form.Item>
      </Form>
      <div>
        <Button type="primary" onClick={exportReportToImage}>
          Export To PDF
        </Button>
      </div>
    </div>
  );
};

export default StaffReportPage;
