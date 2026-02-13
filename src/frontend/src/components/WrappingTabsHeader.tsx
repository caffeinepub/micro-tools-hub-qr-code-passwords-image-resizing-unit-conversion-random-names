import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  value: string;
  label: string;
}

interface WrappingTabsHeaderProps {
  tabs: Tab[];
}

export function WrappingTabsHeader({ tabs }: WrappingTabsHeaderProps) {
  return (
    <TabsList className="h-auto w-full flex flex-wrap justify-center gap-1 p-1">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="whitespace-nowrap"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
