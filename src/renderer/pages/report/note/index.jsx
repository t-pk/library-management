import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = {
  title: {
    text: 'My chart',
  },
  yAxis: [
    {
      title: {
        text: 'Số lượng Tài Liệu (cuốn)',
      },
    },
  ],
  series: [
    {
      type: 'column',
      name: 'Jane',
      data: [3, 2, 1, 3, 4],
    },
    {
      type: 'column',
      name: 'John',
      data: [2, 3, 5, 7, 6],
    },
    {
      type: 'column',
      name: 'Joe',
      data: [4, 3, 3, 9, 0],
    },
    {
      type: 'spline',
      name: 'Average',
      data: [3, 2.67, 3, 6.33, 3.33],
    },
  ],
};

const NoteReportPage = () => (
  <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
);

export default NoteReportPage;
