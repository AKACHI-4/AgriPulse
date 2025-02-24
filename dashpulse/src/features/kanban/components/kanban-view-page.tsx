import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import PlantIdEndpointsBoard from './plant-endpoint-board';

export default function KanbanViewPage() {
  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={`Prediction`} description='lorem ipsum' />
          {/* <NewTaskDialog /> */}
        </div>
        <PlantIdEndpointsBoard />
      </div>
    </PageContainer>
  );
}
