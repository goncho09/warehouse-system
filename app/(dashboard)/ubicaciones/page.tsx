import LocationsView from '@/components/locations/LocationsView';
import { locations } from '@/data/locations';

export default function LocationsPage() {
  return <LocationsView locations={locations} />;
}
