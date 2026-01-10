import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface Capability {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface Props {
  capabilities: Capability[];
}

export default function CapabilityAccordion({ capabilities }: Props) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-4">
      {capabilities.map((capability, index) => (
        <Accordion.Item
          key={index}
          value={`item-${index}`}
          className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <Accordion.Header>
            <Accordion.Trigger className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-teal-500 text-white shadow-md shrink-0">
                  <div
                    className="w-6 h-6"
                    dangerouslySetInnerHTML={{ __html: capability.icon.replace('w-12 h-12', 'w-6 h-6').replace('currentColor', 'white') }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {capability.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {capability.description}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-6 py-5 border-t border-gray-200 bg-gray-50">
            <ul className="space-y-3">
              {capability.features.map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-teal-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

