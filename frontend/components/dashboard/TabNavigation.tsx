'use client';

interface TabNavigationProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export default function TabNavigation<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps<T>) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
