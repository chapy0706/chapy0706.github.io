import { CheckCircle2, TrendingDown, Users, Package } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
  iconName: string;
}

interface Props {
  stats: Stat[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle2,
  TrendingDown,
  Users,
  Package,
};

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.iconName];
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-center group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              {IconComponent && (
                <IconComponent className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-600">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}

