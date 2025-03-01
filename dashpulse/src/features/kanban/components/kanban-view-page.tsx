import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import PlantIdEndpointsBoard from './plant-endpoint-board';

export default function KanbanViewPage() {
  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={`Canopy 🌳`}
            description='AI-driven insights to predict and protect your crops 👨‍🌾'
          />
          {/* <NewTaskDialog /> */}
        </div>
        <PlantIdEndpointsBoard />
      </div>
    </PageContainer>
  );
}
