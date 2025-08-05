import { ChartData } from "@/types";

interface ChartProps {
  data: ChartData[];
  type: "bar" | "pie";
  height?: number;
}

export function Chart({ data, type, height = 256 }: ChartProps) {
  if (type === "bar") {
    return (
      <div className="flex items-end justify-around p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div 
              className="w-8 bg-primary rounded-t transition-all duration-500"
              style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * (height - 80)}px` }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "pie") {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    const segments = data.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const segment = {
        ...item,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
      };
      currentAngle += angle;
      return segment;
    });

    const gradientColors = segments.map((segment, index) => 
      segment.color || `hsl(${(index * 360) / segments.length}, 70%, 60%)`
    );

    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="relative w-40 h-40">
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${gradientColors.map((color, index) => 
                `${color} ${segments[index]?.startAngle || 0}deg ${segments[index]?.endAngle || 0}deg`
              ).join(', ')})`
            }}
          />
          <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
