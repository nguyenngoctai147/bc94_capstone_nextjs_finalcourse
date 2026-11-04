import styles from "@/theme/features/dashboard/dashboard.module.css";

const CHART_COLOR = "#fe4e37";
const GRID_COLOR = "#dfe8f5";

const getRange = (values: number[]) => {
  const maximum = Math.max(...values, 1);
  const minimum = Math.min(...values, 0);
  return { maximum, span: Math.max(maximum - minimum, 1) };
};

const getPolylinePoints = (values: number[], width: number, height: number, inset = 0) => {
  const { maximum, span } = getRange(values);
  const usableWidth = width - inset * 2;
  const usableHeight = height - inset * 2;
  return values.map((value, index) => {
    const x = inset + (index / Math.max(values.length - 1, 1)) * usableWidth;
    const y = inset + ((maximum - value) / span) * usableHeight;
    return `${x},${y}`;
  }).join(" ");
};

export function Sparkline({ values, bars = false }: { values: number[]; bars?: boolean }) {
  const data = values.length > 1 ? values : [0, ...values];
  const maximum = Math.max(...data, 1);

  return (
    <svg className={styles.sparkline} viewBox="0 0 220 72" role="img" aria-label="Xu hướng thống kê">
      {bars ? data.map((value, index) => {
        const barWidth = 12;
        const gap = 7;
        const height = (value / maximum) * 60;
        return <rect key={index} x={index * (barWidth + gap)} y={68 - height} width={barWidth} height={height} rx="2" fill={CHART_COLOR} opacity=".9" />;
      }) : <polyline points={getPolylinePoints(data, 220, 72, 6)} fill="none" stroke={CHART_COLOR} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

export function LineChart({ values, labels }: { values: number[]; labels: string[] }) {
  const data = values.length > 1 ? values : [0, ...values];
  const chartWidth = 1100;
  const chartHeight = 360;
  const left = 58;
  const right = 18;
  const top = 20;
  const bottom = 42;
  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;
  const maximum = Math.max(...data, 1);
  const ceiling = Math.ceil(maximum / 5) * 5 || 5;
  const points = data.map((value, index) => {
    const x = left + (index / Math.max(data.length - 1, 1)) * plotWidth;
    const y = top + (1 - value / ceiling) * plotHeight;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className={styles.chartScroll}>
      <svg className={styles.largeChart} viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Biểu đồ dữ liệu đặt phòng theo thời gian">
        {[0, 1, 2, 3, 4].map((step) => {
          const y = top + (step / 4) * plotHeight;
          const value = Math.round(ceiling * (1 - step / 4));
          return <g key={step}><line x1={left} y1={y} x2={chartWidth - right} y2={y} stroke={GRID_COLOR} /><text x={left - 12} y={y + 4} textAnchor="end" className={styles.axisText}>{value}</text></g>;
        })}
        {labels.map((label, index) => {
          const x = left + (index / Math.max(labels.length - 1, 1)) * plotWidth;
          return <g key={`${label}-${index}`}><line x1={x} y1={top} x2={x} y2={chartHeight - bottom} stroke={GRID_COLOR} opacity=".65" /><text x={x} y={chartHeight - 14} textAnchor="middle" className={styles.axisText}>{label}</text></g>;
        })}
        <polyline points={points} fill="none" stroke={CHART_COLOR} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const chartWidth = 920;
  const chartHeight = 340;
  const left = 60;
  const right = 18;
  const top = 18;
  const bottom = 46;
  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;
  const maximum = Math.max(...values, 1);
  const ceiling = Math.ceil(maximum / 4) * 4 || 4;
  const slot = plotWidth / Math.max(values.length, 1);
  const barWidth = Math.min(34, slot * .58);

  return (
    <div className={styles.chartScroll}>
      <svg className={styles.barChart} viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Biểu đồ doanh thu theo tháng">
        {[0, 1, 2, 3, 4].map((step) => {
          const y = top + (step / 4) * plotHeight;
          const value = Math.round(ceiling * (1 - step / 4));
          return <g key={step}><line x1={left} y1={y} x2={chartWidth - right} y2={y} stroke={GRID_COLOR} /><text x={left - 12} y={y + 4} textAnchor="end" className={styles.axisText}>{value}</text></g>;
        })}
        {values.map((value, index) => {
          const height = (value / ceiling) * plotHeight;
          const x = left + index * slot + (slot - barWidth) / 2;
          const y = top + plotHeight - height;
          return <g key={`${labels[index]}-${index}`}><rect x={x} y={y} width={barWidth} height={height} rx="4" fill={CHART_COLOR} opacity=".92" /><text x={x + barWidth / 2} y={chartHeight - 16} textAnchor="middle" className={styles.axisText}>{labels[index]}</text></g>;
        })}
      </svg>
    </div>
  );
}

export function DonutChart({ percentage, label }: { percentage: number; label: string }) {
  const value = Math.min(100, Math.max(0, percentage));
  const radius = 82;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={styles.donutWrap}>
      <svg className={styles.donut} viewBox="0 0 220 220" role="img" aria-label={`${label}: ${value}%`}>
        <circle cx="110" cy="110" r={radius} fill="none" stroke="#e9edf2" strokeWidth="14" />
        <circle cx="110" cy="110" r={radius} fill="none" stroke={CHART_COLOR} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${circumference * value / 100} ${circumference}`} transform="rotate(-90 110 110)" />
        <text x="110" y="101" textAnchor="middle" className={styles.donutLabel}>{label}</text>
        <text x="110" y="137" textAnchor="middle" className={styles.donutValue}>{value}%</text>
      </svg>
    </div>
  );
}
